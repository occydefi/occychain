import { useState } from 'react';
import { indicators as allIndicators } from '../utils/indicators';
import { Indicator } from '../types';

interface ControlPanelProps {
  onIndicatorToggle: (indicatorId: string, enabled: boolean) => void;
  enabledIndicators: string[];
  onIndicatorSelect: (indicator: Indicator | null) => void;
}

export default function ControlPanel({ 
  onIndicatorToggle, 
  enabledIndicators,
  onIndicatorSelect 
}: ControlPanelProps) {
  const [hoveredIndicator, setHoveredIndicator] = useState<string | null>(null);

  const onChainIndicators = allIndicators.filter(i => i.category === 'onchain');
  const technicalIndicators = allIndicators.filter(i => i.category === 'technical');
  const maIndicators = allIndicators.filter(i => i.category === 'ma');

  const handleToggle = (indicator: Indicator) => {
    const isEnabled = enabledIndicators.includes(indicator.id);
    onIndicatorToggle(indicator.id, !isEnabled);
    if (!isEnabled) {
      onIndicatorSelect(indicator);
    }
  };

  // BOM SENSO: Show active count
  const activeCount = enabledIndicators.length;
  const isTooMany = activeCount > 5;

  return (
    <div className="h-full flex flex-col">
      {/* Header with counter */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-occy-blue font-semibold text-lg">Indicators</h2>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            isTooMany ? 'bg-orange-500/20 text-orange-400' : 
            activeCount > 0 ? 'bg-green-500/20 text-green-400' : 
            'bg-gray-700/50 text-gray-500'
          }`}>
            {activeCount} active
          </div>
        </div>
        
        {/* BOM SENSO: Helpful tip */}
        {isTooMany && (
          <div className="text-xs text-orange-400 bg-orange-900/20 rounded p-2 mt-2">
            💡 Consider using fewer indicators for clearer analysis
          </div>
        )}
        
        {activeCount === 0 && (
          <div className="text-xs text-gray-500 mt-2">
            Activate indicators to see them on the chart
          </div>
        )}
      </div>

      {/* Scrollable indicators */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <IndicatorSection
          title="Moving Averages"
          subtitle="Trend indicators"
          indicators={maIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
          hoveredIndicator={hoveredIndicator}
          setHoveredIndicator={setHoveredIndicator}
        />

        <IndicatorSection
          title="Technical"
          subtitle="Support, resistance, fibonacci"
          indicators={technicalIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
          hoveredIndicator={hoveredIndicator}
          setHoveredIndicator={setHoveredIndicator}
        />

        <IndicatorSection
          title="On-Chain"
          subtitle="Coming soon..."
          indicators={onChainIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
          hoveredIndicator={hoveredIndicator}
          setHoveredIndicator={setHoveredIndicator}
          disabled={true}
        />
      </div>

      {/* Footer tip */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-400">💡 Pro Tip:</p>
          <p>Hover over indicators for explanations</p>
          <p>Start with MA200 + RSI for basic analysis</p>
        </div>
      </div>
    </div>
  );
}

function IndicatorSection({ 
  title, 
  subtitle,
  indicators, 
  enabledIndicators, 
  onToggle,
  hoveredIndicator,
  setHoveredIndicator,
  disabled = false
}: { 
  title: string;
  subtitle: string;
  indicators: Indicator[];
  enabledIndicators: string[];
  onToggle: (indicator: Indicator) => void;
  hoveredIndicator: string | null;
  setHoveredIndicator: (id: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      <div className="mb-3">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-gray-600 text-xs mt-0.5">{subtitle}</p>
      </div>
      
      <div className="space-y-2">
        {indicators.map(indicator => {
          const isEnabled = enabledIndicators.includes(indicator.id);
          const isHovered = hoveredIndicator === indicator.id;
          
          return (
            <div key={indicator.id} className="relative">
              <button
                onClick={() => onToggle(indicator)}
                onMouseEnter={() => setHoveredIndicator(indicator.id)}
                onMouseLeave={() => setHoveredIndicator(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  isEnabled
                    ? 'bg-occy-blue/20 border border-occy-blue/50'
                    : 'bg-white/5 border border-transparent hover:border-gray-600 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isEnabled ? 'text-occy-blue font-medium' : 'text-gray-300'}`}>
                    {indicator.name}
                  </span>
                  
                  {/* Info icon */}
                  <span className="text-gray-600 text-xs">ℹ️</span>
                </div>
                
                {/* Toggle switch */}
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    isEnabled ? 'bg-occy-green' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Tooltip on hover - BOM SENSO! */}
              {isHovered && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
