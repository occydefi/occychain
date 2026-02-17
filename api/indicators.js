// Vercel Serverless Function
import { getAllIndicators } from '../backend/api/indicators.js';

export default async function handler(req, res) {
  // Enable CORS
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
