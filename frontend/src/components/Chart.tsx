import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { binanceService } from '../services/binance';
import { CandleData } from '../types';

interface ChartProps {
  enabledIndicators: string[];
}

export default function Chart({ enabledIndicators }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0A0E27' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: '#1A1E37' },
        horzLines: { color: '#1A1E37' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00FF88',
      downColor: '#FF4444',
      borderUpColor: '#00FF88',
      borderDownColor: '#FF4444',
      wickUpColor: '#00FF88',
      wickDownColor: '#FF4444',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Load historical data
    binanceService.getHistoricalData().then(data => {
      candleSeries.setData(data);
      if (data.length > 0) {
        setCurrentPrice(data[data.length - 1].close);
      }
    });

    // Subscribe to real-time updates
    binanceService.connect();
    const unsubscribe = binanceService.subscribe((candle: CandleData) => {
      candleSeries.update(candle);
      setCurrentPrice(candle.close);
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
      chart.remove();
    };
  }, []);

  // Update indicators when enabled/disabled
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Here we would add/remove indicator lines based on enabledIndicators
    // For MVP, this is a placeholder
    console.log('Enabled indicators:', enabledIndicators);
  }, [enabledIndicators]);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 bg-occy-dark/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-occy-blue/30">
        <div className="text-occy-blue text-sm font-medium">BTC/USDT</div>
        <div className="text-white text-2xl font-mono font-bold">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
