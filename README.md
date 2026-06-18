# CORE – Crude Oil Risk Engine

CORE (Crude Oil Risk Engine) is an institutional-style Oil & Energy Intelligence Dashboard designed for monitoring global crude oil markets, identifying statistical trading opportunities, and delivering real-time market intelligence through quantitative analytics and AI-driven decision support.

The platform combines live market monitoring, quantitative modeling, regime detection, trade execution analytics, and macro intelligence into a unified dashboard for energy market analysis.

**🌐 Live Dashboard:** https://core-dashboard-ff.vercel.app/

---

# Key Features

## Institutional Command Center

* Real-time market status and regime monitoring
* Live WTI price tracking with intraday visualization
* AI-generated trade signals
* Trade execution dashboard
* Risk & confidence assessment
* Market alerts and intelligence feed

---

## Live Market Analytics

Monitor major energy market indicators including:

* WTI Crude Oil
* Brent Crude Oil
* WTI–Brent Spread
* Heating Oil Crack Spread
* DXY (US Dollar Index)
* OVX (Oil Volatility Index)
* Inventory Data
* Product Spreads

---

## Quantitative Intelligence Engine

CORE includes a statistical arbitrage framework capable of:

* Market regime detection
* Feature engineering
* Regression-based fair value estimation
* Residual & Z-score analysis
* Opportunity ranking
* Confidence scoring
* Institutional signal generation

---

## Trade Execution Engine

Each generated signal contains:

* Trade Direction (BUY / SELL)
* Entry Price
* Target Price
* Stop Loss
* Position Size
* Risk–Reward Ratio
* Expected Return
* Opportunity Score
* Trading Rationale

---

## Advanced Analytics Modules

* Futures Analytics
* Inventory Analytics
* Crack Spread Analytics
* Quant Analytics
* CFTC Positioning
* Shipping Intelligence
* Macro Analytics
* Correlation Analytics
* Portfolio Risk
* Risk Dashboard

---

## Market Intelligence

* Live Energy News
* Geopolitical Risk Monitoring
* Upcoming Market Catalysts
* AI Trade Recommendation Engine
* Market Summary & Alerts

---

## Dashboard Highlights

* Modern institutional UI
* Fully responsive layout
* Interactive charts
* Live market monitoring
* AI-assisted analytics
* Signal logging
* Market regime visualization

---

# Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* TanStack React Query
* Lucide React

### Backend / Analytics

* Python
* Pandas
* NumPy
* Scikit-learn
* JSON-based live data pipeline

### Machine Learning

* Linear Regression
* Ridge Regression
* Lasso Regression
* RFECV Feature Selection
* Statistical Arbitrage Models
* Regime-Based Modeling

---

# Project Structure

```
CORE
│
├── analytics/
│   ├── data/
│   ├── live/
│   ├── models/
│   ├── scripts/
│   └── train_models.py
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── analytics/
│   └── assets/
│
├── public/
├── package.json
└── vite.config.js
```

---

# Running Locally

## Prerequisites

* Node.js 18+
* npm
* Python 3.11+
* pip
* Virtual Environment (recommended)

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd CORE-dashboard
```

---

## 2. Install Frontend Dependencies

```bash
npm install
```

---

## 3. Create Environment Variables

Create a `.env` file in the project root.

```env
VITE_ACCESS_PASSWORD=your_password
```

---

## 4. Start Frontend

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## 5. (Optional) Run Analytics Pipeline

The quantitative engine consists of several Python scripts.

Typical workflow:

```bash
python analytics/scripts/fetch_market_snapshot.py
python analytics/scripts/generate_live_features.py
python analytics/scripts/generate_live_regime.py
python analytics/scripts/generate_live_opportunities.py
```

These scripts generate:

* Live Features
* Market Regime
* Trading Opportunities
* Signal Log

---

# Production Build

```bash
npm run build
```

The optimized production build will be generated inside:

```
dist/
```

---

# Current Capabilities

* Live market dashboard
* AI trade recommendations
* Quantitative opportunity detection
* Statistical arbitrage engine
* Regime classification
* Trade execution analytics
* Institutional market intelligence
* Risk monitoring
* Interactive visualizations

---

# Disclaimer

CORE is an educational and research-oriented analytics platform designed for quantitative market analysis. It is **not** intended to provide financial or investment advice. All trading decisions remain the responsibility of the user.
