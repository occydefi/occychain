import { RSI } from 'technicalindicators';

/**
 * Calculate RSI (Relative Strength Index)
 * @param {Array<number>} closes - Array of closing prices
 * @param {number} period - RSI period (default 14)
 * @returns {number|null} Current RSI value
 */
export function calculateRSI(closes, period = 14) {
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
 * @param {Array<Object>} candles - Array of candle objects
 * @returns {Object} RSI values for different periods
 */
export function calculateAllRSI(candles) {
  const closes = candles.map(c => c.close);

  return {
    rsi14: calculateRSI(closes, 14),
    rsi30: calculateRSI(closes, 30)
  };
}
