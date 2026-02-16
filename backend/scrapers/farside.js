import axios from 'axios';

/**
 * Scrape ETF flow data from Farside Investors
 * For MVP, returning mock data
 * TODO: Implement actual scraping when ready
 */
export async function getETFFlow() {
  try {
    // Mock data for MVP
    const mockFlow = (Math.random() - 0.5) * 1000; // Random flow between -500 and +500 million

    return {
      flow: mockFlow,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    // TODO: Actual implementation
    // const response = await axios.get('https://farside.co.uk/btc/');
    // Parse and return latest ETF flow
  } catch (error) {
    console.error('Error scraping Farside:', error);
    throw error;
  }
}
