-- ============================================
-- POLÍTICAS SIMPLIFICADAS PARA SUPABASE STORAGE
-- ============================================
-- Execute SOMENTE UMA VEZ no SQL Editor do Supabase

-- IMPORTANTE: Se você já tentou criar as políticas antes e deu erro,
-- primeiro delete as políticas existentes rodando este comando:
-- DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- 1. Permitir QUALQUER usuário autenticado fazer upload (INSERT)
CREATE POLICY "Enable insert for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
);

-- 2. Permitir leitura pública (SELECT)
CREATE POLICY "Enable read access for all users"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);

-- 3. Permitir QUALQUER usuário autenticado atualizar (UPDATE)
CREATE POLICY "Enable update for authenticated users"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
)
WITH CHECK (
  bucket_id = 'avatars'
);

-- 4. Permitir QUALQUER usuário autenticado deletar (DELETE)
CREATE POLICY "Enable delete for authenticated users"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
);

-- Resultado esperado: "Success. No rows returned"
