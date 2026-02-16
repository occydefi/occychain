import { Zone } from '../types';

export function calculateZones(currentPrice: number): Zone[] {
  // Simplified zone calculation for MVP
  // Will be enhanced with real confluence logic later
  
  const zones: Zone[] = [];
  
  // Buy zones (green gradient)
  zones.push({
    price: currentPrice * 0.85,
    color: '#00FF88',
    label: 'Strong Buy Zone'
  });
  
  zones.push({
    price: currentPrice * 0.90,
    color: '#00DD77',
    label: 'Buy Zone'
  });
  
  zones.push({
    price: currentPrice * 0.95,
    color: '#00BB66',
    label: 'Accumulation'
  });
  
  // Neutral zone
  zones.push({
    price: currentPrice,
    color: '#FFFFFF',
    label: 'Neutral'
  });
  
  // Sell zones (orange/red gradient)
  zones.push({
    price: currentPrice * 1.05,
    color: '#FFB366',
    label: 'Distribution'
  });
  
  zones.push({
    price: currentPrice * 1.10,
    color: '#FF8844',
    label: 'Sell Zone'
  });
  
  zones.push({
    price: currentPrice * 1.15,
    color: '#FF4444',
    label: 'Strong Sell Zone'
  });
  
  return zones;
}

export function getZoneColor(price: number, zones: Zone[]): string {
  for (let i = 0; i < zones.length - 1; i++) {
    if (price >= zones[i].price && price <= zones[i + 1].price) {
      return zones[i].color;
    }
  }
  return zones[zones.length - 1].color;
}
