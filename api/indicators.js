// ============================================
// OCCYONCHAIN API - VERCEL SERVERLESS VERSION
// All code inline (no external imports)
// ============================================

import axios from 'axios';
import { SMA, EMA, RSI } from 'technicalindicators';

const BINANCE_API = 'https://api.binance.com/api/v3';

// ========== BINANCE API ==========

async function fetchCandles(symbol = 'BTCUSDT', interval = '1d', limit = 200) {
  try {
    const response = await axios.get(`${BINANCE_API}/klines`, {
      params: { symbol, interval, limit },
      timeout: 10000
    });

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

async function getCurrentPrice(symbol = 'BTCUSDT') {
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

// ========== MOVING AVERAGES ==========

function calculateSMA(closes, period) {
  if (closes.length < period) return null;
  
  const smaValues = SMA.calculate({ period, values: closes });
  return smaValues.length > 0 ? smaValues[smaValues.length - 1] : null;
}

function calculateEMA(closes, period) {
  if (closes.length < period) return null;
  
  const emaValues = EMA.calculate({ period, values: closes });
  return emaValues.length > 0 ? emaValues[emaValues.length - 1] : null;
}

function calculateAllMAs(candles) {
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

// ========== RSI ==========

function calculateRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  
  const rsiValues = RSI.calculate({ values: closes, period });
  return rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : null;
}

function calculateAllRSI(candles) {
  const closes = candles.map(c => c.close);
  
  return {
    rsi14: calculateRSI(closes, 14),
    rsi30: calculateRSI(closes, 30)
  };
}

// ========== FIBONACCI ==========

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

function calculateFibonacci(candles, lookback = 90) {
  if (candles.length < lookback) return null;

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

// ========== SUPPORT & RESISTANCE ==========

function clusterLevels(levels, tolerance) {
  if (levels.length === 0) return [];

  const clusters = [];

  for (const level of levels) {
    let merged = false;

    for (const cluster of clusters) {
      const diff = Math.abs(level.price - cluster.price) / cluster.price;
      
      if (diff < tolerance && level.type === cluster.type) {
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

function findSupportResistance(candles, currentPrice, tolerance = 0.015) {
  if (candles.length < 30) {
    return { support: [], resistance: [] };
  }

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

  const clusteredLevels = clusterLevels(levels, tolerance);
  const sortedLevels = clusteredLevels.sort((a, b) => b.touches - a.touches);

  const support = sortedLevels
    .filter(l => l.type === 'support' && l.price < currentPrice)
    .slice(0, 3)
    .map(l => l.price);

  const resistance = sortedLevels
    .filter(l => l.type === 'resistance' && l.price > currentPrice)
    .slice(0, 3)
    .map(l => l.price);

  return {
    support: support.length > 0 ? support : [],
    resistance: resistance.length > 0 ? resistance : []
  };
}

// ========== MAIN LOGIC ==========

async function getAllIndicators() {
  try {
    const candles = await fetchCandles('BTCUSDT', '1d', 200);
    
    if (!candles || candles.length === 0) {
      throw new Error('No candle data received from Binance');
    }

    const currentPrice = await getCurrentPrice('BTCUSDT');
    const mas = calculateAllMAs(candles);
    const rsi = calculateAllRSI(candles);
    const fibonacci = calculateFibonacci(candles, 90);
    const sr = findSupportResistance(candles, currentPrice, 0.015);

    const indicators = {
      timestamp: Date.now(),
      currentPrice: Math.round(currentPrice * 100) / 100,
      
      ma21: mas.ma21 ? Math.round(mas.ma21 * 100) / 100 : null,
      ma50: mas.ma50 ? Math.round(mas.ma50 * 100) / 100 : null,
      ma100: mas.ma100 ? Math.round(mas.ma100 * 100) / 100 : null,
      ma200: mas.ma200 ? Math.round(mas.ma200 * 100) / 100 : null,
      ema20: mas.ema20 ? Math.round(mas.ema20 * 100) / 100 : null,
      ema50: mas.ema50 ? Math.round(mas.ema50 * 100) / 100 : null,

      rsi14: rsi.rsi14 ? Math.round(rsi.rsi14 * 100) / 100 : null,
      rsi30: rsi.rsi30 ? Math.round(rsi.rsi30 * 100) / 100 : null,

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

      support: sr.support.map(s => Math.round(s * 100) / 100),
      resistance: sr.resistance.map(r => Math.round(r * 100) / 100),

      dataSource: 'Binance API',
      candlesCount: candles.length
    };

    return indicators;

  } catch (error) {
    console.error('Error calculating indicators:', error);
    throw error;
  }
}

// ========== VERCEL HANDLER ==========

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const indicators = await getAllIndicators();
    res.status(200).json(indicators);
  } catch (error) {
    console.error('Indicators API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch indicators',
      message: error.message 
    });
  }
}
