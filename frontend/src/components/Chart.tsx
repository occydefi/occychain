import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';
import { binanceService } from '../services/binance';
import { CandleData } from '../types';
import FearGreedGauge from './FearGreedGauge';

interface ChartProps {
  enabledIndicators: string[];
}

interface PriceBand {
  from: number;
  to: number;
  color: string;
  label: string;
}

interface IndicatorLine {
  price: number;
  label: string;
  color: string;
}

export default function Chart({ enabledIndicators }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Mock data for indicators (replace with real API data later)
  const indicatorPrices = {
    'sth-realized': 48200,
    'mvrv': 47800,
    'realized-price': 45000,
    'cvdd': 42000,
  };

  // Calculate price bands based on indicator confluence
  const getPriceBands = (): PriceBand[] => {
    const bands: PriceBand[] = [];
    const currentPrice = 50000; // This should come from real price data

    // Sell zones (above current price)
    bands.push({
      from: currentPrice * 1.15,
      to: currentPrice * 1.20,
      color: 'rgba(255, 68, 68, 0.15)', // Red
      label: 'Strong Resistance'
    });
    bands.push({
      from: currentPrice * 1.10,
      to: currentPrice * 1.15,
      color: 'rgba(255, 136, 68, 0.15)', // Dark Orange
      label: 'Resistance'
    });
    bands.push({
      from: currentPrice * 1.05,
      to: currentPrice * 1.10,
      color: 'rgba(255, 187, 102, 0.15)', // Light Orange
      label: 'Weak Resistance'
    });

    // Neutral zone
    bands.push({
      from: currentPrice * 0.98,
      to: currentPrice * 1.02,
      color: 'rgba(255, 255, 255, 0.05)', // White/Neutral
      label: 'Neutral Zone'
    });

    // Buy zones (below current price)
    bands.push({
      from: currentPrice * 0.95,
      to: currentPrice * 0.98,
      color: 'rgba(0, 255, 136, 0.15)', // Light Green
      label: 'Weak Support'
    });
    bands.push({
      from: currentPrice * 0.90,
      to: currentPrice * 0.95,
      color: 'rgba(0, 221, 119, 0.20)', // Medium Green
      label: 'Support'
    });
    bands.push({
      from: currentPrice * 0.85,
      to: currentPrice * 0.90,
      color: 'rgba(0, 170, 102, 0.25)', // Dark Green
      label: 'Strong Support'
    });

    return bands;
  };

  // Get indicator lines based on enabled indicators
  const getIndicatorLines = (): IndicatorLine[] => {
    const lines: IndicatorLine[] = [];

    if (enabledIndicators.includes('sth-realized')) {
      lines.push({
        price: indicatorPrices['sth-realized'],
        label: `STH Realized: $${indicatorPrices['sth-realized'].toLocaleString()}`,
        color: '#00FF88'
      });
    }

    if (enabledIndicators.includes('mvrv')) {
      lines.push({
        price: indicatorPrices['mvrv'],
        label: `MVRV: $${indicatorPrices['mvrv'].toLocaleString()}`,
        color: '#00DDFF'
      });
    }

    if (enabledIndicators.includes('realized-price')) {
      lines.push({
        price: indicatorPrices['realized-price'],
        label: `Realized Price: $${indicatorPrices['realized-price'].toLocaleString()}`,
        color: '#FFBB66'
      });
    }

    if (enabledIndicators.includes('cvdd')) {
      lines.push({
        price: indicatorPrices['cvdd'],
        label: `CVDD: $${indicatorPrices['cvdd'].toLocaleString()}`,
        color: '#FF88DD'
      });
    }

    return lines;
  };

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
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
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
        
        // Add price bands
        const bands = getPriceBands();
        bands.forEach(band => {
          const bandSeries = chart.addLineSeries({
            color: 'transparent',
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
          });
          
          // Create filled area for the band
          const areaData = data.map(candle => ({
            time: candle.time,
            value: (band.from + band.to) / 2,
          }));
          bandSeries.setData(areaData);
        });
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

  // Update indicator lines when enabled/disabled
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Remove old indicator lines (we'll recreate them)
    // For now, just log them
    const lines = getIndicatorLines();
    console.log('Indicator lines to draw:', lines);

    // Add horizontal lines for each indicator
    lines.forEach(line => {
      const priceLine = {
        price: line.price,
        color: line.color,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: line.label,
      };
      
      // Add to candlestick series
      candleSeriesRef.current?.createPriceLine(priceLine);
    });
  }, [enabledIndicators]);

  const bands = getPriceBands();
  const indicatorLines = getIndicatorLines();

  return (
    <div className="relative h-full w-full">
      {/* Fear & Greed Gauge - Top Left Corner of Chart */}
      <div className="absolute top-4 left-4 z-20">
        <FearGreedGauge />
      </div>

      {/* Current Price Display */}
      <div className="absolute top-4 right-4 z-10 bg-occy-dark/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-occy-blue/30">
        <div className="text-occy-blue text-sm font-medium">BTC/USDT</div>
        <div className="text-white text-2xl font-mono font-bold">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Price Bands Overlay */}
      <svg className="absolute inset-0 pointer-events-none z-5" style={{ width: '100%', height: '600px' }}>
        {bands.map((band, index) => {
          // Calculate Y position based on price (simplified, needs proper scale calculation)
          const chartHeight = 600;
          const priceRange = currentPrice * 0.4; // ±20% from current price
          const minPrice = currentPrice * 0.8;
          
          const getY = (price: number) => {
            const ratio = (price - minPrice) / priceRange;
            return chartHeight - (ratio * chartHeight * 0.8) - chartHeight * 0.1;
          };

          const y1 = getY(band.from);
          const y2 = getY(band.to);
          const height = Math.abs(y2 - y1);

          return (
            <g key={index}>
              <rect
                x="0"
                y={Math.min(y1, y2)}
                width="100%"
                height={height}
                fill={band.color}
              />
              <text
                x="98%"
                y={Math.min(y1, y2) + height / 2}
                textAnchor="end"
                fill="#888"
                fontSize="11"
                fontFamily="monospace"
              >
                {band.label}
              </text>
            </g>
          );
        })}

        {/* Indicator Lines */}
        {indicatorLines.map((line, index) => {
          const chartHeight = 600;
          const priceRange = currentPrice * 0.4;
          const minPrice = currentPrice * 0.8;
          const y = chartHeight - ((line.price - minPrice) / priceRange * chartHeight * 0.8) - chartHeight * 0.1;

          return (
            <g key={`line-${index}`}>
              <line
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke={line.color}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x="98%"
                y={y - 5}
                textAnchor="end"
                fill={line.color}
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {line.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full relative z-0" />
    </div>
  );
}
