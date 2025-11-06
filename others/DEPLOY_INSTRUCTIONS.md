# 🚀 Deploy Instructions - Mini CRM

## Stack de Deploy:
- **Frontend**: Netlify (grátis)
- **Backend**: Render (grátis, com cold start)
- **Database**: Supabase (já configurado)

---

## 📋 Passo 1: Deploy do Backend no Render

### 1.1 Criar conta no Render
- Acesse: https://render.com
- Faça signup com GitHub

### 1.2 Criar Web Service
1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub do mini-crm
3. Configure:
   - **Name**: `mini-crm-backend`
   - **Region**: Oregon (US West) - mais rápido para BR
   - **Branch**: `main` (ou sua branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** ✅

### 1.3 Configurar Variáveis de Ambiente
Na seção "Environment":

```
NODE_ENV=production
PORT=3001
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_anon_key_do_supabase
SUPABASE_SERVICE_KEY=sua_service_key_do_supabase
CORS_ORIGIN=https://seu-site.netlify.app
```

**⚠️ IMPORTANTE**: Depois do deploy do frontend, volte aqui e atualize `CORS_ORIGIN` com a URL real do Netlify!

### 1.4 Deploy
- Clique em **"Create Web Service"**
- Aguarde ~5 minutos
- Anote a URL do backend: `https://mini-crm-backend.onrender.com`

---

## 📋 Passo 2: Deploy do Frontend no Netlify

### 2.1 Criar conta no Netlify
- Acesse: https://app.netlify.com
- Faça signup com GitHub

### 2.2 Deploy do Site
1. Clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **GitHub**
3. Selecione o repositório `mini-crm`
4. Configure:
   - **Branch**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 2.3 Configurar Variáveis de Ambiente
Em **Site settings** → **Environment variables**, adicione:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
VITE_API_URL=https://mini-crm-backend.onrender.com
```

**Use a URL do backend do Passo 1.4!**

### 2.4 Deploy
- Clique em **"Deploy site"**
- Aguarde ~2 minutos
- Seu site estará em: `https://random-name.netlify.app`

### 2.5 Customizar Domínio (Opcional)
- Em **Site settings** → **Domain management**
- Clique em **"Change site name"**
- Escolha: `mini-crm-seu-nome.netlify.app`

---

## 📋 Passo 3: Atualizar CORS do Backend

**IMPORTANTE**: Depois de ter a URL do Netlify:

1. Volte no **Render** → Seu backend
2. Vá em **Environment**
3. Atualize `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://mini-crm-seu-nome.netlify.app
   ```
4. Clique em **"Save Changes"**
5. O backend vai fazer redeploy automático (~2 min)

---

## 🎯 Resumo dos Links

Depois de tudo configurado, você terá:

- **Frontend**: https://mini-crm-seu-nome.netlify.app
- **Backend**: https://mini-crm-backend.onrender.com
- **Database**: https://seu-projeto.supabase.co

---

## ⚠️ Limitações do Plano Grátis

### Render (Backend):
- ✅ Grátis para sempre
- ⚠️ **"Dorme" após 15 minutos de inatividade**
- ⏱️ Primeiro request após dormir: ~30-60 segundos para "acordar"
- ✅ Depois de acordado: normal

### Netlify (Frontend):
- ✅ Grátis para sempre
- ✅ 100GB bandwidth/mês
- ✅ Deploy automático a cada push
- ✅ Sem cold start

### Supabase:
- ✅ Grátis para sempre
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth

---

## 🔄 Deploys Automáticos

Depois da configuração inicial:

1. **Faça commit das mudanças**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Deploy automático**:
   - Netlify: redeploy automático (~2 min)
   - Render: redeploy automático (~5 min)

---

## 🐛 Troubleshooting

### Frontend não conecta com backend:
1. Verifique `VITE_API_URL` no Netlify
2. Verifique `CORS_ORIGIN` no Render
3. Certifique-se de que o backend está acordado (faça uma request)

### Backend retorna 502:
- O backend está "dormindo", aguarde 30-60s e tente novamente

### Erro de CORS:
- Atualize `CORS_ORIGIN` no Render com a URL exata do Netlify
- Inclua `https://` e remova trailing `/`

### Build falha no Netlify:
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique logs do build

---

## 💰 Custo Total

**R$ 0,00/mês** 🎉

Tudo 100% grátis!

---

## 📚 Links Úteis

- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
