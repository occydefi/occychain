import { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';

export default function RSIPanels() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <RSIPanel title="RSI Weekly" timeframe="1w" />
      <RSIPanel title="RSI Monthly Histogram" timeframe="1M" histogram />
    </div>
  );
}

function RSIPanel({ 
  title, 
  histogram = false 
}: { 
  title: string;
  timeframe?: string;
  histogram?: boolean;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

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
      height: 200,
      timeScale: {
        visible: true,
      },
    });

    // Mock RSI data for MVP
    const rsiData = generateMockRSI(50, histogram);

    if (histogram) {
      const histogramSeries = chart.addHistogramSeries({
        color: '#FF4444',
        priceFormat: {
          type: 'volume',
        },
      });
      histogramSeries.setData(rsiData);
    } else {
      const lineSeries = chart.addLineSeries({
        color: '#00D9FF',
        lineWidth: 2,
      });
      lineSeries.setData(rsiData);

      // Add overbought/oversold lines
      const oversoldLine = chart.addLineSeries({
        color: '#00FF88',
        lineWidth: 1,
        lineStyle: 2, // dashed
      });
      oversoldLine.setData(rsiData.map(d => ({ time: d.time, value: 30 })));

      const overboughtLine = chart.addLineSeries({
        color: '#FF4444',
        lineWidth: 1,
        lineStyle: 2, // dashed
      });
      overboughtLine.setData(rsiData.map(d => ({ time: d.time, value: 70 })));
    }

    chartRef.current = chart;

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
      chart.remove();
    };
  }, [histogram]);

  return (
    <div className="bg-occy-dark/80 backdrop-blur-sm border border-occy-blue/30 rounded-lg p-4">
      <h3 className="text-occy-blue text-sm font-semibold mb-2">{title}</h3>
      <div ref={chartContainerRef} />
    </div>
  );
}

function generateMockRSI(count: number, histogram: boolean): any[] {
  const data: any[] = [];
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 86400;

  for (let i = count; i >= 0; i--) {
    const time = now - (i * daySeconds);
    const value = histogram
      ? 30 + Math.random() * 40 // RSI between 30-70 for histogram
      : 40 + Math.random() * 20 + Math.sin(i / 5) * 10; // Oscillating RSI

    data.push({
      time: time as any,
      value: value,
      ...(histogram && { color: value > 50 ? '#FF4444' : '#00FF88' })
    });
  }

  return data;
}
