# ⚡ LEIA ISSO PRIMEIRO - DEPLOY EM 3 MINUTOS

## 🎯 SITUAÇÃO

✅ Backend **FUNCIONA LOCAL** (confirmado)  
✅ Frontend **ONLINE** em occychain.vercel.app  
❌ Backend **PRODUÇÃO** não funciona (Vercel Serverless bloqueado por config do Dashboard)

## 🚀 SOLUÇÃO PRONTA

**Arquivo:** `SOLUCAO_FINAL.md`

### O que fazer:

1. **Abra SOLUCAO_FINAL.md** (nessa pasta)
2. **Siga os 3 passos** (3 minutos total)
3. **Pronto!** Backend vai rodar no Render.com (grátis)

### Resumo ultra-rápido:

```
1. render.com → Login GitHub → New Web Service
2. Conectar occydefi/occychain
3. Config: Root Directory = (vazio), Build = "cd backend && npm install", Start = "cd backend && node server.js"
4. Deploy (aguarda 2min)
5. Copiar URL gerada
6. Vercel Dashboard → Settings → Environment Variables
7. Add: VITE_API_URL = URL_DO_RENDER
8. Redeploy frontend
```

**DONE!** 🎉

---

## 📁 Arquivos de Ajuda

- **SOLUCAO_FINAL.md** - Passo a passo detalhado (PRINCIPAL)
- **DEPLOY_MANUAL.md** - Alternativas e troubleshooting
- **render.yaml** - Config pronta (Render detecta automaticamente)

---

## 🧪 TESTAR BACKEND LOCAL ANTES

Se quiser confirmar que backend funciona:

```bash
cd backend
npm install
node server.js

# Em outro terminal:
curl http://localhost:3001/api/indicators
```

Deve retornar JSON com RSI, MAs, Fibonacci, etc!

---

**Tempo total:** 3-5 minutos  
**Custo:** R$ 0,00  
**Complexidade:** Fácil (só precisa de 2 logins)

**VAI! 🚀**
