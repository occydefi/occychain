import { SMA, EMA } from 'technicalindicators';

/**
 * Calculate Simple Moving Averages
 * @param {Array<number>} closes - Array of closing prices
 * @param {number} period - MA period
 * @returns {number|null} Current MA value
 */
export function calculateSMA(closes, period) {
  if (closes.length < period) {
    return null;
  }

  const smaValues = SMA.calculate({
    period: period,
    values: closes
  });

  // Return the latest MA value
  return smaValues.length > 0 ? smaValues[smaValues.length - 1] : null;
}

/**
 * Calculate Exponential Moving Averages
 * @param {Array<number>} closes - Array of closing prices
 * @param {number} period - EMA period
 * @returns {number|null} Current EMA value
 */
export function calculateEMA(closes, period) {
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
 * @param {Array<Object>} candles - Array of candle objects with 'close' property
 * @returns {Object} Object with all MA values
 */
export function calculateAllMAs(candles) {
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
