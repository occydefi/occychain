# 🚀 Oki Onchain - Quick Start

## ✅ Status: READY TO DEPLOY!

Your Bitcoin on-chain dashboard is built and ready to go live.

## 📦 What's Included

### Working Features:
- ✅ Real-time BTC price chart (Binance WebSocket)
- ✅ Fear & Greed Index gauge (live data)
- ✅ Interactive control panel with 15+ indicators
- ✅ RSI Weekly + Monthly Histogram panels
- ✅ Educational legends (click indicators to learn)
- ✅ Dark theme with glassmorphism UI
- ✅ Fully responsive

### Data Sources:
- ✅ Binance API - Real-time price (FREE, no auth needed)
- ✅ Alternative.me - Fear & Greed (FREE, public API)
- 📝 On-chain metrics - Mock data (ready for real scrapers)
- 📝 ETF Flow - Mock data (ready for Farside scraping)
- 📝 Liquidation Heatmap - Mock data (ready for Coinglass)

## 🎯 Next Steps (5 minutes)

### 1. Create GitHub Repository
```bash
# Go to: https://github.com/new
# Name: occychain
# Public
# Don't initialize with README
# Create!

# Then push your code:
cd /root/clawd/occychain
git remote add origin https://github.com/YOUR_USERNAME/occychain.git
git push -u origin main
```

### 2. Deploy to Vercel (2 clicks)

**Option A: Simple (Frontend Only)**
1. Go to https://vercel.com/new
2. Import your `occychain` repository
3. Settings:
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**
5. Done! Get your URL: `https://occychain.vercel.app`

**Option B: Full Stack (Frontend + Backend)**
1. Deploy frontend as above
2. Create ANOTHER Vercel project for backend:
   - Same repo
   - Root Directory: `backend`
   - Leave build settings empty
3. Add env var to frontend:
   - `VITE_API_URL` = your backend URL
4. Redeploy frontend

**For MVP, Option A is fine!** The app works great with:
- Direct Binance connection from browser
- Fear & Greed public API
- Mock on-chain data

You can add backend later when you implement real scrapers.

## 🧪 Test Locally First

```bash
# Terminal 1 - Backend (optional)
cd /root/clawd/occychain/backend
npm start

# Terminal 2 - Frontend
cd /root/clawd/occychain/frontend
npm run dev

# Open: http://localhost:3000
```

## 📸 Share Your Launch

Once deployed, share:
1. 🔗 GitHub repo link
2. 🌐 Live site URL
3. 📸 Screenshot of the dashboard

## 🐛 Troubleshooting

**Chart not loading?**
- Check browser console
- Make sure WebSocket isn't blocked

**Build fails on Vercel?**
- Ensure Node.js 18+ in project settings
- Check build logs for specific errors

**Styling looks weird?**
- Clear cache and hard refresh (Ctrl+Shift+R)

## 🎨 Customization Ideas

- Change color scheme in `tailwind.config.js`
- Add more indicators in `utils/indicators.ts`
- Customize zones in `utils/zones.ts`
- Update logo in `App.tsx` (currently 🧌)

## 📚 Documentation

- Full README: `README.md`
- Deploy guide: `DEPLOY.md`
- Tech stack details in README

## 🎉 You're Ready!

Everything is built, tested, and ready to deploy. The dashboard looks professional and works great. Just push to GitHub and deploy to Vercel!

Questions? Check the README or deploy guide.

**GO LIVE! 🧌🚀**
