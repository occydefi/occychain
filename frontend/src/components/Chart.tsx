import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType } from 'lightweight-charts';
import { binanceService } from '../services/binance';
import { CandleData } from '../types';
import FearGreedGauge from './FearGreedGauge';

interface ChartProps {
  enabledIndicators: string[];
}

// Mock data for on-chain indicators (based on BTC ~$96k)
const MOCK_INDICATORS = {
  sthRealizedPrice: 88500,
  mvrvScore: 92000,
  realizedPrice: 85000,
  cvdd: 90000,
  fibonacci618: 94000,
  fibonacci50: 88000,
  fibonacci382: 82000,
  ma200: 75000,
  ma100: 82000,
  support1: 93000,
  resistance1: 98000,
  nupl75: 97000,
  nupl50: 95000,
  nupl25: 91000,
  rhodl5: 89000,
  rhodl10: 87000,
};

// Price bands configuration
interface PriceBand {
  from: number;
  to: number;
  color: string;
  label: string;
}

const PRICE_BANDS: PriceBand[] = [
  // Strong support zones (dark green)
  { from: 82000, to: 85000, color: 'rgba(0, 170, 102, 0.25)', label: 'Strong Support' },
  // Medium support zones (medium green)
  { from: 85000, to: 88500, color: 'rgba(0, 221, 119, 0.20)', label: 'Support Zone' },
  // Light support (light green) - confluence area
  { from: 88500, to: 93000, color: 'rgba(0, 255, 136, 0.15)', label: 'Buy Zone' },
  // Neutral zone (white)
  { from: 93000, to: 95000, color: 'rgba(255, 255, 255, 0.05)', label: 'Neutral' },
  // Light resistance (light orange)
  { from: 95000, to: 97000, color: 'rgba(255, 187, 102, 0.15)', label: 'Weak Resistance' },
  // Medium resistance (orange)
  { from: 97000, to: 99000, color: 'rgba(255, 136, 68, 0.20)', label: 'Resistance' },
  // Strong resistance (red)
  { from: 99000, to: 102000, color: 'rgba(255, 68, 68, 0.25)', label: 'Strong Resistance' },
];

// Mock ETF Flow data (millions USD per day)
const generateETFFlowData = (candles: CandleData[]) => {
  return candles.map(candle => {
    const isInflow = Math.random() > 0.5;
    const value = isInflow 
      ? Math.random() * 500 + 100  // Inflow (positive)
      : -(Math.random() * 300 + 50); // Outflow (negative)
    
    return {
      time: candle.time,
      value: value,
      color: isInflow 
        ? 'rgba(0, 255, 136, 0.3)'  // Green for inflows
        : 'rgba(255, 68, 68, 0.3)'  // Red for outflows
    };
  });
};

