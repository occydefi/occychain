export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OnChainData {
  sthRealizedPrice?: number;
  mvrv?: number;
  realizedPrice?: number;
  cvdd?: number;
}

export interface MarketData {
  fearGreed: number;
  etfFlow: number;
  liquidationHeatmap: any;
}

export interface Indicator {
  id: string;
  name: string;
  category: 'onchain' | 'technical' | 'ma';
  enabled: boolean;
  description?: string;
}

export interface Zone {
  price: number;
  color: string;
  label: string;
}
