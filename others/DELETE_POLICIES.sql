-- ============================================
-- DELETAR POLÍTICAS ANTIGAS DO STORAGE
-- ============================================
-- Execute no SQL Editor do Supabase

DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Resultado esperado: "Success. No rows returned"