export default function Chart({ enabledIndicators }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const etfSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const priceLinesRef = useRef<any[]>([]);
  const bandSeriesRef = useRef<ISeriesApi<'Line'>[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [showETF, setShowETF] = useState<boolean>(true);

  // Get indicator lines based on enabled indicators
  const getIndicatorLines = () => {
    const lines: Array<{ price: number; label: string; color: string; id: string }> = [];

    const indicatorConfig = {
      'sth-realized': { 
        price: MOCK_INDICATORS.sthRealizedPrice, 
        label: 'STH Realized Price', 
        color: '#00FF88' 
      },
      'mvrv': { 
        price: MOCK_INDICATORS.mvrvScore, 
        label: 'MVRV Z-Score', 
        color: '#00DDFF' 
      },
      'realized-price': { 
        price: MOCK_INDICATORS.realizedPrice, 
        label: 'Realized Price', 
        color: '#FFBB66' 
      },
      'cvdd': { 
        price: MOCK_INDICATORS.cvdd, 
        label: 'CVDD', 
        color: '#FF88DD' 
      },
      'fibonacci': {
        price: MOCK_INDICATORS.fibonacci618,
        label: 'Fibonacci 0.618',
        color: '#FFD700'
      },
      'ma-200': {
        price: MOCK_INDICATORS.ma200,
        label: '200 MA',
        color: '#FF6B6B'
      },
      'ma-100': {
        price: MOCK_INDICATORS.ma100,
        label: '100 MA',
        color: '#FFA500'
      },
      'nupl': {
        price: MOCK_INDICATORS.nupl50,
        label: 'NUPL 50%',
        color: '#9D4EDD'
      },
      'rhodl': {
        price: MOCK_INDICATORS.rhodl10,
        label: 'RHODL Ratio 10',
        color: '#06FFA5'
      }
    };

    enabledIndicators.forEach(id => {
      if (indicatorConfig[id as keyof typeof indicatorConfig]) {
        const config = indicatorConfig[id as keyof typeof indicatorConfig];
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

    // Create main chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0A0E27' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: '#1A1E37' },
        horzLines: { color: '#1A1E37' },
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
        scaleMargins: {
          top: 0.05,
          bottom: 0.25, // Make room for ETF histogram
        },
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

    // Add price bands as area series (BEHIND candles)
    PRICE_BANDS.forEach(band => {
      const bandSeries = chart.addLineSeries({
        color: band.color,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        title: band.label,
      });
      
      bandSeriesRef.current.push(bandSeries);
    });

    // Add candlestick series (FOREGROUND)
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00FF88',
      downColor: '#FF4444',
      borderUpColor: '#00FF88',
      borderDownColor: '#FF4444',
      wickUpColor: '#00FF88',
      wickDownColor: '#FF4444',
    });

    // Add ETF Flow histogram on separate scale
    const etfSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'etf', // Separate price scale
      lastValueVisible: false,
      priceLineVisible: false,
    });

    chart.priceScale('etf').applyOptions({
      scaleMargins: {
        top: 0.8, // Push ETF to bottom
        bottom: 0,
      },
    });

    candleSeriesRef.current = candleSeries;
    etfSeriesRef.current = etfSeries;

    // Load historical data
    binanceService.getHistoricalData().then(data => {
      candleSeries.setData(data);
      
      if (data.length > 0) {
        const lastCandle = data[data.length - 1];
        setCurrentPrice(lastCandle.close);
        
        // Add price bands data (create horizontal bands by setting same value for start and end time)
        PRICE_BANDS.forEach((band, index) => {
          const bandSeries = bandSeriesRef.current[index];
          const midPrice = (band.from + band.to) / 2;
          
          // Create data for horizontal band
          const bandData = [
            { time: data[0].time, value: midPrice },
            { time: data[data.length - 1].time, value: midPrice },
          ];
          
          bandSeries.setData(bandData);
        });
        
        // Add ETF Flow data
        const etfData = generateETFFlowData(data);
        etfSeries.setData(etfData);
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
        const newWidth = chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
      binanceService.disconnect();
      chart.remove();
    };
  }, []);

  // Update indicator lines when enabled/disabled
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;
    
    // Remove old indicator lines
    priceLinesRef.current.forEach(line => {
      try {
        candleSeriesRef.current?.removePriceLine(line);
      } catch (e) {
        // Line may already be removed
      }
    });
    priceLinesRef.current = [];

    // Add new indicator lines (dotted horizontal lines with labels)
    const lines = getIndicatorLines();
    lines.forEach(line => {
      try {
        const priceLine = candleSeriesRef.current?.createPriceLine({
          price: line.price,
          color: line.color,
          lineWidth: 2,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: line.label,
        });
        
        if (priceLine) {
          priceLinesRef.current.push(priceLine);
        }
      } catch (e) {
        console.error('Error creating price line:', e);
      }
    });
  }, [enabledIndicators]);

  // Toggle ETF visibility
  useEffect(() => {
    if (etfSeriesRef.current) {
      etfSeriesRef.current.applyOptions({
        visible: showETF,
      });
    }
  }, [showETF]);

  return (
    <div className="relative h-full w-full bg-occy-dark">
      {/* Fear & Greed Gauge - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <FearGreedGauge />
      </div>

      {/* Current Price Display - Top Right */}
      <div className="absolute top-4 right-4 z-20 bg-occy-dark/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-occy-blue/30 shadow-lg">
        <div className="text-occy-blue text-xs font-medium uppercase tracking-wider">BTC/USDT</div>
        <div className="text-white text-2xl font-mono font-bold mt-1">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* ETF Flow Toggle - Top Right, below price */}
      <div className="absolute top-24 right-4 z-20">
        <button
          onClick={() => setShowETF(!showETF)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showETF
              ? 'bg-occy-green/20 text-occy-green border border-occy-green/50'
              : 'bg-gray-800/50 text-gray-400 border border-gray-600/50'
          }`}
        >
          {showETF ? '✓' : ''} ETF Flow
        </button>
      </div>

      {/* Legend - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 bg-occy-dark/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-occy-blue/30 max-w-xs">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-green-900/40 to-green-500/40 rounded"></div>
            <span className="text-gray-300">Support Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-white/10 rounded"></div>
            <span className="text-gray-300">Neutral Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded"></div>
            <span className="text-gray-300">Resistance Zones</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-gray-700 mt-1">
            <div className="w-8 h-2 bg-occy-green/30 rounded"></div>
            <span className="text-gray-300">ETF Inflow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-red-500/30 rounded"></div>
            <span className="text-gray-300">ETF Outflow</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full h-[600px]" />
    </div>
  );
}
