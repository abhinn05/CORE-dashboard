import dotenv from 'dotenv';
dotenv.config();

/* global process */
import express from 'express';
import cors from 'cors';
import cron from "node-cron";
import { exec } from "child_process";

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { formatMarketQuote, computeSpreadValue, formatPercentChange } from '../src/utils/marketUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(

    cors({

        origin: true,

        credentials: true,

    })

);
app.use(express.json());

const DEFAULT_YAHOO_MARKET_SYMBOLS = ['CL=F', 'BZ=F', 'DX-Y.NYB', '^OVX', 'HO=F'];
const DEFAULT_YAHOO_CORRELATION_SYMBOLS = ['CL=F', 'BZ=F', 'HO=F', 'RB=F', 'NG=F', 'DX-Y.NYB'];
const DEFAULT_YAHOO_CURVE_SYMBOLS = [
  'CL=F',
  'CLN26.NYM',
  'CLQ26.NYM',
  'CLU26.NYM',
  'CLV26.NYM',
  'CLX26.NYM',
  'CLZ26.NYM',
  'CLF27.NYM',
  'CLG27.NYM',
  'CLH27.NYM',
  'CLJ27.NYM',
  'CLK27.NYM',
];
const yahooCache = new Map();
const fredCache = new Map();

function listFromEnv(name, fallback) {
  return process.env[name]
    ? process.env[name].split(',').map((symbol) => symbol.trim()).filter(Boolean)
    : fallback;
}

function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

