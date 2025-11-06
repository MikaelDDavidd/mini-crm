-- ================================================
-- INSERIR LEADS DE TESTE NO CRM
-- ================================================
-- IMPORTANTE: Substitua 'USER_ID_AQUI' pelo seu user_id real
-- Para pegar seu user_id: SELECT id, email FROM auth.users;

-- ================================================
-- 1. PRIMEIRO, PEGUE SEU USER_ID
-- ================================================
SELECT id, email FROM auth.users LIMIT 5;

-- Copie o ID do seu usuário e substitua nas queries abaixo

-- ================================================
-- 2. INSERIR LEADS DE EXEMPLO
-- ================================================

-- Lead 1: New
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, notes, user_id
) VALUES (
  'João Silva',
  'joao.silva@empresa.com.br',
  '(11) 98765-4321',
  'Tech Solutions Ltda',
  'new',
  'website',
  'high',
  25000.00,
  ARRAY['Enterprise', 'Hot Lead'],
  'Cliente interessado em nossa solução enterprise',
  'USER_ID_AQUI'
);

-- Lead 2: New
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Maria Santos',
  'maria@startup.io',
  '(21) 99876-5432',
  'Startup Inovadora',
  'new',
  'referral',
  'normal',
  15000.00,
  ARRAY['Startup', 'Follow-up'],
  'Indicação de cliente antigo',
  'USER_ID_AQUI'
);

-- Lead 3: Contacted
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Pedro Costa',
  'pedro.costa@comercio.com',
  '(31) 97654-3210',
  'Comércio Digital',
  'contacted',
  'cold_call',
  'normal',
  8500.00,
  ARRAY['SMB'],
  'Primeiro contato feito via telefone',
  'USER_ID_AQUI'
);

-- Lead 4: Qualified
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Ana Paula',
  'ana.paula@consultoria.com.br',
  '(41) 96543-2109',
  'Consultoria Business',
  'qualified',
  'social_media',
  'high',
  32000.00,
  ARRAY['Enterprise', 'Demo Scheduled'],
  'Demo agendada para próxima semana',
  'USER_ID_AQUI'
);

-- Lead 5: Proposal
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Carlos Eduardo',
  'carlos@industria.com.br',
  '(51) 95432-1098',
  'Indústria Nacional',
  'proposal',
  'ad_campaign',
  'high',
  45000.00,
  ARRAY['Enterprise', 'High Priority'],
  'Proposta enviada, aguardando retorno',
  'USER_ID_AQUI'
);

-- Lead 6: Negotiation
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Fernanda Lima',
  'fernanda@servicos.com',
  '(61) 94321-0987',
  'Serviços Premium',
  'negotiation',
  'website',
  'normal',
  18000.00,
  ARRAY['Contract Review'],
  'Negociando valores e prazos',
  'USER_ID_AQUI'
);

-- Lead 7: Won
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Roberto Alves',
  'roberto@tecnologia.com.br',
  '(71) 93210-9876',
  'Tech Corp',
  'won',
  'referral',
  'normal',
  22000.00,
  ARRAY['Closed', 'Success'],
  'Deal fechado! Cliente muito satisfeito',
  'USER_ID_AQUI'
);

-- Lead 8: New
INSERT INTO leads (
  name, email, phone, company, status, source, priority, deal_value, tags, user_id
) VALUES (
  'Juliana Ferreira',
  'juliana@marketing.com',
  '(81) 92109-8765',
  'Marketing Digital Plus',
  'new',
  'social_media',
  'low',
  5500.00,
  ARRAY['Small Business'],
  'Contato inicial via Instagram',
  'USER_ID_AQUI'
);

-- ================================================
-- 3. VERIFICAR LEADS INSERIDOS
-- ================================================
SELECT
  name,
  company,
  status,
  deal_value,
  source,
  priority,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;

-- ================================================
-- 4. CONTAR LEADS POR STATUS
-- ================================================
SELECT
  status,
  COUNT(*) as total,
  SUM(deal_value) as total_value
FROM leads
GROUP BY status
ORDER BY
  CASE status
    WHEN 'new' THEN 1
    WHEN 'contacted' THEN 2
    WHEN 'qualified' THEN 3
    WHEN 'proposal' THEN 4
    WHEN 'negotiation' THEN 5
    WHEN 'won' THEN 6
    WHEN 'lost' THEN 7
  END;
