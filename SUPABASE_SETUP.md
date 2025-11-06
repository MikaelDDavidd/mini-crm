# Supabase Setup Instructions

## ✅ Credenciais Configuradas

As credenciais já foram configuradas nos arquivos `.env`

## 📝 Próximo Passo: Rodar o SQL

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/aqrpidgdhhkmlbhqvomc

2. No menu lateral, clique em **SQL Editor**

3. Clique em **New Query**

4. Copie todo o conteúdo do arquivo `supabase-schema.sql` e cole no editor

5. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)

6. Aguarde a execução. Você deve ver uma mensagem de sucesso.

## 🧪 Testar a Aplicação

Depois de rodar o SQL:

1. Acesse: http://localhost:5173

2. Clique em "Sign Up"

3. Crie uma conta de teste:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: teste123 (mínimo 6 caracteres)

4. Após criar, faça login

5. Você será redirecionado para o dashboard

## ✅ Verificar se funcionou

No Supabase Dashboard:

1. Vá em **Table Editor** > **auth.users**
   - Deve aparecer seu usuário criado

2. Vá em **Table Editor** > **profiles**
   - Deve aparecer automaticamente seu perfil (trigger automático!)

## 🐛 Troubleshooting

Se der erro ao criar conta:
- Verifique se o SQL foi rodado corretamente
- Verifique se as tabelas `profiles`, `leads` e `lead_interactions` existem
- Verifique se as RLS policies foram criadas

Se der erro de conexão:
- Reinicie o servidor: pare e rode `npm run dev` novamente
- Verifique se o arquivo `.env` está no lugar certo
