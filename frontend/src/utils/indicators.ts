import { Indicator } from '../types';

export const indicators: Indicator[] = [
  // On-Chain
  {
    id: 'sth-realized',
    name: 'STH Realized Price',
    category: 'onchain',
    enabled: false,
    description: 'Preço médio que holders de curto prazo (< 155 dias) pagaram. Importante suporte/resistência.'
  },
  {
    id: 'mvrv',
    name: 'MVRV Ratio',
    category: 'onchain',
    enabled: false,
    description: 'Market Value / Realized Value. Acima de 3.5 = topo histórico. Abaixo de 1 = fundo.'
  },
  {
    id: 'realized-price',
    name: 'Realized Price',
    category: 'onchain',
    enabled: false,
    description: 'Preço médio de todos os BTCs baseado na última movimentação. Suporte histórico forte.'
  },
  {
    id: 'cvdd',
    name: 'CVDD',
    category: 'onchain',
    enabled: false,
    description: 'Cumulative Value-Days Destroyed. Indica fundos de mercado historicamente.'
  },
  
  // Technical
  {
    id: 'fibonacci-618',
    name: 'Fibonacci 0.618',
    category: 'technical',
    enabled: false,
    description: 'Nível de retração de Fibonacci 61.8% (Golden Ratio). Suporte/resistência forte.'
  },
  {
    id: 'fibonacci-50',
    name: 'Fibonacci 0.50',
    category: 'technical',
    enabled: false,
    description: 'Nível de retração de Fibonacci 50%. Ponto médio entre swing high e low.'
  },
  {
    id: 'fibonacci-382',
    name: 'Fibonacci 0.382',
    category: 'technical',
    enabled: false,
    description: 'Nível de retração de Fibonacci 38.2%. Retração comum em mercados fortes.'
  },
  {
    id: 'support',
    name: 'Suporte',
    category: 'technical',
    enabled: false,
    description: 'Nível de suporte mais relevante baseado em análise de candles históricos.'
  },
  {
    id: 'resistance',
    name: 'Resistência',
    category: 'technical',
    enabled: false,
    description: 'Nível de resistência mais relevante baseado em análise de candles históricos.'
  },
  {
    id: 'liquidation-heatmap',
    name: 'Heatmap Liquidação',
    category: 'technical',
    enabled: false,
    description: 'Concentração de ordens de liquidação. Preço tende a buscar essas zonas.'
  },
  
  // Moving Averages
  {
    id: 'ma-21',
    name: 'MA 21',
    category: 'ma',
    enabled: false,
    description: 'Média móvel de 21 dias. Tendência de curtíssimo prazo.'
  },
  {
    id: 'ma-50',
    name: 'MA 50',
    category: 'ma',
    enabled: false,
    description: 'Média móvel de 50 dias. Tendência de curto prazo.'
  },
  {
    id: 'ma-100',
    name: 'MA 100',
    category: 'ma',
    enabled: false,
    description: 'Média móvel de 100 dias. Tendência de médio prazo.'
  },
  {
    id: 'ma-200',
    name: 'MA 200',
    category: 'ma',
    enabled: false,
    description: 'Média móvel de 200 dias. Tendência de longo prazo. Muito respeitada.'
  },
  {
    id: 'ema-20',
    name: 'EMA 20',
    category: 'ma',
    enabled: false,
    description: 'Média móvel exponencial de 20 dias. Reage mais rápido que MA simples.'
  },
  {
    id: 'ema-50',
    name: 'EMA 50',
    category: 'ma',
    enabled: false,
    description: 'Média móvel exponencial de 50 dias. Golden/Death cross com EMA 200.'
  },
];
