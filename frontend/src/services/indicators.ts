/**
 * Indicators Service - Calculates REAL data CLIENT-SIDE
 * NO BACKEND REQUIRED - Fetches from Binance directly
 */

import { binanceService } from './binance';
import { 
  calculateAllMAs, 
  calculateAllRSI, 
  calculateFibonacci, 
  findSupportResistance
} from '../utils/calculations';

export interface IndicatorsData {
  timestamp: number;
  currentPrice: number;
  ma21: number | null;
  ma50: number | null;
  ma100: number | null;
  ma200: number | null;
  ema20: number | null;
  ema50: number | null;
  rsi14: number | null;
  rsi30: number | null;
  fibonacci: {
    level0: number;
    level236: number;
    level382: number;
    level50: number;
    level618: number;
    level786: number;
    level100: number;
    swingHigh: number;
    swingLow: number;
  } | null;
  support: number[];
  resistance: number[];
  dataSource: string;
  candlesCount: number;
}

class IndicatorsService {
  private cache: IndicatorsData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Calculate all indicators CLIENT-SIDE from Binance data
   */
  async getIndicators(): Promise<IndicatorsData> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log('📊 Using cached indicators');
      return this.cache;
    }

    try {
      console.log('🔄 Fetching data from Binance and calculating indicators...');
      
      // Fetch historical data directly from Binance
      const candles = await binanceService.getHistoricalData('BTCUSDT', 365);
      
      if (!candles || candles.length === 0) {
        throw new Error('No candle data received from Binance');
      }

      const currentPrice = candles[candles.length - 1].close;

      // Calculate all indicators CLIENT-SIDE
      const mas = calculateAllMAs(candles);
      const rsis = calculateAllRSI(candles);
      const fibonacci = calculateFibonacci(candles, 90);
      const { support, resistance } = findSupportResistance(candles, currentPrice, 0.02);

      const data: IndicatorsData = {
        timestamp: now,
        currentPrice,
        ...mas,
        ...rsis,
        fibonacci,
        support,
        resistance,
        dataSource: 'Binance API (Client-side calculation)',
        candlesCount: candles.length
      };

      // Update cache
      this.cache = data;
      this.lastFetch = now;

      console.log('✅ Indicators calculated successfully:', {
        price: data.currentPrice,
        ma200: data.ma200,
        rsi14: data.rsi14,
        fibonacci: data.fibonacci ? 'calculated' : 'null',
        support: data.support.length,
        resistance: data.resistance.length
      });

      return data;
    } catch (error) {
      console.error('❌ Failed to calculate indicators:', error);
      
      // Return cached data if available, even if stale
      if (this.cache) {
        console.warn('⚠️ Using stale cached data due to error');
        return this.cache;
      }
      
      throw error;
    }
  }

  /**
   * Force refresh indicators (bypass cache)
   */
  async refresh(): Promise<IndicatorsData> {
    this.cache = null;
    this.lastFetch = 0;
    return this.getIndicators();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

export const indicatorsService = new IndicatorsService();
