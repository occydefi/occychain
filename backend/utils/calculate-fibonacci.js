/**
 * Find swing high and low in the given period
 * @param {Array<Object>} candles - Array of candles with high and low
 * @param {number} lookback - Number of candles to look back
 * @returns {Object} { high, low }
 */
function findSwingPoints(candles, lookback = 90) {
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
 * @param {Array<Object>} candles - Array of candle objects
 * @param {number} lookback - Number of candles to analyze
 * @returns {Object} Fibonacci levels
 */
export function calculateFibonacci(candles, lookback = 90) {
  if (candles.length < lookback) {
    return null;
  }

  const { high, low } = findSwingPoints(candles, lookback);
  const range = high - low;

  return {
    level0: low,                          // 0%
    level236: low + range * 0.236,        // 23.6%
    level382: low + range * 0.382,        // 38.2%
    level50: low + range * 0.5,           // 50%
    level618: low + range * 0.618,        // 61.8%
    level786: low + range * 0.786,        // 78.6%
    level100: high,                       // 100%
    swingHigh: high,
    swingLow: low
  };
}
