import { IndicatorsData } from '../services/indicators';

interface QuickStatsProps {
  indicators: IndicatorsData | null;
  currentPrice: number;
}

export default function QuickStats({ indicators, currentPrice }: QuickStatsProps) {
  if (!indicators) return null;

  const stats = [
    {
      label: 'Current Price',
      value: formatPrice(currentPrice),
      subtext: 'BTC/USDT',
      color: 'text-white',
      size: 'text-3xl'
    },
    {
      label: 'RSI (14)',
      value: indicators.rsi14?.toFixed(1) || 'N/A',
      subtext: getRSIStatus(indicators.rsi14 || 50),
      color: getRSIColor(indicators.rsi14 || 50),
      size: 'text-2xl'
    },
    {
      label: '200 MA',
      value: formatPrice(indicators.ma200 || 0),
      subtext: getPriceVsMA(currentPrice, indicators.ma200 || 0),
      color: currentPrice > (indicators.ma200 || 0) ? 'text-green-400' : 'text-red-400',
      size: 'text-xl'
    },
    {
      label: 'Support',
      value: formatPrice(indicators.support?.[0] || 0),
      subtext: getDistance(currentPrice, indicators.support?.[0] || 0),
      color: 'text-green-400',
      size: 'text-xl'
    },
    {
      label: 'Resistance',
      value: formatPrice(indicators.resistance?.[0] || 0),
      subtext: getDistance(currentPrice, indicators.resistance?.[0] || 0),
      color: 'text-red-400',
      size: 'text-xl'
    }
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  subtext, 
  color, 
  size 
}: { 
  label: string; 
  value: string; 
  subtext: string; 
  color: string; 
  size: string;
}) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-all">
      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
        {label}
      </div>
      <div className={`${size} font-bold ${color} mb-0.5 leading-tight`}>
        {value}
      </div>
      <div className="text-xs text-gray-400">
        {subtext}
      </div>
    </div>
  );
}

// Helper functions with BOM SENSO
function formatPrice(price: number): string {
  if (price === 0) return 'N/A';
  return '$' + price.toLocaleString(undefined, { 
    maximumFractionDigits: 0 
  });
}

function getRSIStatus(rsi: number): string {
  if (rsi < 30) return 'Oversold';
  if (rsi > 70) return 'Overbought';
  if (rsi < 40) return 'Weak';
  if (rsi > 60) return 'Strong';
  return 'Neutral';
}

function getRSIColor(rsi: number): string {
  if (rsi < 30) return 'text-green-400';  // Oversold = potential buy
  if (rsi > 70) return 'text-red-400';    // Overbought = potential sell
  if (rsi < 40) return 'text-yellow-400'; // Weak
  if (rsi > 60) return 'text-orange-400'; // Strong
  return 'text-gray-400';                 // Neutral
}

function getPriceVsMA(price: number, ma: number): string {
  if (ma === 0) return 'N/A';
  const diff = ((price - ma) / ma) * 100;
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
}

function getDistance(price: number, level: number): string {
  if (level === 0) return 'N/A';
  const diff = ((price - level) / level) * 100;
  const abs = Math.abs(diff);
  
  if (abs < 1) return 'Near';
  if (abs < 5) return `${abs.toFixed(1)}% away`;
  return `${abs.toFixed(0)}% away`;
}
