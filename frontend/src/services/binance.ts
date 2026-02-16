import { CandleData } from '../types';

class BinanceService {
  private ws: WebSocket | null = null;
  private callbacks: ((data: CandleData) => void)[] = [];

  connect(symbol: string = 'BTCUSDT') {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1d`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.k) {
        const candle: CandleData = {
          time: Math.floor(data.k.t / 1000),
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c),
          volume: parseFloat(data.k.v),
        };
        this.callbacks.forEach(cb => cb(candle));
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      setTimeout(() => this.connect(symbol), 3000);
    };
  }

  subscribe(callback: (data: CandleData) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async getHistoricalData(symbol: string = 'BTCUSDT', limit: number = 365): Promise<CandleData[]> {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.map((d: any) => ({
      time: Math.floor(d[0] / 1000),
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));
  }
}

export const binanceService = new BinanceService();
