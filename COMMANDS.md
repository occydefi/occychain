# 🛠️ Useful Commands

## Local Development

### Start Everything
```bash
# Terminal 1 - Backend (http://localhost:3001)
cd /root/clawd/occychain/backend
npm start

# Terminal 2 - Frontend (http://localhost:3000)
cd /root/clawd/occychain/frontend
npm run dev
```

### Build for Production
```bash
cd /root/clawd/occychain/frontend
npm run build

# Test production build
npm run preview
```

## Git Commands

### Initial Setup
```bash
cd /root/clawd/occychain

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/occychain.git

# Push to GitHub
git push -u origin main
```

### Check Status
```bash
git status                 # See what's changed
git log --oneline -10      # Recent commits
git remote -v              # Check remote URL
```

### Make Changes
```bash
git add .                  # Stage all changes
git commit -m "Message"    # Commit
git push                   # Push to GitHub
```

## Vercel Commands

### Install Vercel CLI (optional)
```bash
npm install -g vercel

# Deploy from command line
cd /root/clawd/occychain/frontend
vercel
```

### Using Vercel Web UI (easier)
1. Go to https://vercel.com/new
2. Import Git repository
3. Follow prompts
4. Done!

## Troubleshooting

### Frontend won't start?
```bash
cd /root/clawd/occychain/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start?
```bash
cd /root/clawd/occychain/backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Build fails?
```bash
cd /root/clawd/occychain/frontend
npm run build 2>&1 | tee build.log
# Check build.log for errors
```

### Check WebSocket connection
```bash
# In browser console (F12):
# You should see WebSocket messages from Binance
```

## Testing

### Check if backend is running
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok","timestamp":...}
```

### Check API endpoints
```bash
curl http://localhost:3001/api/onchain
curl http://localhost:3001/api/etf-flow
curl http://localhost:3001/api/liquidation-heatmap
```

### Check frontend build size
```bash
cd /root/clawd/occychain/frontend
npm run build
du -sh dist/
```

## Update Dependencies

### Frontend
```bash
cd /root/clawd/occychain/frontend
npm update
npm audit fix
```

### Backend
```bash
cd /root/clawd/occychain/backend
npm update
npm audit fix
```

## Clean Up

### Remove node_modules (save space)
```bash
cd /root/clawd/occychain
rm -rf frontend/node_modules backend/node_modules
# Re-install when needed with: npm install
```

### Clear Vercel cache (if deploy issues)
In Vercel dashboard:
Settings → General → Clear cache

## Environment Variables

### Development (.env file)
```bash
cd /root/clawd/occychain/frontend
cp .env.example .env
# Edit .env with your values
```

### Production (Vercel dashboard)
Settings → Environment Variables → Add:
- `VITE_API_URL` = your backend URL

## Performance Check

### Check bundle size
```bash
cd /root/clawd/occychain/frontend
npm run build
ls -lh dist/assets/
```

### Test production build locally
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

## Logs

### View dev server logs
```bash
# Frontend logs in Terminal 2
# Backend logs in Terminal 1
```

### View production logs (Vercel)
Dashboard → Deployments → Click deployment → Logs

## Useful Scripts to Add

### Add to frontend/package.json:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext ts,tsx",
  "clean": "rm -rf dist node_modules"
}
```

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Test build | `npm run preview` |
| Push to Git | `git add . && git commit -m "msg" && git push` |
| Deploy | Push to GitHub → Vercel auto-deploys |
| Check health | `curl localhost:3001/api/health` |

## Getting Help

1. Check README.md for documentation
2. Check QUICKSTART.md for deployment
3. Check DEPLOY.md for detailed steps
4. GitHub Issues: Create an issue if stuck
5. Vercel Docs: https://vercel.com/docs

---

**Pro tip**: Save these commands in your terminal history for quick access!
