import axios from 'axios';

/**
 * Scrape on-chain data from Bitcoin Magazine Pro
 * For MVP, returning mock data
 * TODO: Implement actual scraping when ready
 */
export async function getOnChainData() {
  try {
    // Mock data for MVP - will be replaced with actual scraping
    return {
      sthRealizedPrice: 65000 + Math.random() * 5000,
      mvrv: 2.1 + Math.random() * 0.3,
      realizedPrice: 32000 + Math.random() * 3000,
      cvdd: 28000 + Math.random() * 2000,
      timestamp: Date.now()
    };

    // TODO: Actual implementation
    // const response = await axios.get('https://bitcoinmagazinepro.com/charts/...');
    // const $ = cheerio.load(response.data);
    // Parse and return data
  } catch (error) {
    console.error('Error scraping Bitcoin Magazine:', error);
    throw error;
  }
}
