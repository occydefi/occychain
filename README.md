# 🧌 OccyOnChain

**Bitcoin On-Chain Intelligence Dashboard**

Professional-grade Bitcoin on-chain analytics dashboard with real-time data, technical indicators, and clean UI design.

## ✨ Features

### Core Functionality
- **Real-time BTC Price**: Live candles via Binance WebSocket
- **Zone System**: 7-color gradient zones (buy/neutral/sell) based on indicator confluence
- **Fear & Greed Index**: Real-time market sentiment gauge
- **On-Chain Indicators**: STH Realized Price, MVRV, Realized Price, CVDD
- **Technical Indicators**: Fibonacci, Support/Resistance, Liquidation Heatmap
- **Moving Averages**: MA 21/50/100/200, EMA 20/50
- **RSI Panels**: Weekly RSI + Monthly RSI Histogram
- **Educational Legends**: Simple explanations for each indicator

### Design
- **Dark Theme**: Professional #0A0E27 background
- **Neon Accents**: Green (#00FF88) for buy, Red (#FF4444) for sell, Blue (#00D9FF) for highlights
- **Glassmorphism**: Subtle transparent panels with backdrop blur
- **Responsive**: Works on desktop and tablet

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/occychain.git
cd occychain

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development

```bash
# Terminal 1 - Start backend (port 3001)
cd backend
npm run dev

# Terminal 2 - Start frontend (port 3000)
cd frontend
npm run dev
```

Open http://localhost:3000

## 📦 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** - Fast build tool
- **TradingView Lightweight Charts** - Professional charting
- **Tailwind CSS** - Utility-first styling
- **Binance WebSocket API** - Real-time price data

### Backend
- **Node.js** + Express
- **Axios** + Cheerio - Web scraping
- **node-cache** - In-memory caching

### Data Sources (Free)
- **Binance API**: Real-time BTC price
- **Alternative.me**: Fear & Greed Index
- **Bitcoin Magazine Pro**: On-chain metrics (scraping)
- **Coinglass**: Liquidation heatmap (scraping)
- **Farside Investors**: ETF flow data (scraping)

## 🎨 Design Philosophy

**Vibe**: Minimalista profissional com personalidade

- Clean, professional interface
- Data-first approach
- No clutter, just insights
- Educational without being condescending

## 📊 Indicator Guide

### On-Chain Metrics

**STH Realized Price** - Average price short-term holders paid. Key support/resistance.

**MVRV Ratio** - Market Value / Realized Value. >3.5 = historical tops, <1 = bottoms.

**Realized Price** - Average price of all BTC based on last movement. Strong historical support.

**CVDD** - Cumulative Value-Days Destroyed. Historically indicates market bottoms.

### Technical Indicators

**Fibonacci** - Retracement and extension levels from recent tops/bottoms.

**Support/Resistance** - Historical price levels where BTC found support or resistance.

**Liquidation Heatmap** - Concentration of liquidation orders. Price tends to hunt these zones.

### Moving Averages

- **MA 21**: Very short-term trend
- **MA 50**: Short-term trend
- **MA 100**: Medium-term trend
- **MA 200**: Long-term trend (highly respected)
- **EMA 20/50**: Faster reaction to price changes, golden/death cross signals

## 🔄 Update Frequencies

- **Price**: Real-time (WebSocket)
- **On-chain**: 1-6 hours
- **ETF Flow**: Daily
- **Liquidation Heatmap**: 30 minutes
- **Fear & Greed**: 6 hours

## 🚧 Roadmap

### MVP (Current)
- [x] Real-time BTC chart
- [x] Basic zone system (mock)
- [x] Control panel with toggles
- [x] Fear & Greed gauge
- [x] RSI panels
- [x] Educational legends

### Phase 2
- [ ] Real web scraping for on-chain data
- [ ] Advanced zone calculation with indicator confluence
- [ ] ETF flow visualization on chart
- [ ] Alert system (divergences, crosses)
- [ ] Historical zone backtesting

### Phase 3
- [ ] User accounts and saved configurations
- [ ] Mobile app (React Native)
- [ ] Email/Telegram alerts
- [ ] Multi-timeframe analysis
- [ ] Portfolio tracking integration

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

## ⚠️ Disclaimer

**This is NOT financial advice.** OccyOnChain is an educational tool for learning about Bitcoin on-chain analytics. Always do your own research (DYOR) before making any investment decisions.

## 📝 License

MIT

---

Built with 🧌 by the OccyOnChain team
