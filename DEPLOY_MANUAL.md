# 🚀 Deploy Manual Backend - 5 Minutos

Se o Vercel Serverless não funcionar, use Render.com (100% grátis, 512MB RAM):

## Opção 1: Render.com (Recomendado)

### Passo 1: Criar Web Service
1. Acesse https://render.com
2. Login com GitHub
3. Clique em **"New +"** → **"Web Service"**
4. Conecte o repositório **occydefi/occychain**

### Passo 2: Configurar
```
Name: occyonchain-backend
Region: Frankfurt (ou mais próximo)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### Passo 3: Deploy
- Clique em **"Create Web Service"**
- Aguarde 2-3 minutos
- Copie a URL gerada (ex: `https://occyonchain-backend.onrender.com`)

### Passo 4: Configurar Frontend
1. Acesse https://vercel.com/occydefi/occychain
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - Key: `VITE_API_URL`
   - Value: `https://occyonchain-backend.onrender.com`
4. Salve e faça **Redeploy**

### Testar
```bash
curl https://occyonchain-backend.onrender.com/api/indicators
```

Deve retornar JSON com indicadores reais!

---

## Opção 2: Railway.app (Alternativa)

### Mesmo processo:
1. https://railway.app
2. New Project → Deploy from GitHub
3. Selecione occydefi/occychain
4. Root Directory: `backend`
5. Start Command: `node server.js`
6. Deploy

URL: `https://occyonchain-backend.up.railway.app`

---

## Opção 3: Fly.io (Avançado)

Se tiver Fly.io CLI token:
```bash
cd backend
fly launch --name occyonchain-backend
fly deploy
```

---

## ⚡ Quick Test Local

Verificar se backend funciona local:
```bash
cd backend
npm install
node server.js
# Em outro terminal:
curl http://localhost:3001/api/indicators
```

Deve retornar dados reais da Binance!
