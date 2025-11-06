# ⚠️ AÇÃO NECESSÁRIA - Rodar SQL no Supabase

## Você está recebendo erro 500 porque o banco de dados não está configurado ainda.

### Siga estes passos AGORA:

1. **Acesse**: https://supabase.com/dashboard/project/aqrpidgdhhkmlbhqvomc

2. **Menu Lateral** → Clique em **"SQL Editor"** (ícone de banco de dados)

3. **Clique em** → **"New Query"** (botão verde no topo)

4. **Abra o arquivo**: `supabase-schema.sql` (está na raiz do projeto)

5. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)

6. **Cole no editor do Supabase**

7. **Clique em RUN** (botão verde no canto inferior direito, ou Ctrl+Enter)

8. **Aguarde ~10 segundos**

### ✅ Mensagem de Sucesso esperada:

```
Success. No rows returned
```

### 📋 O que o SQL vai criar:

- ✅ Tabela `profiles` (perfis de usuários)
- ✅ Tabela `leads` (leads do CRM)
- ✅ Tabela `lead_interactions` (histórico)
- ✅ Triggers automáticos
- ✅ RLS Policies (segurança)
- ✅ Indexes (performance)

### Depois de rodar o SQL:

1. Volte para http://localhost:5173/signup
2. Tente criar a conta novamente
3. Deve funcionar! ✅

### 🐛 Se ainda der erro:

Abra o Console do navegador (F12) e me envie o erro completo.
