import { IndicatorsData } from '../services/indicators';

interface MarketInsightsProps {
  indicators: IndicatorsData | null;
  currentPrice: number;
}

export default function MarketInsights({ indicators, currentPrice }: MarketInsightsProps) {
  if (!indicators) return null;

  // Calculate insights with BOM SENSO
  const insights = getMarketInsights(indicators, currentPrice);

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-700/50">
      {/* Main insight - Most important! */}
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${insights.emoji}`}>
          {insights.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-400 mb-1">Market Context</h3>
          <p className="text-base text-white font-medium leading-relaxed">
            {insights.mainMessage}
          </p>
        </div>
      </div>

      {/* Key metrics - Visual hierarchy */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/50">
        <MetricCard
          label="vs MA200"
          value={insights.distanceToMA200}
          sentiment={insights.ma200Sentiment}
          tooltip="Distance to long-term trend (200-day average)"
        />
        <MetricCard
          label="RSI Signal"
          value={insights.rsiLabel}
          sentiment={insights.rsiSentiment}
          tooltip="Momentum indicator: <30 oversold, >70 overbought"
        />
        <MetricCard
          label="Trend"
          value={insights.trend}
          sentiment={insights.trendSentiment}
          tooltip="Based on price vs moving averages"
        />
        <MetricCard
          label="Volatility"
          value={insights.volatility}
          sentiment="neutral"
          tooltip="Recent price range activity"
        />
      </div>

      {/* Warnings - Only show if important! */}
      {insights.warnings.length > 0 && (
        <div className="pt-2 border-t border-gray-700/50 space-y-1">
          {insights.warnings.map((warning, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-yellow-400">
              <span>⚠️</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  sentiment, 
  tooltip 
}: { 
  label: string; 
  value: string; 
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tooltip: string;
}) {
  const colors = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <div 
      className="bg-gray-800/30 rounded p-2 hover:bg-gray-800/50 transition-colors cursor-help"
      title={tooltip}
    >
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${colors[sentiment]}`}>
        {value}
      </div>
    </div>
  );
}

// BOM SENSO: Generate insights that actually help the user
function getMarketInsights(indicators: IndicatorsData, currentPrice: number) {
  const { ma200, ma100, ma50, ma21, rsi14, fibonacci } = indicators;

  // Distance to MA200 (most important long-term indicator)
  const distMA200 = ma200 ? ((currentPrice - ma200) / ma200) * 100 : 0;
  const distMA200Text = `${distMA200 > 0 ? '+' : ''}${distMA200.toFixed(1)}%`;
  
  // RSI analysis
  const rsiLevel = rsi14 || 50;
  const rsiLabel = rsiLevel < 30 ? 'Oversold' : rsiLevel > 70 ? 'Overbought' : 'Neutral';
  const rsiSentiment: 'bullish' | 'bearish' | 'neutral' = rsiLevel < 30 ? 'bullish' : rsiLevel > 70 ? 'bearish' : 'neutral';

  // Trend analysis (price vs MAs)
  let trend = 'Neutral';
  let trendSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  
  if (ma21 && ma50 && ma100 && ma200) {
    if (currentPrice > ma21 && currentPrice > ma50 && currentPrice > ma200) {
      trend = 'Strong Bull';
      trendSentiment = 'bullish';
    } else if (currentPrice < ma21 && currentPrice < ma50 && currentPrice < ma200) {
      trend = 'Strong Bear';
      trendSentiment = 'bearish';
    } else if (currentPrice > ma200) {
      trend = 'Bullish';
      trendSentiment = 'bullish';
    } else {
      trend = 'Bearish';
      trendSentiment = 'bearish';
    }
  }

  // Main message - CLEAR and ACTIONABLE
  let mainMessage = '';
  let icon = '📊';

  if (distMA200 < -20 && rsiLevel < 35) {
    mainMessage = `BTC is ${Math.abs(distMA200).toFixed(0)}% below MA200 with RSI at ${rsiLevel.toFixed(0)}. Historically strong accumulation zone.`;
    icon = '🟢';
  } else if (distMA200 > 50 && rsiLevel > 70) {
    mainMessage = `BTC is ${distMA200.toFixed(0)}% above MA200 with RSI at ${rsiLevel.toFixed(0)}. Overheated territory - caution advised.`;
    icon = '🔴';
  } else if (currentPrice < (ma200 || 0)) {
    mainMessage = `BTC trading below long-term average (MA200). ${rsiLevel < 40 ? 'Oversold conditions may present opportunities.' : 'Waiting for trend reversal signals.'}`;
    icon = '⚠️';
  } else {
    mainMessage = `BTC in ${trend.toLowerCase()} trend, ${distMA200Text} from MA200. RSI at ${rsiLevel.toFixed(0)} suggests ${rsiLabel.toLowerCase()} conditions.`;
    icon = '📈';
  }

  // Warnings - Only important stuff!
  const warnings: string[] = [];
  
  if (ma21 && ma50 && ma21 < ma50 && currentPrice < ma50) {
    warnings.push('Death cross forming (21 MA crossing below 50 MA)');
  }
  
  if (fibonacci?.level618 && currentPrice > fibonacci.level618 * 1.1) {
    warnings.push('Above key Fibonacci resistance - watch for pullback');
  }

  // Volatility (simple calculation)
  const volatility = fibonacci ? 
    (((fibonacci.swingHigh - fibonacci.swingLow) / fibonacci.swingLow) * 100).toFixed(0) + '%' : 
    'N/A';

  const ma200Sentiment: 'bullish' | 'bearish' | 'neutral' = distMA200 > 0 ? 'bullish' : 'bearish';

  return {
    mainMessage,
    icon,
    emoji: trendSentiment === 'bullish' ? '🟢' : trendSentiment === 'bearish' ? '🔴' : '🟡',
    distanceToMA200: distMA200Text,
    ma200Sentiment,
    rsiLabel,
    rsiSentiment,
    trend,
    trendSentiment,
    volatility,
    warnings
  };
}
