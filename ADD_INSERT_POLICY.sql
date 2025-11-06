-- ================================================
-- ADICIONAR POLICY DE INSERT FALTANTE
-- ================================================

-- A policy de INSERT estava faltando!
-- O trigger precisa dela para criar profiles automaticamente

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verificar se foi criada
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd;
