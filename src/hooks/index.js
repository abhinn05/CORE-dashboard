export { default as useFeed } from './useFeed';
export { default as useMarket } from './useMarket';
import useFeed from './useFeed';

export const useCftc = (opts) => useFeed('cftc', opts);
export const useNews = (opts) => useFeed('news', opts);
export const useInventory = (opts) => useFeed('inventory', opts);
export const useCrack = (opts) => useFeed('crackspread', opts);
export const useCorrelation = (opts) => useFeed('correlation', opts);
export const useMacro = (opts) => useFeed('macro', opts);
export const useQuant = (opts) => useFeed('quant', opts);
export const useShipping = (opts) => useFeed('shipping', opts);
export const useCurve = (opts) => useFeed('curve', opts);
export const useGeopolitical = (opts) => useFeed('geopolitical', opts);
