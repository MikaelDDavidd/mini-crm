# 🔧 Correção do Storage - Passo a Passo

## ✅ O que foi corrigido no código:

1. **Caminho duplicado**: Removido `avatars/` do filePath
2. **Políticas simplificadas**: Criadas políticas que definitivamente funcionam

## 📋 Execute estes passos NO SUPABASE:

### Passo 1: Limpar políticas antigas (se existirem)

No **SQL Editor** do Supabase, execute:

```sql
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON storage.objects;
```

**Resultado esperado**: Pode dar erro "policy does not exist" - está OK! Continue.

### Passo 2: Criar as novas políticas

No mesmo **SQL Editor**, execute TODO o conteúdo do arquivo:
**`SUPABASE_STORAGE_POLICIES_SIMPLES.sql`**

**Resultado esperado**: "Success. No rows returned" ✅

### Passo 3: Verificar

1. Vá em **Storage** > **avatars** > **Policies**
2. Você deve ver 4 políticas:
   - ✅ Enable insert for authenticated users
   - ✅ Enable read access for all users
   - ✅ Enable update for authenticated users
   - ✅ Enable delete for authenticated users

## 🧪 Teste agora:

1. Acesse http://localhost:5173
2. Faça login
3. Vá em Settings
4. Clique no ícone da câmera
5. Selecione uma imagem
6. Deve funcionar! 🎉

## ❓ Se ainda der erro:

### Erro: "bucket not found"
```
Solução: Crie o bucket 'avatars' em Storage > New bucket
```

### Erro: "RLS policy"
```
Solução:
1. Verifique se as 4 políticas estão listadas em Storage > avatars > Policies
2. Se não estiverem, rode o Passo 2 novamente
```

### Erro: "Not authorized"
```
Solução:
1. Faça logout
2. Faça login novamente
3. Tente fazer upload
```

## 🔍 Debug rápido:

Abra o console do navegador (F12) e veja:
- Se aparecer erro 400: Problema no bucket ou políticas
- Se aparecer erro 401: Problema de autenticação
- Se aparecer erro 403: Problema de permissão RLS

## 📝 Diferença das políticas:

**Antes** (complexas - causavam erro):
- Tentavam validar pastas e estruturas
- Usavam `storage.foldername(name)[1]`

**Agora** (simples - funcionam):
- Apenas validam se está no bucket correto
- Qualquer usuário autenticado pode fazer upload
- Todos podem visualizar (público)

Para produção, você pode adicionar validações mais restritivas depois.
