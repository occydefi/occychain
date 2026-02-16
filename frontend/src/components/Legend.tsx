import { Indicator } from '../types';

interface LegendProps {
  indicator: Indicator | null;
}

export default function Legend({ indicator }: LegendProps) {
  if (!indicator) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-2xl">
      <div className="bg-occy-dark/95 backdrop-blur-sm border border-occy-blue/50 rounded-lg p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-occy-blue/20 flex items-center justify-center">
              <span className="text-occy-blue text-xl">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-occy-blue font-semibold mb-1">{indicator.name}</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {indicator.description}
            </p>
          </div>
          <button
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            onClick={() => {}}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