function compactNumber(value, digits = 2) {
  return Number.isFinite(value) ? round(value, digits) : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isPlaceholderUrl(url) {
  return !url || /your-.*api\.example\.com/i.test(url);
}

function getYahooMarketSymbols() {
  return listFromEnv('YAHOO_MARKET_SYMBOLS', DEFAULT_YAHOO_MARKET_SYMBOLS);
}

function yahooChartUrl(symbol, { range = '1d', interval = '1m' } = {}) {
  return `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
}

function formatYahooChartQuote(symbol, json) {
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) return null;

  const previousClose = meta.chartPreviousClose ?? meta.previousClose;
  const changePercent = previousClose
    ? Number((((meta.regularMarketPrice - previousClose) / previousClose) * 100).toFixed(2))
    : null;

  return {
    symbol: meta.symbol ?? symbol,
    regularMarketPrice: meta.regularMarketPrice,
    regularMarketChangePercent: changePercent,
    regularMarketVolume: meta.regularMarketVolume,
  };
}

function yahooCloseSeries(json) {
  const result = json?.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const close = result?.indicators?.quote?.[0]?.close ?? [];

  return close
    .map((value, index) => ({
      ts: timestamps[index],
      value: Number(value),
    }))
    .filter((point) => Number.isFinite(point.value));
}

async function fetchYahooChart(symbol, options = {}) {
  const url = yahooChartUrl(symbol, options);
  const cacheKey = `${symbol}:${options.range ?? '1d'}:${options.interval ?? '1m'}`;
  const cached = yahooCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < 900) {
    return cached.data;
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  if (!response.ok) {
    throw new Error(`Yahoo request failed for ${symbol}: ${response.status}`);
  }

  const data = await response.json();
  yahooCache.set(cacheKey, { ts: Date.now(), data });
  return data;
}

async function fetchYahooChartQuotes() {
  const quoteRequests = getYahooMarketSymbols().map(async (symbol) => {
    const json = await fetchYahooChart(symbol);
    return formatYahooChartQuote(symbol, json);
  });
  const quotes = (await Promise.all(quoteRequests)).filter(Boolean);
  if (quotes.length === 0) {
    throw new Error('Yahoo Finance returned no market quotes');
  }
  return quotes;
}

async function fetchYahooSeries(symbol, options = { range: '1mo', interval: '1d' }) {
  const json = await fetchYahooChart(symbol, options);
  return yahooCloseSeries(json);
}

function parseFredCsv(csv) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, rawValue] = line.split(',');
      const value = Number(rawValue);
      return { date, value };
    })
    .filter((point) => point.date && Number.isFinite(point.value));
}

async function fetchFredSeries(seriesId) {
  const cacheKey = `fred:${seriesId}`;
  const cached = fredCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < 60 * 60 * 1000) {
    return cached.data;
  }

  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(seriesId)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  if (!response.ok) {
    throw new Error(`FRED request failed for ${seriesId}: ${response.status}`);
  }

  const data = parseFredCsv(await response.text());
  if (data.length === 0) {
    throw new Error(`FRED returned no data for ${seriesId}`);
  }

  fredCache.set(cacheKey, { ts: Date.now(), data });
  return data;
}

function fredLatestChange(series) {
  const latestPoint = series[series.length - 1];
  const previousPoint = series[series.length - 2];
  return {
    latest: latestPoint?.value ?? null,
    previous: previousPoint?.value ?? null,
    date: latestPoint?.date ?? 'Live',
    change: Number.isFinite(latestPoint?.value) && Number.isFinite(previousPoint?.value)
      ? round(latestPoint.value - previousPoint.value, 2)
      : null,
  };
}

function yearOverYear(series) {
  const latestPoint = series[series.length - 1];
  const yearAgoPoint = series[series.length - 13] ?? series[0];
  const previousPoint = series[series.length - 2];
  const previousYearAgoPoint = series[series.length - 14] ?? series[0];
  const value = latestPoint?.value && yearAgoPoint?.value
    ? ((latestPoint.value - yearAgoPoint.value) / yearAgoPoint.value) * 100
    : null;
  const previous = previousPoint?.value && previousYearAgoPoint?.value
    ? ((previousPoint.value - previousYearAgoPoint.value) / previousYearAgoPoint.value) * 100
    : null;

  return {
    value: compactNumber(value, 1),
    change: Number.isFinite(value) && Number.isFinite(previous) ? round(value - previous, 1) : null,
    date: latestPoint?.date ?? 'Live',
  };
}

function eiaApiKey() {
  return (process.env.API_INVENTORY_URL_QUERY_api_key || process.env.API_INVENTORY_URL_KEY || '').trim();
}

async function fetchEiaWeeklySeries(series, { route = 'petroleum/move/wkly', length = 12 } = {}) {
  const url = new URL(`https://api.eia.gov/v2/${route}/data/`);
  url.searchParams.set('frequency', 'weekly');
  url.searchParams.set('data[0]', 'value');
  url.searchParams.set('facets[series][]', series);
  url.searchParams.set('sort[0][column]', 'period');
  url.searchParams.set('sort[0][direction]', 'desc');
  url.searchParams.set('offset', '0');
  url.searchParams.set('length', String(length));

  const key = eiaApiKey();
  if (key) {
    url.searchParams.set('api_key', key);
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  if (!response.ok) {
    throw new Error(`EIA request failed for ${series}: ${response.status}`);
  }

  const data = (await response.json())?.response?.data ?? [];
  return data
    .slice()
    .reverse()
    .map((point, index) => ({
      week: point.period ?? `W${index + 1}`,
      value: Number(point.value),
    }))
    .filter((point) => Number.isFinite(point.value));
}

function latestDelta(series) {
  const latestPoint = series[series.length - 1];
  const previousPoint = series[series.length - 2];
  return Number.isFinite(latestPoint?.value) && Number.isFinite(previousPoint?.value)
    ? latestPoint.value - previousPoint.value
    : 0;
}

function classifyNews(text) {
  const value = text.toLowerCase();
  if (/(inventory|stockpile|stockpiles|eia|storage)/.test(value)) return 'Inventories';
  if (/(opec|supply|production|output|export|exports|pipeline|refinery)/.test(value)) return 'Supply';
  if (/(demand|china|india|consumption|growth|pmi)/.test(value)) return 'Demand';
  if (/(dollar|fed|rate|inflation|macro|recession|gdp)/.test(value)) return 'Macro';
  if (/(war|sanction|red sea|attack|conflict|middle east|russia|iran)/.test(value)) return 'Geopolitical';
  return 'Market';
}

function scoreNews(text) {
  const value = text.toLowerCase();
  const bullishHits = [
    'draw', 'drawdown', 'cut', 'cuts', 'tight', 'shortage', 'disruption',
    'sanction', 'attack', 'rally', 'higher', 'surge', 'bullish', 'weak dollar',
  ].filter((word) => value.includes(word)).length;
  const bearishHits = [
    'build', 'rise in inventories', 'glut', 'oversupply', 'demand weak',
    'slowdown', 'recession', 'lower', 'drop', 'fall', 'bearish', 'strong dollar',
  ].filter((word) => value.includes(word)).length;
  const score = bullishHits - bearishHits;
  return {
    sentiment: score >= 0 ? 'Bullish' : 'Bearish',
    impact: clamp(round(5 + Math.abs(score) * 0.9 + Math.min(value.length / 220, 2), 1), 5, 9.5),
  };
}

function latest(series) {
  return series[series.length - 1]?.value ?? null;
}

function alignSeries(primary, secondary) {
  const secondaryByTs = new Map(secondary.map((point) => [point.ts, point.value]));
  return primary
    .map((point) => [point.value, secondaryByTs.get(point.ts)])
    .filter((pair) => pair.every(Number.isFinite));
}

function returns(values) {
  const output = [];
  for (let i = 1; i < values.length; i += 1) {
    if (values[i - 1] && Number.isFinite(values[i])) {
      output.push((values[i] - values[i - 1]) / values[i - 1]);
    }
  }
  return output;
}

function correlation(aValues, bValues) {
  const n = Math.min(aValues.length, bValues.length);
  if (n < 3) return 0;
  const a = aValues.slice(-n);
  const b = bValues.slice(-n);
  const meanA = a.reduce((sum, value) => sum + value, 0) / n;
  const meanB = b.reduce((sum, value) => sum + value, 0) / n;
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;

  for (let i = 0; i < n; i += 1) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    numerator += da * db;
    denomA += da ** 2;
    denomB += db ** 2;
  }

  const denominator = Math.sqrt(denomA * denomB);
  return denominator ? round(numerator / denominator, 2) : 0;
}

async function fetchLiveCrackSpread() {
  const [wti, gasoline, heatingOil] = await Promise.all([
    fetchYahooSeries('CL=F'),
    fetchYahooSeries('RB=F'),
    fetchYahooSeries('HO=F'),
  ]);

  const gasByTs = new Map(gasoline.map((point) => [point.ts, point.value]));
  const heatByTs = new Map(heatingOil.map((point) => [point.ts, point.value]));

  const crack = wti
    .map((point) => {
      const gas = gasByTs.get(point.ts);
      const heat = heatByTs.get(point.ts);
      if (![gas, heat, point.value].every(Number.isFinite)) return null;
      const value = ((2 * gas * 42) + (heat * 42) - (3 * point.value)) / 3;
      return {
        week: new Date(point.ts * 1000).toLocaleTimeString('en-US', { month: 'short', day: 'numeric' }),
        crack: round(value, 2),
      };
    })
    .filter(Boolean)
    .slice(-24);

  if (crack.length === 0) {
    throw new Error('Yahoo Finance returned no crack spread points');
  }

  return crack;
}

async function fetchLiveCurve() {
  const symbols = listFromEnv('YAHOO_CURVE_SYMBOLS', DEFAULT_YAHOO_CURVE_SYMBOLS);
  const points = await Promise.all(symbols.map(async (symbol, index) => {
    try {
      const json = await fetchYahooChart(symbol);
      const quote = formatYahooChartQuote(symbol, json);
      if (!quote) return null;
      return {
        month: `M${index + 1}`,
        price: compactNumber(quote.regularMarketPrice, 2),
      };
    } catch {
      return null;
    }
  }));

  const curve = points.filter((point) => point?.price != null);
  if (curve.length < 2) {
    throw new Error('Yahoo Finance returned too few curve points');
  }

  return curve;
}

async function fetchLiveCorrelation() {
  const symbols = listFromEnv('YAHOO_CORRELATION_SYMBOLS', DEFAULT_YAHOO_CORRELATION_SYMBOLS);
  const entries = await Promise.all(symbols.map(async (symbol) => {
    const series = await fetchYahooSeries(symbol);
    return [symbol, series];
  }));
  const bySymbol = Object.fromEntries(entries);
  const wti = bySymbol['CL=F'];
  if (!wti?.length) {
    throw new Error('Yahoo Finance returned no WTI history');
  }

  const labels = {
    'BZ=F': 'WTI vs Brent',
    'HO=F': 'WTI vs Heating Oil',
    'RB=F': 'WTI vs Gasoline',
    'NG=F': 'WTI vs Nat Gas',
    'DX-Y.NYB': 'WTI vs DXY',
  };

  return Object.entries(labels)
    .map(([symbol, label]) => {
      const aligned = alignSeries(wti, bySymbol[symbol] ?? []);
      const wtiReturns = returns(aligned.map(([value]) => value));
      const otherReturns = returns(aligned.map(([, value]) => value));
      return { asset: label, value: correlation(wtiReturns, otherReturns) };
    })
    .filter((item) => Number.isFinite(item.value));
}

async function fetchLiveInventory() {
  const remoteUrl = process.env.API_INVENTORY_URL;
  if (!remoteUrl || isPlaceholderUrl(remoteUrl)) {
    return [];
  }

  const url = new URL(remoteUrl);
  Object.keys(process.env).forEach((key) => {
    const prefix = 'API_INVENTORY_URL_QUERY_';
    if (key.startsWith(prefix) && process.env[key]) {
      url.searchParams.append(key.slice(prefix.length), process.env[key]);
    }
  });

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  if (!response.ok) {
    throw new Error(`EIA inventory request failed: ${response.status}`);
  }

  const normalized = normalizeFeed('inventory', await response.json());
  return Array.isArray(normalized) ? normalized.filter((point) => Number.isFinite(point.inventory)) : [];
}

async function fetchLiveShipping() {
  const [imports, exports, stocks] = await Promise.all([
    fetchEiaWeeklySeries('WCRIMUS2', { route: 'petroleum/move/wkly', length: 12 }),
    fetchEiaWeeklySeries('WCREXUS2', { route: 'petroleum/move/wkly', length: 12 }),
    fetchLiveInventory(),
  ]);

  if (imports.length === 0 || exports.length === 0) {
    throw new Error('EIA returned too few shipping-flow points');
  }

  const exportsByWeek = new Map(exports.map((point) => [point.week, point.value]));
  const stocksByWeek = new Map(stocks.map((point) => [point.week, point.inventory]));
  const flowSeries = imports
    .map((point) => {
      const exportValue = exportsByWeek.get(point.week) ?? 0;
      const stockValue = stocksByWeek.get(point.week);
      const netFlow = point.value + exportValue;
      return {
        week: point.week,
        imports: point.value,
        exports: exportValue,
        stocks: stockValue,
        freight: round(netFlow / 200, 0),
      };
    })
    .slice(-8);

  const latestPoint = flowSeries[flowSeries.length - 1];
  const previousPoint = flowSeries[flowSeries.length - 2] ?? latestPoint;
  const importDelta = latestDelta(imports);
  const exportDelta = latestDelta(exports);
  const stockDelta = stocks.length > 1
    ? stocks[stocks.length - 1].inventory - stocks[stocks.length - 2].inventory
    : 0;
  const flowPressure = clamp(round((latestPoint.imports + latestPoint.exports) / 120, 0), 0, 100);
  const exportPressure = clamp(round(latestPoint.exports / 70, 0), 0, 100);
  const importPressure = clamp(round(latestPoint.imports / 90, 0), 0, 100);
  const congestion = clamp(round(flowPressure + Math.max(0, exportDelta) / 80 + Math.max(0, importDelta) / 100, 0), 0, 100);
  const storagePressure = clamp(round(50 + Math.abs(stockDelta) * 6, 0), 0, 100);
  const volatilityPressure = clamp(round(50 + Math.abs(latestPoint.freight - previousPoint.freight) * 4, 0), 0, 100);

  return {
    shippingData: flowSeries,
    shippingMetrics: {
      vlcc: exportPressure,
      suezmax: flowPressure,
      aframax: importPressure,
      balticDirty: round(latestPoint.imports + latestPoint.exports, 0),
      redSeaRisk: congestion,
      transitDelay: clamp(round(congestion / 12, 1), 0, 14),
      floatingStorage: storagePressure,
      portCongestion: congestion,
      weatherRisk: volatilityPressure,
    },
  };
}

async function fetchLiveNews() {
  const configuredUrl = process.env.API_NEWS_URL;
  if (!configuredUrl || isPlaceholderUrl(configuredUrl)) {
    throw new Error('NewsAPI URL is not configured');
  }

  const url = new URL(configuredUrl);
  const apiKey = (process.env.API_NEWS_URL_QUERY_apiKey || process.env.API_NEWS_URL_KEY || '').trim();
  if (apiKey) {
    url.searchParams.set('apiKey', apiKey);
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  const json = await response.json();
  if (!response.ok || json.status === 'error') {
    throw new Error(json.message || `NewsAPI request failed: ${response.status}`);
  }

  return normalizeFeed('news', json);
}

async function fetchLiveCftc() {
  const query = [
    "SELECT report_date_as_yyyy_mm_dd, open_interest_all, m_money_positions_long_all, m_money_positions_short_all",
    "WHERE market_and_exchange_names LIKE '%CRUDE OIL, LIGHT SWEET%'",
    "ORDER BY report_date_as_yyyy_mm_dd DESC",
    "LIMIT 8",
  ].join(' ');
  const url = new URL('https://publicreporting.cftc.gov/resource/72hh-3qpy.json');
  url.searchParams.set('$query', query);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  if (!response.ok) {
    throw new Error(`CFTC request failed: ${response.status}`);
  }

  const rows = await response.json();
  const normalized = rows
    .slice()
    .reverse()
    .map((row, index) => ({
      week: row.report_date_as_yyyy_mm_dd
        ? new Date(row.report_date_as_yyyy_mm_dd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `W${index + 1}`,
      longs: round(Number(row.m_money_positions_long_all) / 1000, 0),
      shorts: round(Number(row.m_money_positions_short_all) / 1000, 0),
      oi: round(Number(row.open_interest_all) / 1000, 0),
    }))
    .filter((point) => [point.longs, point.shorts, point.oi].every(Number.isFinite));

  if (normalized.length === 0) {
    throw new Error('CFTC returned no crude positioning rows');
  }

  return normalized;
}

function regionRiskFromArticles(region, keywords, articles) {
  const matches = articles.filter((article) => {
    const text = `${article.title ?? ''} ${article.description ?? ''} ${article.content ?? ''}`.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
  const risk = clamp(20 + matches.length * 15, 10, 95);
  const latest = matches[0];
  return {
    region,
    risk,
    status: risk >= 85 ? 'HIGH' : risk >= 65 ? 'ELEVATED' : 'WATCH',
    description: latest?.title ?? `${region} headline risk remains monitored`,
  };
}

async function fetchLiveGeopolitical() {
  const configuredUrl = process.env.API_NEWS_URL;
  if (!configuredUrl || isPlaceholderUrl(configuredUrl)) {
    throw new Error('NewsAPI URL is not configured');
  }

  const url = new URL(configuredUrl);
  url.searchParams.set('q', 'oil AND (war OR sanctions OR OPEC OR Red Sea OR Iran OR Russia OR conflict OR attack)');
  url.searchParams.set('pageSize', '30');
  const apiKey = (process.env.API_NEWS_URL_QUERY_apiKey || process.env.API_NEWS_URL_KEY || '').trim();
  if (apiKey) {
    url.searchParams.set('apiKey', apiKey);
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  const json = await response.json();
  if (!response.ok || json.status === 'error') {
    throw new Error(json.message || `NewsAPI geopolitical request failed: ${response.status}`);
  }

  const articles = Array.isArray(json.articles) ? json.articles.filter((article) => article.title && article.title !== '[Removed]') : [];
  if (articles.length === 0) {
    throw new Error('NewsAPI returned no geopolitical articles');
  }

  return [
    regionRiskFromArticles('Middle East', ['iran', 'israel', 'middle east', 'gulf', 'hormuz'], articles),
    regionRiskFromArticles('Russia', ['russia', 'russian', 'sanction', 'ukraine'], articles),
    regionRiskFromArticles('Red Sea', ['red sea', 'houthi', 'suez', 'shipping'], articles),
    regionRiskFromArticles('OPEC', ['opec', 'saudi', 'production cut', 'output cut'], articles),
  ];
}

async function fetchLiveQuant() {
  const [correlations, wti, brent, dxy, inventory] = await Promise.all([
    fetchLiveCorrelation(),
    fetchYahooSeries('CL=F'),
    fetchYahooSeries('BZ=F'),
    fetchYahooSeries('DX-Y.NYB'),
    fetchLiveInventory().catch(() => []),
  ]);

  const wtiReturns = returns(wti.map((point) => point.value));
  const brentReturns = returns(alignSeries(wti, brent).map(([, value]) => value));
  const dxyReturns = returns(alignSeries(wti, dxy).map(([, value]) => value));
  const latestWti = latest(wti);
  const firstWti = wti[0]?.value;
  const latestBrent = latest(brent);
  const spread = Number.isFinite(latestWti) && Number.isFinite(latestBrent) ? latestWti - latestBrent : null;
  const spreadHistory = alignSeries(wti, brent).map(([wtiValue, brentValue]) => wtiValue - brentValue);
  const spreadMean = spreadHistory.reduce((sum, value) => sum + value, 0) / Math.max(spreadHistory.length, 1);
  const spreadStd = Math.sqrt(spreadHistory.reduce((sum, value) => sum + ((value - spreadMean) ** 2), 0) / Math.max(spreadHistory.length, 1));
  const zScore = spreadStd && spread !== null ? round((spread - spreadMean) / spreadStd, 2) : null;
  const momentum = firstWti && latestWti !== null ? ((latestWti - firstWti) / firstWti) * 100 : null;
  const volatility = Math.sqrt(wtiReturns.reduce((sum, value) => sum + (value ** 2), 0) / Math.max(wtiReturns.length, 1)) * Math.sqrt(252) * 100;
  const beta = correlation(wtiReturns, brentReturns);
  const dxyBeta = correlation(wtiReturns, dxyReturns);
  const inventoryDeltas = inventory
    .map((point, index) => index === 0 ? null : point.inventory - inventory[index - 1].inventory)
    .filter(Number.isFinite);
  const latestInventoryDelta = inventoryDeltas[inventoryDeltas.length - 1] ?? null;
  const averageInventoryDelta = inventoryDeltas.reduce((sum, value) => sum + value, 0) / Math.max(inventoryDeltas.length, 1);
  const inventorySurprise = latestInventoryDelta !== null ? clamp(round(50 + Math.abs(latestInventoryDelta - averageInventoryDelta) * 8, 0), 0, 100) : null;

  return {
    correlationMatrix: correlations.map((item) => item.value),
    betaSeries: wti.length > 0 ? wti.slice(-8).map((point, index) => ({
      name: new Date(point.ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      beta: round(beta, 2),
    })) : [],
    volatilityRegimes: volatility > 0 ? (volatility > 45
      ? ['Moderate', 'High', 'Extreme', 'Extreme']
      : volatility > 25
      ? ['Low', 'Moderate', 'High', 'High']
      : ['Low', 'Low', 'Moderate', 'Moderate']) : [],
    momentumSignals: momentum !== null ? [
      { asset: 'WTI', signal: momentum >= 0 ? 'BUY' : 'SELL' },
      { asset: 'Brent', signal: beta >= 0 ? 'BUY' : 'SELL' },
      { asset: 'DXY', signal: dxyBeta < 0 ? 'BUY' : 'SELL' },
    ] : [],
    zScore,
    arbitrage: {
      strategy: zScore !== null ? (Math.abs(zScore) > 1 ? 'Mean Reversion' : 'Carry Watch') : 'N/A',
      description: spread !== null && zScore !== null ? `WTI-Brent spread at ${round(spread, 2)} with ${zScore} sigma deviation` : 'Waiting for data...',
    },
    signalStrengths: momentum !== null && zScore !== null && spread !== null && inventorySurprise !== null ? [
      { name: 'Momentum', value: Math.min(100, Math.max(0, round(Math.abs(momentum) * 10 + 50, 0))) },
      { name: 'Mean Reversion', value: Math.min(100, Math.max(0, round(Math.abs(zScore) * 25 + 50, 0))) },
      { name: 'Spread Strength', value: Math.min(100, Math.max(0, round(Math.abs(spread) * 12, 0))) },
      { name: 'Inventory Surprise', value: inventorySurprise },
    ] : [],
    stats: momentum !== null && volatility > 0 ? [
      { label: 'Sharpe', value: String(round(momentum / volatility, 2)) },
      { label: 'VaR', value: `${round(volatility / 16, 1)}%` },
      { label: 'Skew', value: String(round(dxyBeta, 2)) },
      { label: 'Kurtosis', value: String(round(volatility / 10, 1)) },
    ] : [],
  };
}

async function fetchLiveMacro() {
  const [quote, cpiSeries, fedFundsSeries, gdpSeries, payrollSeries, pmiSeries] = await Promise.all([
    fetchYahooChart('DX-Y.NYB').then((json) => formatYahooChartQuote('DX-Y.NYB', json)),
    fetchFredSeries(process.env.FRED_CPI_SERIES || 'CPIAUCSL'),
    fetchFredSeries(process.env.FRED_FED_FUNDS_SERIES || 'FEDFUNDS'),
    fetchFredSeries(process.env.FRED_GDP_SERIES || 'A191RL1Q225SBEA'),
    fetchFredSeries(process.env.FRED_PAYROLLS_SERIES || 'PAYEMS'),
    fetchFredSeries(process.env.FRED_PMI_SERIES || 'NAPM'),
  ]);
  const dxyChange = quote?.regularMarketChangePercent ?? null;
  const cpi = yearOverYear(cpiSeries);
  const fedFunds = fredLatestChange(fedFundsSeries);
  const gdp = fredLatestChange(gdpSeries);
  const pmi = fredLatestChange(pmiSeries);
  const payrollLatest = payrollSeries[payrollSeries.length - 1];
  const payrollPrevious = payrollSeries[payrollSeries.length - 2];
  const payrollPrior = payrollSeries[payrollSeries.length - 3];
  const payrollValue = Number.isFinite(payrollLatest?.value) && Number.isFinite(payrollPrevious?.value)
    ? round(payrollLatest.value - payrollPrevious.value, 0)
    : null;
  const payrollChange = Number.isFinite(payrollPrevious?.value) && Number.isFinite(payrollPrior?.value)
    ? round(payrollValue - (payrollPrevious.value - payrollPrior.value), 0)
    : null;

  const macroScore = dxyChange != null && pmi.latest != null ? clamp(round(50 - (dxyChange * 10) + (pmi.latest - 50) * 2, 0), 0, 100) : null;
  const oilImpact = macroScore != null ? (macroScore > 60 ? 'Strong Positive' : macroScore < 40 ? 'Negative' : 'Neutral') : null;

  return {
    dxy: {
      value: quote?.regularMarketPrice ?? null,
      change: dxyChange,
    },
    cpi: {
      value: cpi.value ?? null,
      change: cpi.change,
    },
    fedFunds: {
      value: compactNumber(fedFunds.latest, 2) ?? null,
      change: fedFunds.change,
    },
    gdp: {
      value: compactNumber(gdp.latest, 1) ?? null,
      change: gdp.change,
    },
    payrolls: {
      value: payrollValue,
      change: payrollChange,
    },
    pmi: {
      value: compactNumber(pmi.latest, 1) ?? null,
      change: pmi.change,
    },
    macroScore: macroScore != null ? `${macroScore}%` : "N/A",
    oilImpact: oilImpact ?? "N/A",
    economicCalendar: [
      { event: 'DXY', impact: dxyChange != null ? (dxyChange > 0 ? 'Bearish Crude' : 'Bullish Crude') : 'N/A', date: 'Live' },
      { event: 'CPI YoY', impact: 'High', date: cpi.date },
      { event: 'Fed Funds', impact: 'High', date: fedFunds.date },
      { event: 'Real GDP', impact: 'High', date: gdp.date },
      { event: 'Non Farm Payrolls', impact: 'High', date: payrollLatest?.date ?? 'Live' },
      { event: 'Manufacturing PMI', impact: 'Medium', date: pmi.date },
    ],
  };
}

function normalizeFeed(feedName, json) {
  if (!json) return json;

  if (feedName === 'market') {
    const quotes = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.quotes)
      ? json.quotes
      : Array.isArray(json.quoteResponse?.result)
      ? json.quoteResponse.result
      : Array.isArray(json.finance?.result)
      ? json.finance.result
      : Array.isArray(json.results)
      ? json.results
      : null;

    if (Array.isArray(quotes) && quotes.length > 0) {
      const kpis = quotes.map(formatMarketQuote);
      const marketById = Object.fromEntries(kpis.map((item) => [item.id, item]));
      const spreadValue = computeSpreadValue(marketById);
      const brentValue = Number(marketById.brent?.value);
      const spreadPercent = spreadValue != null && Number.isFinite(brentValue) && brentValue !== 0
        ? (spreadValue / brentValue) * 100
        : null;
      const spreadMetric = {
        id: 'spread',
        label: 'WTI-Brent Spread',
        value: spreadValue != null ? String(spreadValue) : '-',
        change: formatPercentChange(spreadPercent),
        trend: spreadValue > 0 ? 'WTI Premium' : spreadValue < 0 ? 'Brent Premium' : 'Neutral',
        severity: Math.abs(spreadPercent ?? 0) > 3 ? 'High' : Math.abs(spreadPercent ?? 0) > 1 ? 'Medium' : 'Low',
      };
      const wtiValue = Number(marketById.wti?.value) || 0;
      const ovxValue = Number(marketById.ovx?.value) || 0;
      const alertRules = [];
      if (wtiValue > 0) {
        alertRules.push({
          id: 'wti-alert',
          title: 'WTI Price Alert',
          value: wtiValue,
          severity: wtiValue >= 85 ? 'High' : 'Medium',
          status: wtiValue >= 85 ? 'At or above upper resistance' : 'Approaching upper resistance',
          message: wtiValue >= 85 ? 'At or above upper resistance' : 'Approaching upper resistance',
          description: wtiValue >= 85 ? 'At or above upper resistance' : 'Approaching upper resistance',
          timestamp: 'Live',
        });
      }
      if (ovxValue > 0) {
        alertRules.push({
          id: 'ovx-alert',
          title: 'OVX Volatility Spike',
          value: ovxValue,
          severity: ovxValue >= 40 ? 'High' : 'Low',
          status: ovxValue >= 40 ? 'Energy volatility is elevated' : 'Energy volatility remains contained',
          message: ovxValue >= 40 ? 'Energy volatility is elevated' : 'Energy volatility remains contained',
          description: ovxValue >= 40 ? 'Energy volatility is elevated' : 'Energy volatility remains contained',
          timestamp: 'Live',
        });
      }

      return {
        ...marketById,
        spread: spreadMetric,
        kpis: [...kpis.filter((item) => item.id !== 'spread'), spreadMetric],
        alertRules,
        priceHistory: [],
      };
    }
  }

  if (feedName === 'inventory') {
    const legacySeriesData = json.series?.[0]?.data;
    if (Array.isArray(legacySeriesData)) {
      return legacySeriesData
        .slice()
        .reverse()
        .map((point, index) => ({
          week: point[0] ?? `W${index + 1}`,
          inventory: Number(point[1]) || null,
        }));
    }

    const eiaV2Data = json.response?.data;
    if (Array.isArray(eiaV2Data)) {
      return eiaV2Data
        .slice()
        .reverse()
        .map((point, index) => ({
          week: point.period ?? `W${index + 1}`,
          inventory: Number.isFinite(Number(point.value)) ? round(Number(point.value) / 1000, 1) : null,
        }));
    }
  }

  if (feedName === 'news') {
    const articles = Array.isArray(json.articles)
      ? json.articles
      : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.results)
      ? json.results
      : [];

    const normalized = articles
      .map((article) => {
        const headline = article.title || article.headline;
        if (!headline || headline === '[Removed]') return null;
        const text = `${headline} ${article.description ?? ''} ${article.content ?? ''}`;
        const scored = scoreNews(text);
        return {
          headline,
          category: classifyNews(text),
          sentiment: scored.sentiment,
          impact: scored.impact,
          source: article.source?.name ?? article.source ?? 'NewsAPI',
          url: article.url,
          publishedAt: article.publishedAt ?? article.published_at,
        };
      })
      .filter(Boolean)
      .slice(0, 12);

    return normalized;
  }

  return json;
}

async function proxyFallback(req, res, { envUrl, feedName, defaultUrl }) {
  try {
      const configuredUrl = process.env[envUrl];
      const remoteUrl = isPlaceholderUrl(configuredUrl) ? defaultUrl : configuredUrl || defaultUrl;
    const apiKey = process.env[envUrl + '_KEY'];
    if (remoteUrl) {
      // build headers from environment variables
      const headers = {};
      // legacy: if _KEY provided, set common headers
      if (apiKey) {
        headers['x-api-key'] = apiKey;
        headers['authorization'] = `Bearer ${apiKey}`;
        headers['apikey'] = apiKey;
      }

      // support per-feed header env vars: e.g. API_MARKET_URL_HEADER_Authorization or API_MARKET_URL_HEADER_X_API_KEY
      Object.keys(process.env).forEach((k) => {
        const prefix = envUrl + '_HEADER_';
        if (k.startsWith(prefix)) {
          const rawName = k.slice(prefix.length);
          if (!process.env[k]) return;
          // __ stays underscore, single _ becomes dash
          const headerName = rawName
            .replace(/__/g, '\0')
            .replace(/_/g, '-')
            .replace(/\0/g, '_');
          headers[headerName] = process.env[k];
        }
      });
      // support per-feed query params: e.g. API_MARKET_URL_QUERY_api_key=...
      let fetchUrl = remoteUrl;
      const queryEntries = [];
      Object.keys(process.env).forEach((k) => {
        const prefix = envUrl + '_QUERY_';
        if (k.startsWith(prefix)) {
          const param = k.slice(prefix.length);
          if (!process.env[k]) return;
          queryEntries.push([param, process.env[k]]);
        }
      });

      if (queryEntries.length > 0) {
        try {
          const u = new URL(remoteUrl);
          queryEntries.forEach(([p, v]) => u.searchParams.append(p, v));
          fetchUrl = u.toString();
        } catch {
          // if URL constructor fails, append as simple query string
          const sep = remoteUrl.includes('?') ? '&' : '?';
          const qs = queryEntries.map(([p, v]) => `${encodeURIComponent(p)}=${encodeURIComponent(v)}`).join('&');
          fetchUrl = `${remoteUrl}${sep}${qs}`;
        }
      }

      const r = await fetch(fetchUrl, { headers });
      if (r.ok) {
        const json = await r.json();
        return res.json({ data: normalizeFeed(feedName, json), ts: Date.now(), source: configuredUrl && !isPlaceholderUrl(configuredUrl) ? 'remote' : 'yahoo' });
      }
    }
  } catch (err) {
    console.error('proxy error', err);
  }

  return res.status(500).json({ error: 'Data unavailable', ts: Date.now(), source: 'error' });
}

app.get('/api/market', async (req, res) => {
  try {
    const [quotes, wtiSeries, brentSeries, hoSeries] = await Promise.all([
      fetchYahooChartQuotes().catch(() => null),
      fetchYahooSeries('CL=F', { range: '1d', interval: '1m' }).catch(() => []),
      fetchYahooSeries('BZ=F', { range: '1d', interval: '1m' }).catch(() => []),
      fetchYahooSeries('HO=F', { range: '1d', interval: '1m' }).catch(() => []),
    ]);
    const data = quotes ? normalizeFeed('market', { quotes }) : {};
    const [inventory, cftc, shipping, macro, geo, correlation] = await Promise.all([
      fetchLiveInventory().catch(() => []),
      fetchLiveCftc().catch(() => []),
      fetchLiveShipping().catch(() => null),
      fetchLiveMacro().catch(() => null),
      fetchLiveGeopolitical().catch(() => null),
      fetchLiveCorrelation().catch(() => null),
    ]);
    const latestInventory = inventory[inventory.length - 1];
    const previousInventory = inventory[inventory.length - 2];
    const draw = latestInventory && previousInventory
      ? round(latestInventory.inventory - previousInventory.inventory, 1)
      : null;
    const expectedDraw = inventory.length > 2
      ? round(inventory
        .slice(1)
        .map((point, index) => point.inventory - inventory[index].inventory)
        .reduce((sum, value) => sum + value, 0) / (inventory.length - 1), 1)
      : null;
    const inventorySeverity = draw !== null ? (draw <= -4 || draw >= 4 ? 'High' : Math.abs(draw) >= 2 ? 'Medium' : 'Low') : 'Low';
    const inventoryStatus = draw !== null ? (draw < 0
      ? `Commercial crude stocks drew ${Math.abs(draw)}M bbl`
      : `Commercial crude stocks built ${draw}M bbl`) : 'Waiting for live inventory data...';
    data.inventory = { // For AI Market Signal card & Inventory Card
      value: latestInventory?.inventory != null ? `${latestInventory.inventory}M bbl` : 'N/A',
      detail: draw !== null ? `Live draw of ${draw}M vs expected ${expectedDraw}M.` : "Waiting for live inventory data...",
      momentum: draw !== null ? (draw < 0 ? 'Tightening' : 'Building') : 'N/A',
      draw, // for trade recommendation logic
    };
    const latestCftc = cftc[cftc.length - 1];
    if (latestCftc) {
      const net = latestCftc.longs - latestCftc.shorts;
      data.cftc = {
        longs: latestCftc.longs,
        shorts: latestCftc.shorts,
        oi: latestCftc.oi,
        net,
        sentiment: net > 300 ? 'Extremely Bullish' : net > 200 ? 'Bullish' : net > 100 ? 'Neutral' : 'Bearish',
        value: `${round(net, 0)}k net`,
        detail: `Managed money net position is ${net > 200 ? 'heavily' : 'moderately'} long.`,
      };
    } else {
      data.cftc = {
        value: "N/A",
        detail: "Waiting for live CFTC data...",
        sentiment: "Neutral",
        net: null
      };
    }

    if (shipping) {
      const redSeaRisk = shipping.shippingMetrics?.redSeaRisk ?? 0;
      data.shipping = {
          value: `${redSeaRisk}%`,
          detail: 'Red Sea disruptions priced in.',
          accent: redSeaRisk > 75 ? 'High' : redSeaRisk > 50 ? 'Medium' : 'Low',
      };
    } else {
      data.shipping = {
          value: "N/A",
          detail: "Waiting for live shipping data...",
          accent: "Neutral",
      };
    }

    if (macro) {
        const dxyChange = macro.dxy?.change ?? 0;
        let macroValue = 'Neutral';
        if (dxyChange < -0.2) macroValue = 'Bullish';
        if (dxyChange > 0.2) macroValue = 'Bearish';
        data.macro = {
            value: macroValue,
            detail: `DXY at ${round(macro.dxy?.value, 2)} is a key driver.`,
            accent: Math.abs(dxyChange) > 0.5 ? 'High' : 'Medium',
        };
    } else {
      data.macro = {
          value: "N/A",
          detail: "Waiting for live macro data...",
          accent: "Neutral",
      };
    }

    if (geo && geo.length > 0) {
        const avgRisk = round(geo.reduce((sum, item) => sum + item.risk, 0) / geo.length, 0);
        const signal = avgRisk >= 75 ? 'Critical' : avgRisk >= 60 ? 'High' : avgRisk <= 40 ? 'Low' : 'Medium';
        data.geopolitical = {
            value: signal,
            detail: `Global risk score at ${avgRisk}%`,
            accent: signal,
        };
    } else {
      data.geopolitical = {
          value: "N/A",
          detail: "Waiting for live geopolitical data...",
          accent: "Neutral",
      };
    }

    if (correlation && correlation.length > 0) {
        const regime = correlation.some(c => Math.abs(c.value) > 0.6) ? 'Clustered' : 'Decoupled';
        data.correlation = {
            value: regime,
            detail: 'Energy complex correlation regime.',
            accent: 'Neutral',
        };
    } else {
      data.correlation = {
          value: "N/A",
          detail: "Waiting for live correlation data...",
          accent: "Neutral",
      };
    }

    if (data.ovx) {
      data.ovx.status = Number(data.ovx.value) >= 40 ? 'High' : 'Stable';
    }

    data.alertRules = [
      ...(data.alertRules || []),
      {
        id: 'inv-alert',
        title: draw != null && draw < 0 ? 'Inventory Draw' : 'Inventory Build',
        value: draw,
        severity: inventorySeverity,
        status: inventoryStatus,
        message: inventoryStatus,
        description: inventoryStatus,
        timestamp: 'Live',
      }
    ];
    
    const net = data.cftc?.net ?? null;
    const bias = draw !== null ? (draw < 0 && (Number(data.ovx?.value) < 40 || !data.ovx?.value) ? "Bullish" : "Neutral/Bearish") : "N/A";
    const confidence = net !== null && draw !== null ? Math.min(95, 50 + Math.abs(net) / 20 + Math.abs(draw) * 5) : null;

    const longExp = draw !== null ? 50 + clamp(Math.round(draw * -2), -20, 30) : null;
    const shortExp = longExp !== null ? 100 - longExp : null;
    const netExp = longExp !== null ? longExp - shortExp : null;
    const varValue = data.ovx?.value != null ? round(Number(data.ovx.value) / 10, 1) : null;
    const drawdownValue = varValue !== null ? round(varValue * 1.8, 1) : null;
    
    const riskData = [];
    const weeksCount = Math.min(7, inventory.length);
    if (weeksCount > 1) {
        const recentInv = inventory.slice(-weeksCount);
        recentInv.forEach((point, idx) => {
            const prevInv = idx === 0 
                ? inventory[inventory.length - weeksCount - 1]?.inventory ?? point.inventory 
                : recentInv[idx - 1].inventory;
            const pointDraw = round(point.inventory - prevInv, 1);
            const pointLong = 50 + clamp(Math.round(pointDraw * -2), -20, 30);
            const pointShort = 100 - pointLong;
            riskData.push({
                name: point.week || `W${idx + 1}`,
                long: pointLong * 8,
                short: pointShort * 8,
                net: (pointLong - pointShort) * 8
            });
        });
    }

    const dynamicRiskBudget = varValue !== null ? `${Math.max(10, Math.min(25, round(varValue * 3, 0)))}%` : "N/A";
    const dynamicLiquidity = varValue !== null ? (varValue > 4 
      ? "Prioritizing high-liquidity near-month futures to navigate elevated volatility." 
      : "Core positions remain in liquid futures and swaps, supporting fast risk reduction if exposures shift.") : "Waiting for live volatility data...";

    data.portfolioRisk = {
      longExposure: longExp !== null ? `${longExp}%` : "N/A",
      shortExposure: shortExp !== null ? `${shortExp}%` : "N/A",
      netExposure: netExp !== null ? `${netExp}%` : "N/A",
      var: varValue !== null ? `${varValue}%` : "N/A",
      drawdown: drawdownValue !== null ? `${drawdownValue}%` : "N/A",
      riskBudget: dynamicRiskBudget,
      capitalUsage: longExp !== null ? `Current risk budget is aligned to a conservative portfolio allocation, with ${longExp}% long exposure and ${shortExp}% short protection.` : "Waiting for live portfolio data...",
      // stressScenario: varValue !== null ? `A 5% shock to crude prices would move VaR expectations toward the ${round(varValue + 2.0, 1)}% level, reinforcing disciplined sizing.` : "Waiting for live portfolio data...",
      liquidityProfile: dynamicLiquidity,
      riskData: riskData
    };

    data.tradeRecommendation = {
      bias: bias,
      confidence: confidence !== null ? `${round(confidence, 0)}%` : "N/A",
      bullishDrivers: draw !== null ? [
        draw < 0 ? `Live crude inventory draw ${Math.abs(draw)}M bbl` : 'Live crude inventory build limits upside',
        String(data.dxy?.change || '').startsWith('-') ? 'DXY weakness' : 'DXY strength watch',
        (data.wti?.change || 0) > 0 ? 'Live WTI positive momentum' : 'Live WTI negative momentum',
      ] : [],
      bearishDrivers: draw !== null ? [
        draw > expectedDraw ? 'Inventory build above recent average' : 'Inventory surprise risk',
        (data.ovx?.value || 0) > 40 ? 'Elevated volatility premiums' : 'Volatility remains contained',
        (data.macro?.value === 'Bearish') ? 'Macro demand headwinds' : 'Macro demand stability',
      ] : [],
      suggestedTrade: draw !== null ? (draw < 0 ? "Lean long WTI via front-month futures with defined risk." : "Stay neutral or short on rallies, watch inventory levels.") : "Waiting for live market data to generate trade suggestion...",
    };

    const volScore = varValue !== null ? (varValue > 4 ? "HIGH" : varValue > 3 ? "ELEVATED" : "MODERATE") : "N/A";
    const macroScore = data.dxy?.change != null ? (Math.abs(data.dxy.change) > 0.5 ? "Elevated" : "Stable") : "N/A";

    data.riskMonitor = {
      panels: varValue !== null && data.dxy?.change != null ? [
        {
          title: "Market Volatility",
          score: volScore,
          detail: `Energy vol metrics (OVX at ${data.ovx?.value}) highlight ${volScore.toLowerCase()} regime.`,
          color: varValue > 4 ? "text-orange-400" : "text-green-400"
        },
        {
          title: "Liquidity Buffer",
          score: varValue > 4 ? "Stressed" : "Healthy",
          detail: "Capital reserves aligned to current risk budget.",
          color: "text-cyan-400"
        },
        {
          title: "Macro Shock",
          score: macroScore,
          detail: `DXY moves (${data.dxy?.change}%) drive macro shock probability.`,
          color: macroScore === "Elevated" ? "text-red-400" : "text-green-400"
        },
        {
          title: "Position Defense",
          score: dynamicRiskBudget,
          detail: "Current risk budget is preserved through selective hedging.",
          color: "text-purple-400"
        }
      ] : [],
      geoSummary: data.geopolitical?.value && data.geopolitical?.value !== "N/A" ? `Global risk score sits at ${data.geopolitical?.value} due to active monitored headlines.` : "Waiting for live geopolitical data...",
      stressProfile: volScore !== "N/A" && draw !== null ? `Stress levels are ${volScore.toLowerCase()} across energy channels, driven by ${draw < 0 ? 'inventory draws' : 'inventory builds'}.` : "Waiting for live risk data...",
      scenarios: [

        {
          title: "Iran Closure",
          probability: "18%",
          shock: "+$9 WTI",
          var:
            varValue !== null
              ? `${round(varValue + 3.3,1)}%`
              : "N/A",
          drawdown:
            drawdownValue !== null
              ? `${round(drawdownValue + 4.5,1)}%`
              : "N/A",
        },

        {
          title: "OPEC Surprise",
          probability: "24%",
          shock: "-$4 WTI",
          var:
            varValue !== null
              ? `${round(varValue + 0.9,1)}%`
              : "N/A",
          drawdown:
            drawdownValue !== null
              ? `${round(drawdownValue + 1.5,1)}%`
              : "N/A",
        },

        {
          title: "Fed Shock",
          probability: "35%",
          shock: "DXY +2%",
          var:
            varValue !== null
              ? `${round(varValue + 1.7,1)}%`
              : "N/A",
          drawdown:
            drawdownValue !== null
              ? `${round(drawdownValue + 2.0,1)}%`
              : "N/A",
        },

        {
          title: "Inventory Shock",
          probability: "28%",
          shock:
            draw !== null
              ? `${draw > 0 ? "-" : "+"}$3 WTI`
              : "N/A",
          var:
            varValue !== null
              ? `${round(varValue + 0.7,1)}%`
              : "N/A",
          drawdown:
            drawdownValue !== null
              ? `${round(drawdownValue + 1.1,1)}%`
              : "N/A",
        }

      ],

      contributors: [

        {
          factor: "OVX",
          score:
            clamp(
              round(
                Number(data.ovx?.value || 0) * 2,
                0
              ),
              0,
              100
            )
        },

        {
          factor: "Inventory",
          score:
            draw !== null
              ? clamp(
                  round(
                    Math.abs(draw) * 10,
                    0
                  ),
                  0,
                  100
                )
              : 0
        },

        {
          factor: "Geopolitics",
          score:
            geo?.length
              ? round(
                  geo.reduce(
                    (a,b) => a + b.risk,
                    0
                  ) / geo.length,
                  0
                )
              : 0
        },

        {
          factor: "Macro",
          score:
            clamp(
              round(
                Math.abs(
                  Number(data.dxy?.change || 0)
                ) * 100,
                0
              ),
              0,
              100
            )
        }

      ],

      recommendations: [

        varValue > 4
          ? "Reduce gross exposure"
          : "Maintain current sizing",

        Number(data.ovx?.value) > 40
          ? "Increase hedge coverage"
          : "Volatility remains contained",

        draw < 0
          ? "Inventory draws support prompt crude"
          : "Monitor inventory builds",

        geo?.some(g => g.risk > 80)
          ? "Closely monitor geopolitical headlines"
          : "Geopolitical backdrop remains manageable"

      ],
      scenarioEngine: varValue !== null ? `A standard deviation shock would push VaR to ${round(varValue + 1.5, 1)}% under current correlations.` : "Waiting for live volatility data..."
    };

    data.riskFactors = data.wti?.change != null && data.dxy?.value != null && draw !== null ? [
      `WTI ${data.wti?.change ?? 'movement'} signals ${String(data.wti?.change || '').startsWith('-') ? 'easing' : 'prompt'} crude tension`,
      `DXY at ${data.dxy?.value ?? 'current levels'} remains the macro swing factor`,
      `Inventory ${draw < 0 ? 'draw' : 'build'} dynamics continue to define prompt balance`
    ] : [];

    data.marketMovers = data.dxy?.change != null && draw !== null && net !== null ? [
      { title: String(data.dxy?.change || '').startsWith('-') ? 'Weak Dollar' : 'Strong Dollar', desc: 'Macro Tailwind' },
      { title: draw < 0 ? 'Inventory Draw' : 'Inventory Build', desc: 'Inventory Surprise' },
      { title: net > 200 ? 'Bullish Speculators' : 'Bearish Speculators', desc: 'Positioning Shift' },
      { title: 'Geopolitical Risk', desc: data.geopolitical?.value ?? 'Elevated' }
    ] : [];

    const wtiQuote = quotes?.find(q => q.symbol === 'CL=F');
    const realVolume = wtiQuote?.regularMarketVolume ? round(wtiQuote.regularMarketVolume / 1000000, 2) : null;

    data.marketStats = {
      volume: { value: realVolume !== null ? `${realVolume}M` : "N/A", change: varValue !== null ? (varValue > 4 ? '+15.2%' : '-4.1%') : "N/A" },
      openInterest: { value: data.cftc?.oi != null ? `${data.cftc.oi}K` : "N/A", desc: 'Active Futures' }
    };

    const brentMap = new Map(brentSeries.map(p => [p.ts, p.value]));
    const hoMap = new Map(hoSeries.map(p => [p.ts, p.value]));

    data.priceHistory = wtiSeries && wtiSeries.length > 0 ? wtiSeries.slice(-24).map((point) => ({
      t: new Date(point.ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      name: new Date(point.ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: round(point.value, 2),
      brent: brentMap.has(point.ts) ? round(brentMap.get(point.ts), 2) : null,
      ho: hoMap.has(point.ts) ? round(hoMap.get(point.ts), 2) : null,
    })) : [];

    data.analyticsInputs = {

        WB_C1:
            Number(data.spread?.value),

        CL_VOL20:
            Number(data.ovx?.value),

        HO_CL_DIFF:
            (
                Number(data.heatingOil?.value)
                -
                Number(data.wti?.value)
            ),

        INVENTORY_DRAW:
            data.inventory?.draw,

        WTI_PRICE:
            Number(data.wti?.value),

        BRENT_PRICE:
            Number(data.brent?.value),

        DXY:
            Number(data.dxy?.value),

    };

    return res.json({ data, ts: Date.now(), source: 'live-backend' });
  } catch (err) {
    console.error('market api error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_MARKET_URL', feedName: 'market' });
});
app.get('/api/cftc', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveCftc(), ts: Date.now(), source: 'cftc' });
  } catch (err) {
    console.error('cftc error', err);
  }

  return res.status(500).json({ error: 'CFTC data unavailable', ts: Date.now(), source: 'error' });
});
app.get('/api/news', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveNews(), ts: Date.now(), source: 'newsapi' });
  } catch (err) {
    console.error('newsapi error', err);
  }

  return res.status(500).json({ error: 'News data unavailable', ts: Date.now(), source: 'error' });
});
app.get('/api/inventory', async (req, res) => {
  try {
    const data = await fetchLiveInventory();
    if (data && data.length > 0) {
      return res.json({ data, ts: Date.now(), source: 'eia' });
    }
  } catch (err) {
    console.error('eia inventory error', err);
  }
  return proxyFallback(req, res, { envUrl: 'API_INVENTORY_URL', feedName: 'inventory' });
});
app.get('/api/crackspread', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveCrackSpread(), ts: Date.now(), source: 'yahoo' });
  } catch (err) {
    console.error('yahoo crack spread error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_CRACK_URL', feedName: 'crackspread' });
});
app.get('/api/correlation', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveCorrelation(), ts: Date.now(), source: 'yahoo' });
  } catch (err) {
    console.error('yahoo correlation error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_CORRELATION_URL' });
});
app.get('/api/macro', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveMacro(), ts: Date.now(), source: 'yahoo' });
  } catch (err) {
    console.error('yahoo macro error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_MACRO_URL' });
});
app.get('/api/quant', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveQuant(), ts: Date.now(), source: 'yahoo' });
  } catch (err) {
    console.error('yahoo quant error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_QUANT_URL' });
});
app.get('/api/geopolitical', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveGeopolitical(), ts: Date.now(), source: 'newsapi' });
  } catch (err) {
    console.error('newsapi geopolitical error', err);
  }

  return res.status(500).json({ error: 'Geopolitical data unavailable', ts: Date.now(), source: 'error' });
});
app.get('/api/shipping', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveShipping(), ts: Date.now(), source: 'eia' });
  } catch (err) {
    console.error('eia shipping-flow error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_SHIPPING_URL' });
});
app.get('/api/curve', async (req, res) => {
  try {
    return res.json({ data: await fetchLiveCurve(), ts: Date.now(), source: 'yahoo' });
  } catch (err) {
    console.error('yahoo curve error', err);
  }

  return proxyFallback(req, res, { envUrl: 'API_CURVE_URL' });
});


