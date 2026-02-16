import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function FearGreedGauge() {
  const [value, setValue] = useState<number>(50);

  useEffect(() => {
    api.getFearGreed().then(setValue);
    
    // Update every 6 hours
    const interval = setInterval(() => {
      api.getFearGreed().then(setValue);
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (value <= 25) return '#FF4444'; // Extreme Fear
    if (value <= 45) return '#FF8844'; // Fear
    if (value <= 55) return '#FFBB66'; // Neutral
    if (value <= 75) return '#00DD77'; // Greed
    return '#00FF88'; // Extreme Greed
  };

  const getLabel = () => {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 bg-occy-dark/80 backdrop-blur-sm border border-occy-blue/30 rounded-lg p-4 w-48">
      <div className="text-center">
        <div className="text-gray-400 text-xs font-medium mb-2">Fear & Greed Index</div>
        <div className="relative w-32 h-16 mx-auto mb-2">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 5 45 A 40 40 0 0 1 95 45"
              fill="none"
              stroke="#1A1E37"
              strokeWidth="8"
            />
            {/* Colored arc */}
            <path
              d="M 5 45 A 40 40 0 0 1 95 45"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeDasharray={`${(value / 100) * 126} 126`}
            />
            {/* Needle */}
            <line
              x1="50"
              y1="45"
              x2="50"
              y2="10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${rotation} 50 45)`}
            />
            <circle cx="50" cy="45" r="3" fill="#fff" />
          </svg>
        </div>
        <div className="text-2xl font-mono font-bold" style={{ color: getColor() }}>
          {value}
        </div>
        <div className="text-xs" style={{ color: getColor() }}>
          {getLabel()}
        </div>
      </div>
    </div>
  );
}
