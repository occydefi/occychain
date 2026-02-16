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

  return (
    <div className="h-full p-4">
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-occy-blue font-semibold text-lg">Indicators</h2>
        </div>

        <IndicatorSection
          title="On-Chain"
          indicators={onChainIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
        />

        <IndicatorSection
          title="Technical"
          indicators={technicalIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
        />

        <IndicatorSection
          title="Moving Averages"
          indicators={maIndicators}
          enabledIndicators={enabledIndicators}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}

function IndicatorSection({ 
  title, 
  indicators, 
  enabledIndicators, 
  onToggle 
}: { 
  title: string;
  indicators: Indicator[];
  enabledIndicators: string[];
  onToggle: (indicator: Indicator) => void;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {indicators.map(indicator => {
          const isEnabled = enabledIndicators.includes(indicator.id);
          return (
            <button
              key={indicator.id}
              onClick={() => onToggle(indicator)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                isEnabled
                  ? 'bg-occy-blue/20 border border-occy-blue/50'
                  : 'bg-white/5 border border-transparent hover:border-gray-600'
              }`}
            >
              <span className={`text-sm ${isEnabled ? 'text-occy-blue font-medium' : 'text-gray-300'}`}>
                {indicator.name}
              </span>
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
          );
        })}
      </div>
    </div>
  );
}