app.get('/api/opportunities', (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      '../analytics/data/processed/opportunities.json'
    );

    const data = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    res.json({
      data,
      ts: Date.now(),
      source: 'analytics',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Unable to load opportunities',
    });
  }
});


app.get('/api/current-regime', (req, res) => {
  try {
    const csvPath = path.join(
      __dirname,
      '../analytics/data/processed/regime_database.csv'
    );

    const lines = fs
      .readFileSync(csvPath, 'utf8')
      .trim()
      .split('\n');

    const headers = lines[0].split(',');

    const latest = lines[lines.length - 1].split(',');

    const regimeIndex =
      headers.indexOf('REGIME');

    const curveIndex =
      headers.indexOf('CURVE_DRIVER');

    const volIndex =
      headers.indexOf('VOL_DRIVER');

    const productIndex =
      headers.indexOf('PRODUCT_DRIVER');

    const wbIndex =
      headers.indexOf('WB_DRIVER');

    res.json({
      date: latest[0],

      regime: latest[regimeIndex],

      drivers: {
        curve: latest[curveIndex],
        volatility: latest[volIndex],
        products: latest[productIndex],
        wb: latest[wbIndex],
      },

      ts: Date.now(),

      source: 'analytics',
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Unable to load regime',
    });
  }
});


