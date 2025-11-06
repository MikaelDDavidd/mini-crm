-- ================================================
-- DEBUG: Ver se o trigger existe
-- ================================================
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ================================================
-- REMOVER TUDO E RECRIAR DO ZERO
-- ================================================

-- 1. Remover trigger se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover função se existir
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 3. Verificar se a tabela profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'profiles'
) as profiles_exists;

-- 4. Recriar função com log detalhado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Tentar inserir o profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'sales_rep'
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Se der erro, registra no log mas não bloqueia o signup
  RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Garantir que o usuário authenticated pode inserir em profiles
GRANT INSERT ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO service_role;

-- 7. Verificar se as policies permitem INSERT
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- ================================================
-- TESTE MANUAL: Criar um profile de teste
-- ================================================
-- Descomente as linhas abaixo para testar manualmente:

-- DELETE FROM auth.users WHERE email = 'teste@manual.com';
--
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_user_meta_data,
--   created_at,
--   updated_at,
--   instance_id
-- ) VALUES (
--   gen_random_uuid(),
--   'teste@manual.com',
--   crypt('senha123', gen_salt('bf')),
--   now(),
--   '{"full_name": "Usuario Teste"}'::jsonb,
--   now(),
--   now(),
--   '00000000-0000-0000-0000-000000000000'
-- );
