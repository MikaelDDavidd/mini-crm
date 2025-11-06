# Setup Rápido do Supabase Storage

## Passo 1: Criar o Bucket

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Menu lateral: **Storage**
3. Clique em **New bucket**
4. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Marque como PUBLIC
   - Clique em **Create bucket**

## Passo 2: Configurar Políticas de Segurança

### Opção A: SQL Editor (RECOMENDADO - Mais Fácil) ✅

1. Menu lateral: **SQL Editor**
2. Clique em **New query**
3. Cole TODO o conteúdo do arquivo `SUPABASE_STORAGE_POLICIES.sql`
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Pronto! ✅

### Opção B: Interface de Políticas (Manual)

Se preferir criar manualmente uma por uma:

1. Vá em **Storage** > bucket `avatars` > aba **Policies**
2. Clique em **New policy**
3. Selecione **For full customization**

#### Política 1: Upload (INSERT)
- **Policy name**: `Users can upload their own avatars`
- **Policy command**: SELECT `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

#### Política 2: Leitura Pública (SELECT)
- **Policy name**: `Public avatar access`
- **Policy command**: SELECT `SELECT`
- **Target roles**: `public`
- **USING expression**:
```sql
bucket_id = 'avatars'
```

#### Política 3: Atualização (UPDATE)
- **Policy name**: `Users can update their own avatars`
- **Policy command**: SELECT `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```
- **WITH CHECK expression**:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

#### Política 4: Exclusão (DELETE)
- **Policy name**: `Users can delete their own avatars`
- **Policy command**: SELECT `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:
```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

## Passo 3: Verificar

1. Vá em **Storage** > **avatars** > **Policies**
2. Você deve ver 4 políticas listadas:
   - ✅ Users can upload their own avatars (INSERT)
   - ✅ Public avatar access (SELECT)
   - ✅ Users can update their own avatars (UPDATE)
   - ✅ Users can delete their own avatars (DELETE)

## Passo 4: Testar

1. Acesse sua aplicação em http://localhost:5173
2. Faça login
3. Vá em **Settings**
4. Clique no ícone de câmera no avatar
5. Selecione uma imagem
6. O avatar deve ser atualizado! 🎉

## Troubleshooting

### Erro: "new row violates row-level security policy"
- Verifique se as políticas foram criadas corretamente
- Confirme que o bucket `avatars` existe
- Certifique-se de que está logado na aplicação

### Erro: "bucket not found"
- O nome do bucket deve ser exatamente `avatars` (minúsculas)
- Verifique se o bucket foi criado no Storage

### Avatar não aparece
- Confirme que o bucket está marcado como **Public**
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique a política de SELECT (público)

### Imagem não faz upload
- Verifique a política de INSERT
- Confirme que o usuário está autenticado
- Veja o console do navegador (F12) para erros

## URLs do Storage

Após configurado, suas imagens estarão disponíveis em:

```
https://[seu-projeto].supabase.co/storage/v1/object/public/avatars/[arquivo]
```

Exemplo:
```
https://abcdefg.supabase.co/storage/v1/object/public/avatars/123-456.jpg
```
