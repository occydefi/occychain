import axios from 'axios';

const BINANCE_API = 'https://api.binance.com/api/v3';

/**
 * Fetch historical klines (candles) from Binance
 * @param {string} symbol - Trading pair (e.g., 'BTCUSDT')
 * @param {string} interval - Interval (e.g., '1d')
 * @param {number} limit - Number of candles to fetch
 * @returns {Promise<Array>} Array of candle objects
 */
export async function fetchCandles(symbol = 'BTCUSDT', interval = '1d', limit = 200) {
  try {
    const response = await axios.get(`${BINANCE_API}/klines`, {
      params: {
        symbol,
        interval,
        limit
      },
      timeout: 10000
    });

    // Binance returns: [timestamp, open, high, low, close, volume, ...]
    return response.data.map(candle => ({
      timestamp: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));
  } catch (error) {
    console.error('Error fetching Binance candles:', error.message);
    throw new Error('Failed to fetch market data from Binance');
  }
}

/**
 * Get current BTC price
 * @returns {Promise<number>}
 */
export async function getCurrentPrice(symbol = 'BTCUSDT') {
  try {
    const response = await axios.get(`${BINANCE_API}/ticker/price`, {
      params: { symbol },
      timeout: 5000
    });
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching current price:', error.message);
    throw error;
  }
}
