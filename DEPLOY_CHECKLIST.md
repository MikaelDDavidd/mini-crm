# ✅ Deploy Checklist - Mini CRM

Use este checklist para garantir que tudo foi configurado corretamente.

---

## 📦 Antes de Começar

### Preparação Local
- [ ] Projeto commitado no GitHub
- [ ] `.env` adicionado ao `.gitignore`
- [ ] Build funciona localmente: `cd frontend && npm run build`
- [ ] Backend funciona localmente: `cd backend && npm start`

### Credenciais Supabase
Tenha em mãos:
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_KEY

---

## 🔧 Deploy Backend (Render)

### Setup Inicial
- [ ] Conta criada no Render
- [ ] Repositório conectado
- [ ] Web Service criado

### Configurações
- [ ] Name: `mini-crm-backend`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: **Free**

### Variáveis de Ambiente
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `SUPABASE_URL=...`
- [ ] `SUPABASE_ANON_KEY=...`
- [ ] `SUPABASE_SERVICE_KEY=...`
- [ ] `CORS_ORIGIN=http://localhost:5173` (temporário)

### Deploy
- [ ] Deploy iniciado
- [ ] Deploy concluído (aguarde ~5 min)
- [ ] URL anotada: `https://________.onrender.com`
- [ ] Teste: `https://________.onrender.com/health`

---

## 🌐 Deploy Frontend (Netlify)

### Setup Inicial
- [ ] Conta criada no Netlify
- [ ] Repositório conectado
- [ ] Site criado

### Configurações
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Variáveis de Ambiente
- [ ] `VITE_SUPABASE_URL=...`
- [ ] `VITE_SUPABASE_ANON_KEY=...`
- [ ] `VITE_API_URL=https://________.onrender.com` (URL do backend)

### Deploy
- [ ] Deploy iniciado
- [ ] Deploy concluído (aguarde ~2 min)
- [ ] URL anotada: `https://________.netlify.app`
- [ ] Site abre no navegador

---

## 🔄 Atualizar CORS (IMPORTANTE!)

Agora que você tem a URL do Netlify:

### No Render
- [ ] Ir para backend no Render
- [ ] Environment → Editar `CORS_ORIGIN`
- [ ] Alterar para: `https://________.netlify.app` (sua URL real)
- [ ] Salvar (vai fazer redeploy ~2 min)
- [ ] Aguardar redeploy

---

## ✅ Testes Finais

### Frontend
- [ ] Site abre: `https://________.netlify.app`
- [ ] Página de login carrega
- [ ] Consegue fazer signup
- [ ] Consegue fazer login

### Backend + Integração
- [ ] Após login, dashboard carrega
- [ ] Cards de estatísticas aparecem
- [ ] Consegue criar lead
- [ ] Consegue editar lead
- [ ] Consegue deletar lead
- [ ] Gráficos aparecem

### Supabase
- [ ] Dados aparecem no Supabase Dashboard
- [ ] Bucket `avatars` configurado (se necessário)
- [ ] Storage policies criadas (se necessário)

---

## 🐛 Se algo falhar...

### Frontend não abre
1. Verifique logs do build no Netlify
2. Confirme variáveis de ambiente
3. Tente rebuild: Deploy → Trigger deploy → Clear cache and deploy

### Backend retorna 502
- Normal na primeira request (cold start)
- Aguarde 30-60 segundos
- Tente novamente

### Erro de CORS
1. Confirme que `CORS_ORIGIN` no Render tem a URL exata do Netlify
2. URL deve incluir `https://`
3. URL NÃO deve ter `/` no final
4. Aguarde redeploy do backend (~2 min)

### Login não funciona
1. Verifique `VITE_SUPABASE_URL` no Netlify
2. Verifique `VITE_SUPABASE_ANON_KEY` no Netlify
3. Teste localmente com mesmas credenciais

---

## 🎉 Conclusão

Se todos os checkboxes estão marcados:

✅ **PARABÉNS!** Seu Mini CRM está no ar! 🚀

- Frontend: https://________.netlify.app
- Backend: https://________.onrender.com
- Database: Supabase

**Custo: R$ 0,00/mês** 💰

---

## 📝 Notas

- Backend Render "dorme" após 15min sem uso
- Primeira request pode levar 30-60s (cold start)
- Depois de acordado, funciona normalmente
- Deploy automático a cada push no GitHub
