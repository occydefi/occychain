import axios from 'axios';

/**
 * Scrape liquidation heatmap from Coinglass
 * For MVP, returning mock data
 * TODO: Implement actual scraping when ready
 */
export async function getLiquidationHeatmap() {
  try {
    // Mock heatmap data for MVP
    const currentPrice = 95000 + Math.random() * 5000;
    const levels = [];

    for (let i = -10; i <= 10; i++) {
      const priceLevel = currentPrice * (1 + i * 0.01);
      const intensity = Math.abs(Math.sin(i)) * 100;
      
      levels.push({
        price: priceLevel,
        intensity,
        side: i < 0 ? 'long' : 'short'
      });
    }

    return {
      levels,
      currentPrice,
      timestamp: Date.now()
    };

    // TODO: Actual implementation
    // const response = await axios.get('https://www.coinglass.com/pro/futures/Liquidations');
    // Parse and return heatmap data
  } catch (error) {
    console.error('Error scraping Coinglass:', error);
    throw error;
  }
}
