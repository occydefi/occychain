# 🚀 OCCYCHAIN - QUICK START

## ✅ STATUS: PRONTO PARA USAR (LOCAL) | DEPLOY PENDENTE

---

## 🏃 TESTAR AGORA (Local)

```bash
# Terminal 1 - Backend
cd /root/clawd/occychain/backend
npm start

# Terminal 2 - Frontend
cd /root/clawd/occychain/frontend
npm run dev

# Abrir navegador
open http://localhost:3000
```

**Ativar qualquer indicador no painel direito → valores REAIS!**

---

## 🚂 DEPLOY PRODUÇÃO (5 minutos)

### Opção 1: Railway (Recomendado)

```bash
# 1. Instalar
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd /root/clawd/occychain/backend
railway init
railway up

# 4. Pegar URL
railway domain
# Copiar a URL

# 5. Configurar no Vercel
# Ir em vercel.com/occychain
# Settings > Environment Variables
# Add: VITE_API_URL = https://[sua-url-railway].app

# 6. Redeploy frontend
git commit --allow-empty -m "Config backend URL"
git push
```

### Opção 2: Render

1. Ir em render.com
2. New > Web Service
3. Conectar repo: occydefi/occychain
4. Root Directory: `backend`
5. Build: `npm install`
6. Start: `node server.js`
7. Deploy!
8. Copiar URL e adicionar no Vercel (passo 5 acima)

---

## 📊 DADOS DISPONÍVEIS

**Todos calculados em tempo real:**
- Preço BTC atual (Binance)
- MA 21, 50, 100, 200
- EMA 20, 50
- RSI 14, 30
- Fibonacci (0.236, 0.382, 0.5, 0.618, 0.786)
- Suporte e Resistência (auto-detectados)

**ZERO mock data. 100% real.**

---

## 🧪 TESTAR API

```bash
# Local
curl http://localhost:3001/api/indicators

# Produção (depois do deploy)
curl https://[sua-url]/api/indicators
```

---

## 📝 DOCS COMPLETOS

- `REAL_DATA_IMPLEMENTATION.md` - Detalhes técnicos
- `DEPLOYMENT_OPTIONS.md` - Comparação de opções
- `FINAL_DELIVERY_REPORT.md` - Relatório completo

---

**Pronto para usar! 🎯**
