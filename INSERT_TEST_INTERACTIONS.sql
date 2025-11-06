-- ================================================
-- ADICIONAR INTERAÇÕES DE TESTE
-- ================================================
-- IMPORTANTE: Substitua USER_ID_AQUI pelo seu user_id
-- e LEAD_ID_AQUI pelo ID de um lead que você criou

-- ================================================
-- 1. LISTAR SEUS LEADS
-- ================================================
SELECT id, name, company, status FROM leads ORDER BY created_at DESC LIMIT 10;

-- Copie o ID de um lead e substitua abaixo

-- ================================================
-- 2. ADICIONAR INTERAÇÕES
-- ================================================

-- Interação 1: Call
INSERT INTO lead_interactions (lead_id, type, description, created_by)
VALUES (
  'LEAD_ID_AQUI',
  'call',
  'First contact call. Discussed their needs and current pain points with their existing CRM system.',
  'USER_ID_AQUI'
);

-- Interação 2: Email
INSERT INTO lead_interactions (lead_id, type, description, created_by)
VALUES (
  'LEAD_ID_AQUI',
  'email',
  'Sent detailed proposal with pricing tiers and implementation timeline. Included case studies from similar companies.',
  'USER_ID_AQUI'
);

-- Interação 3: Meeting
INSERT INTO lead_interactions (lead_id, type, description, created_by)
VALUES (
  'LEAD_ID_AQUI',
  'meeting',
  'Demo call scheduled. Showed key features: pipeline management, reporting dashboard, and team collaboration tools.',
  'USER_ID_AQUI'
);

-- Interação 4: Note
INSERT INTO lead_interactions (lead_id, type, description, created_by)
VALUES (
  'LEAD_ID_AQUI',
  'note',
  'Decision maker is very interested. Mentioned budget approval needed from CFO. Follow up next week.',
  'USER_ID_AQUI'
);

-- Interação 5: Status Change (automaticamente criada pelo trigger, mas você pode adicionar manualmente)
INSERT INTO lead_interactions (lead_id, type, description, created_by)
VALUES (
  'LEAD_ID_AQUI',
  'status_change',
  'Status changed from new to qualified',
  'USER_ID_AQUI'
);

-- ================================================
-- 3. VERIFICAR INTERAÇÕES CRIADAS
-- ================================================
SELECT
  li.type,
  li.description,
  li.created_at,
  p.full_name as created_by_name,
  l.name as lead_name
FROM lead_interactions li
JOIN leads l ON l.id = li.lead_id
JOIN profiles p ON p.id = li.created_by
WHERE li.lead_id = 'LEAD_ID_AQUI'
ORDER BY li.created_at DESC;

-- ================================================
-- 4. ADICIONAR INTERAÇÕES PARA MÚLTIPLOS LEADS (OPCIONAL)
-- ================================================

-- Pegar os 3 primeiros leads
WITH first_leads AS (
  SELECT id FROM leads ORDER BY created_at DESC LIMIT 3
)
-- Adicionar uma nota para cada um
INSERT INTO lead_interactions (lead_id, type, description, created_by)
SELECT
  id,
  'note',
  'Initial assessment completed. Good fit for our solution.',
  'USER_ID_AQUI'
FROM first_leads;
