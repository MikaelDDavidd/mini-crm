-- ================================================
-- AUTO-CONFIRMAR EMAIL NO SIGNUP (Desenvolvimento)
-- ================================================

-- ATENÇÃO: Use isso apenas em DESENVOLVIMENTO!
-- Em produção, emails devem ser confirmados pelo usuário.

-- 1. Atualizar função handle_new_user para auto-confirmar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'sales_rep'
  );

  -- Auto-confirmar email (apenas para desenvolvimento!)
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id
  AND email_confirmed_at IS NULL;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- CONFIRMAR EMAILS EXISTENTES
-- ================================================

-- Confirmar todos os usuários que ainda não foram confirmados
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Verificar quantos foram confirmados
SELECT
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as pending
FROM auth.users;
