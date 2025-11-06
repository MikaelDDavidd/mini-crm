# 🚀 Deploy Passo a Passo - Netlify + Render

Guia rápido e direto para fazer deploy do Mini CRM.

---

## 🔥 Parte 1: Deploy do Backend (Render)

### 1. Acesse o Render
- Entre em: https://dashboard.render.com
- Faça login com GitHub

### 2. Criar Web Service
1. Clique em **"New +"** (canto superior direito)
2. Escolha **"Web Service"**
3. Clique em **"Connect a repository"** → Escolha `mini-crm`

### 3. Configurar o Service

Preencha os campos:

```
Name:              mini-crm-backend
Region:            Oregon (US West)
Branch:            main
Root Directory:    backend              ⚠️ IMPORTANTE!
Runtime:           Node
Build Command:     npm install
Start Command:     npm start
Instance Type:     Free
```

### 4. Environment Variables

Clique em **"Advanced"** e adicione as variáveis:

```
NODE_ENV              = production
PORT                  = 10000
SUPABASE_URL          = (cole do Supabase)
SUPABASE_ANON_KEY     = (cole do Supabase)
SUPABASE_SERVICE_KEY  = (cole do Supabase)
CORS_ORIGIN           = http://localhost:5173
```

**Onde pegar no Supabase?**
- SUPABASE_URL: Settings → API → Project URL
- SUPABASE_ANON_KEY: Settings → API → anon public
- SUPABASE_SERVICE_KEY: Settings → API → service_role secret

### 5. Deploy!

1. Clique em **"Create Web Service"**
2. Aguarde 5 minutos ⏱️
3. Quando terminar, copie a URL: `https://mini-crm-backend-XXXX.onrender.com`

### 6. Testar

Abra no navegador:
```
https://sua-url.onrender.com/health
```

Deve retornar: `{"status":"ok",...}` ✅

**✅ Backend pronto!** Anote a URL para usar no frontend.

---

## 🌐 Parte 2: Deploy do Frontend (Netlify)

### 1. Acesse o Netlify
- Entre em: https://app.netlify.com
- Faça login com GitHub

### 2. Criar Site
1. Clique em **"Add new site"**
2. Escolha **"Import an existing project"**
3. Clique em **"Deploy with GitHub"**
4. Escolha o repositório: `mini-crm`

### 3. Configurar o Site

Preencha os campos:

```
Branch to deploy:      main
Base directory:        frontend           ⚠️ IMPORTANTE!
Build command:         npm run build
Publish directory:     frontend/dist      ⚠️ IMPORTANTE!
```

### 4. Environment Variables

Antes de fazer deploy, clique em **"Show advanced"** → **"New variable"**:

```
VITE_SUPABASE_URL         = (mesmo do backend)
VITE_SUPABASE_ANON_KEY    = (mesmo do backend)
VITE_API_URL              = https://mini-crm-backend-XXXX.onrender.com
```

**Use a URL do backend do Passo 1.5!**

### 5. Deploy!

1. Clique em **"Deploy site"**
2. Aguarde 2 minutos ⏱️
3. Quando terminar, sua URL será: `https://random-name-12345.netlify.app`

### 6. Customizar Nome (Opcional)

1. Vá em **"Site settings"** → **"Site details"**
2. Clique em **"Change site name"**
3. Escolha: `mini-crm-seu-nome`
4. Ficará: `https://mini-crm-seu-nome.netlify.app`

**✅ Frontend pronto!** Mas ainda não vai funcionar... falta um passo!

---

## 🔄 Parte 3: Atualizar CORS (OBRIGATÓRIO!)

Agora que você tem a URL do Netlify, precisa atualizar o backend:

### 1. Voltar no Render
1. Acesse: https://dashboard.render.com
2. Clique no seu **mini-crm-backend**
3. Menu esquerdo: **"Environment"**

### 2. Atualizar CORS_ORIGIN
1. Encontre a variável `CORS_ORIGIN`
2. Clique em **"Edit"**
3. Altere para: `https://mini-crm-seu-nome.netlify.app`
4. Clique em **"Save Changes"**

### 3. Aguardar Redeploy
- O Render vai fazer redeploy automático (~2 min)
- Aguarde até aparecer "Live" de novo

**✅ Tudo configurado!**

---

## 🎉 Parte 4: Testar a Aplicação

1. Abra: `https://mini-crm-seu-nome.netlify.app`
2. Tela de login deve aparecer
3. Clique em "Sign Up" e crie uma conta
4. Faça login
5. Dashboard deve carregar com os gráficos! 📊

**Se tudo funcionar: PARABÉNS! 🎉**

---

## ❌ Problemas Comuns

### Backend retorna 502
- É o cold start (backend estava dormindo)
- Aguarde 30 segundos e recarregue a página

### Erro de CORS
- Verifique se `CORS_ORIGIN` no Render tem a URL exata do Netlify
- URL deve ter `https://` e SEM barra final
- Aguarde o redeploy terminar

### Login não funciona
- Verifique as variáveis `VITE_SUPABASE_*` no Netlify
- Vá em Netlify → Site settings → Environment variables
- Verifique se o Supabase está configurado corretamente

### Build falha
- Verifique se colocou:
  - Render: `Root Directory: backend`
  - Netlify: `Base directory: frontend` e `Publish: frontend/dist`

---

## 📝 Resumo das URLs

Depois de tudo pronto:

- **Frontend**: https://mini-crm-seu-nome.netlify.app
- **Backend**: https://mini-crm-backend-XXXX.onrender.com
- **Database**: https://seu-projeto.supabase.co
- **Repositório**: https://github.com/MikaelDDavidd/mini-crm

**Custo total: R$ 0,00/mês** 💰

---

## 🔄 Próximas Atualizações

Quando fizer mudanças no código:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Deploy automático:
- Netlify: ~2 minutos
- Render: ~5 minutos

---

## ⚠️ Lembrete Final

O backend no Render (plano grátis):
- "Dorme" após 15 minutos sem uso
- Primeiro acesso demora 30-60 segundos para "acordar"
- Depois funciona normalmente

**Pronto para fazer deploy!** 🚀
