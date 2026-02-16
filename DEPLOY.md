# 🚀 Deployment Instructions

## GitHub Setup

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `occychain`
   - Visibility: Public
   - DON'T initialize with README (we already have one)
   - Click "Create repository"

2. **Push Code to GitHub**
   ```bash
   cd /root/clawd/occychain
   git remote add origin https://github.com/YOUR_USERNAME/occychain.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

### Frontend (Main App)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**
   - Select your `occychain` repository
3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables** (optional for now)
   - Can add `VITE_API_URL` later when backend is deployed
5. **Click Deploy**
6. **Get your URL**: `https://occychain.vercel.app` (or similar)

### Backend (API)

1. **Create New Vercel Project** for backend
2. **Import same repository**
3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Output Directory: `.`
4. **Click Deploy**
5. **Get backend URL**: `https://occychain-backend.vercel.app`

### Connect Frontend to Backend

1. **Update Frontend Environment**
   - Go to frontend project settings on Vercel
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-url.vercel.app`
   - Redeploy

## Alternative: Single Deployment

If you want to simplify:

1. Deploy only the **frontend** to Vercel
2. For now, the app will work with:
   - Real-time Binance data (direct from browser)
   - Fear & Greed API (CORS-friendly)
   - Mock data for on-chain indicators
3. Backend can be added later when you implement real scrapers

## Quick Test Locally

```bash
# Terminal 1 - Backend
cd /root/clawd/occychain/backend
npm start

# Terminal 2 - Frontend
cd /root/clawd/occychain/frontend
npm run dev
```

Open http://localhost:3000

## Troubleshooting

**CORS errors?**
- Make sure backend has CORS enabled (already configured in `server.js`)

**Chart not loading?**
- Check browser console for WebSocket errors
- Binance API might be rate-limited

**Vercel build fails?**
- Check Node.js version (needs 18+)
- Make sure all dependencies are in `package.json`

## What's Working Right Now

✅ Real-time BTC price (Binance WebSocket)
✅ Fear & Greed Index (Alternative.me API)
✅ Interactive chart with candles
✅ Control panel with toggles
✅ RSI panels
✅ Educational legends

📝 Mock data (will be replaced with real scrapers):
- On-chain metrics (STH, MVRV, Realized Price, CVDD)
- ETF Flow
- Liquidation Heatmap

---

**Once deployed, share:**
- 🔗 GitHub: https://github.com/YOUR_USERNAME/occychain
- 🌐 Live Site: https://occychain.vercel.app
- 📸 Screenshot of the dashboard

Good luck! 🧌
