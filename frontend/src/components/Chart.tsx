import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType } from 'lightweight-charts';
import { binanceService } from '../services/binance';
import { indicatorsService, IndicatorsData } from '../services/indicators';
import FearGreedGauge from './FearGreedGauge';

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

  // Fetch indicators from backend
  useEffect(() => {
    const loadIndicators = async () => {
      try {
        setLoading(true);
        const data = await indicatorsService.getIndicators();
        setIndicators(data);
      } catch (error) {
        console.error('Failed to load indicators:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();

    // Refresh every 5 minutes
    const interval = setInterval(loadIndicators, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get indicator lines based on enabled indicators and REAL data
  const getIndicatorLines = () => {
    if (!indicators) return [];

    const lines: Array<{ price: number; label: string; color: string; id: string }> = [];

    const indicatorConfig: Record<string, { price: number | null; label: string; color: string }> = {
      'ma-200': {
        price: indicators.ma200,
        label: '200 MA',
        color: 'rgba(255, 107, 53, 0.6)'
      },
      'ma-100': {
        price: indicators.ma100,
        label: '100 MA',
        color: 'rgba(255, 187, 102, 0.6)'
      },
      'ma-50': {
        price: indicators.ma50,
        label: '50 MA',
        color: 'rgba(0, 221, 255, 0.6)'
      },
      'ma-21': {
        price: indicators.ma21,
        label: '21 MA',
        color: 'rgba(0, 255, 136, 0.6)'
      },
      'ema-50': {
        price: indicators.ema50,
        label: '50 EMA',
        color: 'rgba(255, 136, 221, 0.6)'
      },
      'ema-20': {
        price: indicators.ema20,
        label: '20 EMA',
        color: 'rgba(136, 255, 221, 0.6)'
      },
      'fibonacci-618': {
        price: indicators.fibonacci?.level618 || null,
        label: 'Fib 0.618',
        color: 'rgba(255, 215, 0, 0.7)'
      },
      'fibonacci-50': {
        price: indicators.fibonacci?.level50 || null,
        label: 'Fib 0.50',
        color: 'rgba(255, 215, 0, 0.5)'
      },
      'fibonacci-382': {
        price: indicators.fibonacci?.level382 || null,
        label: 'Fib 0.382',
        color: 'rgba(255, 215, 0, 0.4)'
      },
      'support': {
        price: indicators.support && indicators.support.length > 0 ? indicators.support[0] : null,
        label: 'Support',
        color: 'rgba(0, 255, 136, 0.8)'
      },
      'resistance': {
        price: indicators.resistance && indicators.resistance.length > 0 ? indicators.resistance[0] : null,
        label: 'Resistance',
        color: 'rgba(255, 68, 68, 0.8)'
      }
    };

    enabledIndicators.forEach(id => {
      const config = indicatorConfig[id];
      if (config && config.price !== null) {
        lines.push({
          id,
          price: config.price,
          label: `${config.label}: $${config.price.toLocaleString()}`,
          color: config.color
        });
      }
    });

    return lines;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const containerWidth = chartContainerRef.current.clientWidth;

    // Create main chart with clean design
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0A0E27' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      width: containerWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2B2B43',
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#758696',
          width: 1,
          style: 3,
          labelBackgroundColor: '#00FF88',
        },
        horzLine: {
          color: '#758696',
          width: 1,
          style: 3,
          labelBackgroundColor: '#00FF88',
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00FF88',
      downColor: '#FF4444',
      borderUpColor: '#00FF88',
      borderDownColor: '#FF4444',
      wickUpColor: '#00FF88',
      wickDownColor: '#FF4444',
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
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: lineConfig.label,
      });

      if (priceLine) {
        priceLinesRef.current.push(priceLine);
      }
    });
  }, [enabledIndicators, indicators]);

  return (
    <div className="relative">
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-gray-800 px-3 py-2 rounded text-sm">
          Loading indicators...
        </div>
      )}

      {/* Current price & data info */}
      {indicators && (
        <div className="absolute top-4 right-4 z-10 bg-gray-800/90 px-4 py-2 rounded space-y-1">
          <div className="text-xl font-bold text-green-400">
            ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          {indicators.rsi14 && (
            <div className="text-xs text-gray-400">
              RSI(14): <span className={indicators.rsi14 < 30 ? 'text-green-400' : indicators.rsi14 > 70 ? 'text-red-400' : 'text-yellow-400'}>
                {indicators.rsi14.toFixed(2)}
              </span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Source: {indicators.dataSource}
          </div>
        </div>
      )}

      {/* Chart container */}
      <div ref={chartContainerRef} className="w-full" />

      {/* Fear & Greed Gauge */}
      <div className="mt-4">
        <FearGreedGauge />
      </div>
    </div>
  );
}
