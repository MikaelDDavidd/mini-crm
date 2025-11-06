# Configuração do Supabase Storage para Avatar Upload

## Passo a Passo

### 1. Acessar o Painel do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto Mini CRM

### 2. Criar o Bucket de Avatars

1. No menu lateral esquerdo, clique em **Storage**
2. Clique no botão **New bucket** (ou **Create bucket**)
3. Configure o bucket:
   - **Name**: `avatars`
   - **Public bucket**: Marque como **ATIVO/ON** ✅
   - **Allowed MIME types**: Deixe vazio para permitir todos os tipos de imagem
   - **File size limit**: Configure para `5MB` (ou o valor desejado)
4. Clique em **Create bucket**

### 3. Configurar Políticas de Acesso (RLS Policies)

#### 3.1 Permitir Upload de Avatars (INSERT)

1. Clique no bucket `avatars`
2. Vá para a aba **Policies**
3. Clique em **New policy**
4. Selecione **Custom policy**
5. Configure:
   - **Policy name**: `Users can upload their own avatars`
   - **Policy definition**: Selecione **INSERT**
   - Cole este código SQL:

```sql
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

6. Clique em **Save policy**

#### 3.2 Permitir Leitura Pública (SELECT)

1. Clique em **New policy** novamente
2. Selecione **Custom policy**
3. Configure:
   - **Policy name**: `Public avatar access`
   - **Policy definition**: Selecione **SELECT**
   - Cole este código SQL:

```sql
CREATE POLICY "Public avatar access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

4. Clique em **Save policy**

#### 3.3 Permitir Atualização de Avatars (UPDATE)

1. Clique em **New policy**
2. Selecione **Custom policy**
3. Configure:
   - **Policy name**: `Users can update their own avatars`
   - **Policy definition**: Selecione **UPDATE**
   - Cole este código SQL:

```sql
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

4. Clique em **Save policy**

#### 3.4 Permitir Exclusão de Avatars (DELETE)

1. Clique em **New policy**
2. Selecione **Custom policy**
3. Configure:
   - **Policy name**: `Users can delete their own avatars`
   - **Policy definition**: Selecione **DELETE**
   - Cole este código SQL:

```sql
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

4. Clique em **Save policy**

### 4. Verificar Configuração

1. Vá para **Storage** > **avatars**
2. Você deve ver:
   - Bucket status: **Public** ✅
   - 4 políticas configuradas (INSERT, SELECT, UPDATE, DELETE)

### 5. Testar o Upload

1. Acesse a aplicação em `http://localhost:5173`
2. Faça login
3. Vá para **Settings** no menu lateral
4. Clique no ícone de câmera no avatar
5. Selecione uma imagem
6. O avatar deve ser atualizado automaticamente

## Estrutura de Pastas no Storage

O sistema organiza os avatars da seguinte forma:

```
avatars/
  └── {user_id}-{random}.{ext}
```

Exemplo: `avatars/123e4567-e89b-12d3-a456-426614174000-0.5234567.jpg`

## Troubleshooting

### Erro: "new row violates row-level security policy"

- Verifique se as políticas de INSERT/UPDATE foram criadas corretamente
- Confirme que o usuário está autenticado

### Erro: "bucket not found"

- Verifique se o bucket `avatars` foi criado
- Confirme o nome exato (case-sensitive)

### Avatar não aparece após upload

- Verifique se o bucket está configurado como **Public**
- Confirme que a política de SELECT permite acesso público
- Limpe o cache do navegador (Ctrl + Shift + R)

### Erro de CORS

- No Supabase, vá para **Settings** > **API**
- Verifique se o CORS está configurado para permitir seu domínio local
- URL permitida deve incluir: `http://localhost:5173`

## URLs Importantes

- **Storage URL**: `https://{seu-projeto}.supabase.co/storage/v1`
- **Public URL**: `https://{seu-projeto}.supabase.co/storage/v1/object/public/avatars/`

## Segurança

As políticas configuradas garantem que:

- ✅ Apenas usuários autenticados podem fazer upload
- ✅ Usuários só podem modificar seus próprios avatars
- ✅ Todos podem visualizar os avatars (necessário para o CRM)
- ✅ Bucket público para URLs diretas das imagens
- ✅ Validação de tamanho de arquivo (5MB)

## Próximos Passos Opcionais

### Limitar Tipos de Arquivo

Se quiser aceitar apenas imagens:

1. Vá para Storage > avatars > Configuration
2. Em **Allowed MIME types**, adicione:
   - `image/jpeg`
   - `image/png`
   - `image/webp`
   - `image/gif`

### Redimensionamento Automático

Para redimensionar imagens automaticamente:

1. Instale a extensão **Image Transformation** no Supabase
2. Configure as transformações desejadas
3. Use parâmetros na URL: `?width=200&height=200`

### Cleanup de Avatars Antigos

Considere criar uma função para deletar avatars antigos quando um novo é enviado:

```sql
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL AND OLD.avatar_url != NEW.avatar_url THEN
    -- Código para deletar arquivo antigo do storage
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_old_avatar
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION delete_old_avatar();
```