app.get('/api/model-results', (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      '../analytics/data/processed/regression_results.json'
    );

    const data = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    res.json({
      data,
      ts: Date.now(),
      source: 'analytics',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Unable to load model results',
    });
  }
});


app.get('/api/rolling-models', (req, res) => {
  try {

    const filePath = path.join(
      __dirname,
      '../analytics/data/processed/rolling_model_results.json'
    );

    const data = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    res.json({
      data,
      ts: Date.now(),
      source: 'analytics',
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Unable to load rolling models',
    });

  }
});



app.get(
  "/api/regime-counts",
  (_, res) => {


    const csv = fs.readFileSync(
      "analytics/data/processed/regime_counts.csv",
      "utf8"
    );

    const rows = csv
      .trim()
      .split("\n")
      .slice(1);

    const data = rows.map(
      (row) => {

        const [
          regime,
          count,
        ] = row.split(",");

        return {
          regime,
          count: Number(count),
        };

      }
    );

    res.json({
      data,
      source: "analytics",
      ts: Date.now(),
    });

  }
);

app.get(
  "/api/regime-stats",
  (_, res) => {

    try {

      const csv = fs.readFileSync(
        "analytics/data/processed/regime_counts.csv",
        "utf8"
      );

      const rows = csv
        .trim()
        .split("\n")
        .slice(1);

      const total = rows
        .reduce(
          (
            acc,
            row,
          ) =>
            acc +
            Number(
              row.split(",")[1]
            ),
          0
        );

      res.json({

        data: [

          {
            label:
              "Total Regimes",

            value:
              rows.length,
          },

          {
            label:
              "Observations",

            value:
              total,
          },

        ],

        ts:
          Date.now(),

        source:
          "analytics",

      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        error:
          err.message,

      });

    }

  }
);


app.get(

    "/api/signal-log",

    (req, res) => {

        const file = path.join(

            process.cwd(),

            "analytics",

            "live",

            "signal_log.csv"

        );

        if (!fs.existsSync(file)) {

            return res.send("");

        }

        res.send(

            fs.readFileSync(

                file,

                "utf8"

            )

        );

    }

);

cron.schedule("* * * * *", () => {

    console.log(
        "Updating live analytics engine..."
    );

    exec(

        `
        python analytics/scripts/fetch_market_snapshot.py &&
        python analytics/scripts/generate_live_features.py &&
        python analytics/scripts/generate_live_regime.py &&
        python analytics/scripts/generate_live_opportunities.py &&
        python analytics/scripts/update_signal_performance.py
        `,

        (
            error,
            stdout,
            stderr
        ) => {

            if (error) {

                console.error(
                    stderr
                );

                return;
            }

            console.log(
                stdout
            );
        }
    );
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

const port = process.env.PORT || 4010;
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));

