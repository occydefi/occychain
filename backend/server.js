import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import { getOnChainData } from './scrapers/bitcoin-magazine.js';
import { getETFFlow } from './scrapers/farside.js';
import { getLiquidationHeatmap } from './scrapers/coinglass.js';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// On-chain data endpoint
app.get('/api/onchain', async (req, res) => {
  try {
    const cached = cache.get('onchain');
    if (cached) {
      return res.json(cached);
    }

    const data = await getOnChainData();
    cache.set('onchain', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching on-chain data:', error);
    res.status(500).json({ error: 'Failed to fetch on-chain data' });
  }
});

// ETF flow endpoint
app.get('/api/etf-flow', async (req, res) => {
  try {
    const cached = cache.get('etf-flow');
    if (cached) {
      return res.json(cached);
    }

    const data = await getETFFlow();
    cache.set('etf-flow', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching ETF flow:', error);
    res.status(500).json({ error: 'Failed to fetch ETF flow' });
  }
});

// Liquidation heatmap endpoint
app.get('/api/liquidation-heatmap', async (req, res) => {
  try {
    const cached = cache.get('liquidation-heatmap');
    if (cached) {
      return res.json(cached);
    }

    const data = await getLiquidationHeatmap();
    cache.set('liquidation-heatmap', data, 1800); // 30 min cache
    res.json(data);
  } catch (error) {
    console.error('Error fetching liquidation heatmap:', error);
    res.status(500).json({ error: 'Failed to fetch liquidation heatmap' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🧌 OccyChain Backend running on port ${PORT}`);
});
