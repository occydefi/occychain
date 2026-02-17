export default function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800/40 rounded-lg p-3 h-24">
            <div className="h-3 bg-gray-700/50 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-700/50 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-700/50 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-gray-800/40 rounded-lg h-[600px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-green-400"></div>
          <div className="text-gray-400">Loading market data...</div>
          <div className="text-xs text-gray-600">Fetching indicators from Binance</div>
        </div>
      </div>

      {/* Insights skeleton */}
      <div className="bg-gray-800/40 rounded-lg p-4 h-48">
        <div className="h-4 bg-gray-700/50 rounded w-32 mb-3"></div>
        <div className="h-6 bg-gray-700/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
      </div>
    </div>
  );
}
