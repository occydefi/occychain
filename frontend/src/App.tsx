import { useState } from 'react';
import Chart from './components/Chart';
import ControlPanel from './components/ControlPanel';
import RSIPanels from './components/RSIPanels';
import Legend from './components/Legend';
import { Indicator } from './types';

function App() {
  const [enabledIndicators, setEnabledIndicators] = useState<string[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  const handleIndicatorToggle = (indicatorId: string, enabled: boolean) => {
    if (enabled) {
      setEnabledIndicators(prev => [...prev, indicatorId]);
    } else {
      setEnabledIndicators(prev => prev.filter(id => id !== indicatorId));
      if (selectedIndicator?.id === indicatorId) {
        setSelectedIndicator(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-occy-dark text-white">
      {/* Header */}
      <header className="border-b border-occy-blue/30 bg-occy-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🧌</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-occy-green to-occy-blue bg-clip-text text-transparent">
                  OccyChain
                </h1>
                <p className="text-xs text-gray-400">Bitcoin On-Chain Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yourusername/occychain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-occy-blue transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-12rem)]">
        {/* Control Panel - Left Side (20%) */}
        <div className="w-80 flex-shrink-0 border-r border-occy-blue/30 overflow-y-auto">
          <ControlPanel
            enabledIndicators={enabledIndicators}
            onIndicatorToggle={handleIndicatorToggle}
            onIndicatorSelect={setSelectedIndicator}
          />
        </div>

        {/* Main Chart Area - Center (fills remaining space) */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <Chart enabledIndicators={enabledIndicators} />
          </div>

          <RSIPanels />

          <Legend indicator={selectedIndicator} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-occy-blue/30 bg-occy-dark/80 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with 🧌 by OccyChain • Data: Binance, Alternative.me</p>
            <p className="text-xs mt-1">Not financial advice. DYOR.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
