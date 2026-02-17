/**
 * Find support and resistance levels based on price touches
 * @param {Array<Object>} candles - Array of candles
 * @param {number} currentPrice - Current BTC price
 * @param {number} tolerance - Price tolerance for level clustering (%)
 * @returns {Object} Support and resistance levels
 */
export function findSupportResistance(candles, currentPrice, tolerance = 0.02) {
  if (candles.length < 30) {
    return { support: [], resistance: [] };
  }

  // Collect all significant highs and lows
  const levels = [];

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
    support: support.length > 0 ? support : null,
    resistance: resistance.length > 0 ? resistance : null
  };
}

/**
 * Cluster nearby price levels together
 * @param {Array<Object>} levels - Array of price levels
 * @param {number} tolerance - Clustering tolerance (%)
 * @returns {Array<Object>} Clustered levels
 */
function clusterLevels(levels, tolerance) {
  if (levels.length === 0) return [];

  const clusters = [];

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
