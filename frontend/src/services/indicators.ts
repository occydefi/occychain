/**
 * Indicators API Service - Fetches REAL data from backend
 */

// In production, use relative URL (same domain)
// In development, use localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');

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
   * Fetch all indicators from backend
   */
  async getIndicators(): Promise<IndicatorsData> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log('📊 Using cached indicators');
      return this.cache;
    }

    try {
      console.log('🔄 Fetching indicators from backend...');
      const response = await fetch(`${API_BASE_URL}/api/indicators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: IndicatorsData = await response.json();
      
      // Update cache
      this.cache = data;
      this.lastFetch = now;

      console.log('✅ Indicators loaded:', {
        price: data.currentPrice,
        ma200: data.ma200,
        rsi14: data.rsi14
      });

      return data;
    } catch (error) {
      console.error('❌ Failed to fetch indicators:', error);
      
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
