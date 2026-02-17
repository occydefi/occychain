import { fetchCandles, getCurrentPrice } from '../utils/binance.js';
import { calculateAllMAs } from '../utils/calculate-ma.js';
import { calculateAllRSI } from '../utils/calculate-rsi.js';
import { calculateFibonacci } from '../utils/calculate-fibonacci.js';
import { findSupportResistance } from '../utils/find-support-resistance.js';

/**
 * Get all indicators with real data from Binance
 * @returns {Promise<Object>} All indicator values
 */
export async function getAllIndicators() {
  try {
    // Fetch 200 daily candles from Binance
    const candles = await fetchCandles('BTCUSDT', '1d', 200);
    
    if (!candles || candles.length === 0) {
      throw new Error('No candle data received from Binance');
    }

    // Get current price
    const currentPrice = await getCurrentPrice('BTCUSDT');

    // Calculate moving averages
    const mas = calculateAllMAs(candles);

    // Calculate RSI
    const rsi = calculateAllRSI(candles);

    // Calculate Fibonacci levels
    const fibonacci = calculateFibonacci(candles, 90);

    // Find support and resistance
    const sr = findSupportResistance(candles, currentPrice, 0.015);

    // Prepare response
    const indicators = {
      timestamp: Date.now(),
      currentPrice: Math.round(currentPrice * 100) / 100,
      
      // Moving Averages
      ma21: mas.ma21 ? Math.round(mas.ma21 * 100) / 100 : null,
      ma50: mas.ma50 ? Math.round(mas.ma50 * 100) / 100 : null,
      ma100: mas.ma100 ? Math.round(mas.ma100 * 100) / 100 : null,
      ma200: mas.ma200 ? Math.round(mas.ma200 * 100) / 100 : null,
      ema20: mas.ema20 ? Math.round(mas.ema20 * 100) / 100 : null,
      ema50: mas.ema50 ? Math.round(mas.ema50 * 100) / 100 : null,

      // RSI
      rsi14: rsi.rsi14 ? Math.round(rsi.rsi14 * 100) / 100 : null,
      rsi30: rsi.rsi30 ? Math.round(rsi.rsi30 * 100) / 100 : null,

      // Fibonacci
      fibonacci: fibonacci ? {
        level0: Math.round(fibonacci.level0 * 100) / 100,
        level236: Math.round(fibonacci.level236 * 100) / 100,
        level382: Math.round(fibonacci.level382 * 100) / 100,
        level50: Math.round(fibonacci.level50 * 100) / 100,
        level618: Math.round(fibonacci.level618 * 100) / 100,
        level786: Math.round(fibonacci.level786 * 100) / 100,
        level100: Math.round(fibonacci.level100 * 100) / 100,
        swingHigh: Math.round(fibonacci.swingHigh * 100) / 100,
        swingLow: Math.round(fibonacci.swingLow * 100) / 100
      } : null,

      // Support & Resistance
      support: sr.support ? sr.support.map(s => Math.round(s * 100) / 100) : [],
      resistance: sr.resistance ? sr.resistance.map(r => Math.round(r * 100) / 100) : [],

      // Data source info
      dataSource: 'Binance API',
      candlesCount: candles.length
    };

    return indicators;

  } catch (error) {
    console.error('Error calculating indicators:', error);
    throw error;
  }
}

/**
 * Express route handler for /api/indicators
 */
export async function handleIndicatorsRequest(req, res) {
  try {
    const indicators = await getAllIndicators();
    res.json(indicators);
  } catch (error) {
    console.error('Indicators API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch indicators',
      message: error.message 
    });
  }
}
