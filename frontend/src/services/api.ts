import axios from 'axios';
import { OnChainData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getFearGreed(): Promise<number> {
    try {
      const response = await axios.get('https://api.alternative.me/fng/');
      return parseInt(response.data.data[0].value);
    } catch (error) {
      console.error('Error fetching Fear & Greed:', error);
      return 50; // neutral fallback
    }
  },

  async getOnChainData(): Promise<OnChainData> {
    try {
      const response = await axios.get(`${API_BASE}/onchain`);
      return response.data;
    } catch (error) {
      console.error('Error fetching on-chain data:', error);
      return {};
    }
  },

  async getETFFlow(): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE}/etf-flow`);
      return response.data.flow || 0;
    } catch (error) {
      console.error('Error fetching ETF flow:', error);
      return 0;
    }
  },

  async getLiquidationHeatmap(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/liquidation-heatmap`);
      return response.data;
    } catch (error) {
      console.error('Error fetching liquidation heatmap:', error);
      return null;
    }
  }
};
