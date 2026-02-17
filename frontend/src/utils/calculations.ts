import { SMA, EMA, RSI } from 'technicalindicators';
import { CandleData } from '../types';

/**
 * Calculate Simple Moving Average
 */
export function calculateSMA(closes: number[], period: number): number | null {
  if (closes.length < period) {
    return null;
  }

  const smaValues = SMA.calculate({
    period: period,
    values: closes
  });

  return smaValues.length > 0 ? smaValues[smaValues.length - 1] : null;
}

/**
 * Calculate Exponential Moving Average
 */
export function calculateEMA(closes: number[], period: number): number | null {
  if (closes.length < period) {
    return null;
  }

  const emaValues = EMA.calculate({
    period: period,
    values: closes
  });

  return emaValues.length > 0 ? emaValues[emaValues.length - 1] : null;
}

/**
 * Calculate all moving averages
 */
export function calculateAllMAs(candles: CandleData[]) {
  const closes = candles.map(c => c.close);

  return {
    ma21: calculateSMA(closes, 21),
    ma50: calculateSMA(closes, 50),
    ma100: calculateSMA(closes, 100),
    ma200: calculateSMA(closes, 200),
    ema20: calculateEMA(closes, 20),
    ema50: calculateEMA(closes, 50)
  };
}

/**
 * Calculate RSI (Relative Strength Index)
 */
export function calculateRSI(closes: number[], period: number = 14): number | null {
  if (closes.length < period + 1) {
    return null;
  }

  const rsiValues = RSI.calculate({
    values: closes,
    period: period
  });

  return rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : null;
}

/**
 * Calculate multiple RSI periods
 */
export function calculateAllRSI(candles: CandleData[]) {
  const closes = candles.map(c => c.close);

  return {
    rsi14: calculateRSI(closes, 14),
    rsi30: calculateRSI(closes, 30)
  };
}

/**
 * Find swing high and low in the given period
 */
function findSwingPoints(candles: CandleData[], lookback: number = 90) {
  const recentCandles = candles.slice(-lookback);
  
  let swingHigh = -Infinity;
  let swingLow = Infinity;

  for (const candle of recentCandles) {
    if (candle.high > swingHigh) swingHigh = candle.high;
    if (candle.low < swingLow) swingLow = candle.low;
  }

  return { high: swingHigh, low: swingLow };
}

/**
 * Calculate Fibonacci retracement levels
 */
export function calculateFibonacci(candles: CandleData[], lookback: number = 90) {
  if (candles.length < lookback) {
    return null;
  }

  const { high, low } = findSwingPoints(candles, lookback);
  const range = high - low;

  return {
    level0: low,
    level236: low + range * 0.236,
    level382: low + range * 0.382,
    level50: low + range * 0.5,
    level618: low + range * 0.618,
    level786: low + range * 0.786,
    level100: high,
    swingHigh: high,
    swingLow: low
  };
}

/**
 * Cluster nearby price levels together
 */
function clusterLevels(
  levels: Array<{ price: number; type: string; touches: number }>,
  tolerance: number
) {
  if (levels.length === 0) return [];

  const clusters: Array<{ price: number; type: string; touches: number }> = [];

  for (const level of levels) {
    let merged = false;

    for (const cluster of clusters) {
      const diff = Math.abs(level.price - cluster.price) / cluster.price;
      
      if (diff < tolerance && level.type === cluster.type) {
        // Merge into existing cluster
        cluster.price = (cluster.price * cluster.touches + level.price) / (cluster.touches + 1);
        cluster.touches += 1;
        merged = true;
        break;
      }
    }

    if (!merged) {
      clusters.push({ ...level });
    }
  }

  return clusters;
}

/**
 * Find support and resistance levels based on price touches
 */
export function findSupportResistance(
  candles: CandleData[],
  currentPrice: number,
  tolerance: number = 0.02
) {
  if (candles.length < 30) {
    return { support: [], resistance: [] };
  }

  // Collect all significant highs and lows
  const levels: Array<{ price: number; type: string; touches: number }> = [];

  for (let i = 2; i < candles.length - 2; i++) {
    const candle = candles[i];
    const prev1 = candles[i - 1];
    const prev2 = candles[i - 2];
    const next1 = candles[i + 1];
    const next2 = candles[i + 2];

    // Local high (resistance)
    if (candle.high > prev1.high && candle.high > prev2.high &&
        candle.high > next1.high && candle.high > next2.high) {
      levels.push({ price: candle.high, type: 'resistance', touches: 1 });
    }

    // Local low (support)
    if (candle.low < prev1.low && candle.low < prev2.low &&
        candle.low < next1.low && candle.low < next2.low) {
      levels.push({ price: candle.low, type: 'support', touches: 1 });
    }
  }

  // Cluster nearby levels
  const clusteredLevels = clusterLevels(levels, tolerance);

  // Sort by number of touches
  const sortedLevels = clusteredLevels.sort((a, b) => b.touches - a.touches);

  // Find 2-3 most relevant support levels (below current price)
  const support = sortedLevels
    .filter(l => l.type === 'support' && l.price < currentPrice)
    .slice(0, 3)
    .map(l => l.price);

  // Find 2-3 most relevant resistance levels (above current price)
  const resistance = sortedLevels
    .filter(l => l.type === 'resistance' && l.price > currentPrice)
    .slice(0, 3)
    .map(l => l.price);

  return {
    support: support.length > 0 ? support : [],
    resistance: resistance.length > 0 ? resistance : []
  };
}
