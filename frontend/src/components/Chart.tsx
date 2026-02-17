import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType } from 'lightweight-charts';
import { binanceService } from '../services/binance';
import { indicatorsService, IndicatorsData } from '../services/indicators';
import FearGreedGauge from './FearGreedGauge';
import QuickStats from './QuickStats';
import MarketInsights from './MarketInsights';
import LoadingState from './LoadingState';

interface ChartProps {
  enabledIndicators: string[];
}

export default function Chart({ enabledIndicators }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const priceLinesRef = useRef<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [indicators, setIndicators] = useState<IndicatorsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch indicators from backend
  useEffect(() => {
    const loadIndicators = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await indicatorsService.getIndicators();
        setIndicators(data);
      } catch (err) {
        console.error('Failed to load indicators:', err);
        setError('Failed to load market data. Using cached data if available.');
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();

    // Refresh every 5 minutes
    const interval = setInterval(loadIndicators, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // BOM SENSO: Warn if too many indicators are active
  const tooManyIndicators = enabledIndicators.length > 5;

  // Get indicator lines based on enabled indicators and REAL data
  const getIndicatorLines = () => {
    if (!indicators) return [];

    const lines: Array<{ 
      price: number; 
      label: string; 
      color: string; 
      id: string;
      description: string;
    }> = [];

    const indicatorConfig: Record<string, { 
      price: number | null; 
      label: string; 
      color: string;
      description: string;
    }> = {
      'ma-200': {
        price: indicators.ma200,
        label: '200 MA',
        color: 'rgba(255, 107, 53, 0.7)',
        description: 'Long-term trend (200-day average)'
      },
      'ma-100': {
        price: indicators.ma100,
        label: '100 MA',
        color: 'rgba(255, 187, 102, 0.7)',
        description: 'Medium-term trend'
      },
      'ma-50': {
        price: indicators.ma50,
        label: '50 MA',
        color: 'rgba(0, 221, 255, 0.7)',
        description: 'Short-term trend'
      },
      'ma-21': {
        price: indicators.ma21,
        label: '21 MA',
        color: 'rgba(0, 255, 136, 0.7)',
        description: 'Very short-term trend'
      },
      'ema-50': {
        price: indicators.ema50,
        label: '50 EMA',
        color: 'rgba(255, 136, 221, 0.7)',
        description: 'Exponential MA (more reactive)'
      },
      'ema-20': {
        price: indicators.ema20,
        label: '20 EMA',
        color: 'rgba(136, 255, 221, 0.7)',
        description: 'Fast EMA'
      },
      'fibonacci-618': {
        price: indicators.fibonacci?.level618 || null,
        label: 'Fib 0.618',
        color: 'rgba(255, 215, 0, 0.8)',
        description: 'Golden ratio retracement'
      },
      'fibonacci-50': {
        price: indicators.fibonacci?.level50 || null,
        label: 'Fib 0.50',
        color: 'rgba(255, 215, 0, 0.6)',
        description: '50% retracement level'
      },
      'fibonacci-382': {
        price: indicators.fibonacci?.level382 || null,
        label: 'Fib 0.382',
        color: 'rgba(255, 215, 0, 0.5)',
        description: '38.2% retracement'
      },
      'support': {
        price: indicators.support && indicators.support.length > 0 ? indicators.support[0] : null,
        label: 'Support',
        color: 'rgba(0, 255, 136, 0.9)',
        description: 'Key support level'
      },
      'resistance': {
        price: indicators.resistance && indicators.resistance.length > 0 ? indicators.resistance[0] : null,
        label: 'Resistance',
        color: 'rgba(255, 68, 68, 0.9)',
        description: 'Key resistance level'
      }
    };

    enabledIndicators.forEach(id => {
      const config = indicatorConfig[id];
      if (config && config.price !== null) {
        lines.push({
          id,
          price: config.price,
          label: `${config.label}: $${config.price.toLocaleString()}`,
          color: config.color,
          description: config.description
        });
      }
    });

    return lines;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const containerWidth = chartContainerRef.current.clientWidth;

    // Create main chart with CLEAN, PROFESSIONAL design
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0A0E27' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      width: containerWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#1F2937',
      },
      rightPriceScale: {
        borderColor: '#1F2937',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6B7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#10B981',
        },
        horzLine: {
          color: '#6B7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#10B981',
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    candleSeriesRef.current = candleSeries;

    // Load historical candle data
    binanceService.getHistoricalData().then(data => {
      candleSeries.setData(data);
      
      if (data.length > 0) {
        const lastCandle = data[data.length - 1];
        setCurrentPrice(lastCandle.close);
      }
    });

    // Cleanup
    return () => {
      chart.remove();
    };
  }, []);

  // Update price lines when indicators change
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;

    // Remove old price lines
    priceLinesRef.current.forEach(line => {
      candleSeriesRef.current?.removePriceLine(line);
    });
    priceLinesRef.current = [];

    // Add new price lines for enabled indicators
    const lines = getIndicatorLines();
    
    lines.forEach(lineConfig => {
      const priceLine = candleSeriesRef.current?.createPriceLine({
        price: lineConfig.price,
        color: lineConfig.color,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: lineConfig.label,
      });

      if (priceLine) {
        priceLinesRef.current.push(priceLine);
      }
    });
  }, [enabledIndicators, indicators]);

  // BOM SENSO: Show loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Error message - FRIENDLY and HELPFUL */}
      {error && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 flex items-start gap-3">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-yellow-200">{error}</p>
            <p className="text-xs text-yellow-600 mt-1">
              Data refreshes every 5 minutes. Check your connection.
            </p>
          </div>
        </div>
      )}

      {/* Too many indicators warning - BOM SENSO! */}
      {tooManyIndicators && (
        <div className="bg-orange-900/20 border border-orange-600/50 rounded-lg p-3 flex items-start gap-3">
          <span className="text-orange-500 text-xl">💡</span>
          <div className="flex-1">
            <p className="text-sm text-orange-200 font-medium">
              Too many indicators active ({enabledIndicators.length})
            </p>
            <p className="text-xs text-orange-400 mt-1">
              For clearer analysis, try using 3-4 indicators at a time. Less is more!
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats - VISUAL HIERARCHY */}
      <QuickStats indicators={indicators} currentPrice={currentPrice} />

      {/* Chart Container */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div ref={chartContainerRef} className="w-full" />
      </div>

      {/* Market Insights - ACTIONABLE CONTEXT */}
      <MarketInsights indicators={indicators} currentPrice={currentPrice} />

      {/* Fear & Greed Gauge */}
      <FearGreedGauge />

      {/* Data attribution - TRANSPARENCY */}
      <div className="text-center text-xs text-gray-600">
        Data source: Binance API • Updates every 5 minutes • {indicators?.candlesCount || 0} candles analyzed
      </div>
    </div>
  );
}
