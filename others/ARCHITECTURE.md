# Mini CRM - Arquitetura e Mapeamento Completo

## Telas Identificadas

1. **Login Page** - Autenticação de usuário
2. **Dashboard** - Visão geral com estatísticas
3. **Pipeline Kanban** - Visão de funil de vendas
4. **Lead Detail Modal** - Detalhes completos do lead (sidebar)
5. **Add/Edit Lead Modal** - Formulário de criação/edição
6. **Import Leads Page** - Importação de planilhas

## Campos Identificados nos Designs

### Lead (Tabela Principal)
- `id` (UUID)
- `name` (text) - Nome completo *
- `email` (text) - Email
- `phone` (text) - Telefone
- `company` (text) - Empresa
- `status` (enum) - Status do lead: new, contacted, qualified, proposal, negotiation, won, lost
- `source` (text) - Origem: Website, Referral, Social Media, Ad Campaign, Cold Call
- `notes` (text) - Observações
- `deal_value` (decimal) - Valor do negócio
- `is_active` (boolean) - Status ativo/inativo
- `tags` (text[]) - Array de tags
- `assigned_to` (UUID) - Usuário responsável
- `priority` (text) - Prioridade: high, normal, low
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `last_activity_at` (timestamp)
- `user_id` (UUID) - Dono do lead

### Lead Interactions (Histórico)
- `id` (UUID)
- `lead_id` (UUID)
- `type` (enum) - call, email, meeting, note, status_change
- `description` (text)
- `created_at` (timestamp)
- `created_by` (UUID) - Usuário que criou

### Users (Supabase Auth + profile)
- `id` (UUID) - do Supabase Auth
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `role` (text) - Sales Manager, Sales Rep, Admin
- `created_at` (timestamp)

## Funcionalidades Identificadas

### Autenticação
- Login com email/password
- Lembrar-me
- Esqueci minha senha
- Sign up

### Dashboard
- Cards de estatísticas:
  - Total Leads
  - Active Leads
  - Converted
  - Conversion Rate
  - New Today
  - Lost
- Gráfico de atividade (7 dias)
- Gráfico de leads por estágio (donut chart)
- Gráfico de leads por fonte (bar chart)
- Tabela de leads recentes
- Badges de status com cores

### Pipeline Kanban
- Colunas: New, Contacted, Qualified, Proposal, Won/Lost
- Contador de leads por coluna
- Cards com:
  - Nome do lead
  - Empresa
  - Ícones de contato (email, phone)
  - Valor do negócio
  - Tags/badges (High Priority, Enterprise, Follow-up, Demo Scheduled)
- Drag and drop entre colunas
- Botão "Add Lead" por coluna
- Filtros no header:
  - Busca por texto
  - Filtro por estágio
  - Filtro por fonte
  - Filtro por data
  - Filtro por responsável (Owner)

### Lead Detail (Sidebar)
- Informações principais:
  - Nome (grande)
  - Status badge
  - Active badge
  - Email
  - Phone
  - Company
  - Source
  - Deal Value
  - Creation Date
  - Last Activity
  - Assigned To (avatar + nome)
- Botões: Close, Edit, Delete, Convert
- Seção de Notes/Observations (textarea + Save)
- Timeline de Interaction History:
  - Tipo de interação (call, email, note)
  - Descrição
  - Criado por
  - Data/hora
- Botão "Add Note"

### Add/Edit Lead Form
- Campos:
  - Name* (required, validation)
  - Email (validation com feedback visual success/error)
  - Phone (com máscara)
  - Company
  - Value/Deal size (com prefixo R$)
  - Source (dropdown)
  - Stage (dropdown)
  - Status (toggle Active/Inactive)
  - Tags (multi-select com chips removíveis)
  - Observations (textarea)
- Validação em tempo real
- Estados: success, error, disabled
- Botões: Cancel, Save

### Import Leads
- Instruções passo a passo
- Botão "Download template"
- Área de upload:
  - Drag & drop
  - Click to browse
  - Formatos: .csv, .xlsx
  - Max: 5MB
- Estados:
  - Empty (drag & drop area)
  - File selected (com nome, tamanho, botão remover)
  - Importing (progress bar)
  - Complete (estatísticas: Total Records, Successful, Failed, Skipped)

### Exportação de Dados
- Botão de export (não vi tela dedicada, mas é requisito)
- Formato: .xlsx ou .csv
- Filtros aplicados devem ser respeitados

## Sidebar/Navigation
- Logo + nome da empresa
- Menu items:
  - Dashboard
  - Pipeline/Kanban
  - Contacts
  - Deals
  - Tasks
  - Reports
  - Settings
- Botão "New Lead"
- User profile (avatar, nome, email)
- Help
- Log Out

## Header Components
- Search bar global
- Notificações
- Avatar do usuário
- Breadcrumb/Page title

## Design Tokens

### Colors
- **Primary**: #7b61ff (roxo)
- **Background Light**: #f6f5f8
- **Background Dark**: #120f23
- **Status Colors**:
  - New: #8A2BE2 (roxo)
  - Contacted: #4A90E2 (azul)
  - Qualified: #F5A623 (laranja)
  - Proposal: #28A745 (verde)
  - Won: #D00285 (magenta)
  - Lost: #6C757D (cinza)
  - Active: verde
  - High Priority: roxo
- **Success**: #2ECC71
- **Error**: #E74C3C

### Typography
- Font: Inter
- Weights: 400, 500, 600, 700, 900

### Spacing
- Cards: p-6
- Gaps: 4, 6 (Tailwind spacing)

## Componentes Reutilizáveis a Criar

### UI Components
1. **Button** - variants: primary, secondary, ghost, danger
2. **Input** - com suporte a ícones, validação, máscaras
3. **Select** - dropdown com busca
4. **Badge** - status badges com cores
5. **Card** - container com bordas e sombras
6. **Modal** - overlay + container
7. **Sidebar** - slide-in panel
8. **Avatar** - com fallback de iniciais
9. **Tooltip**
10. **ProgressBar**
11. **Toggle/Switch**
12. **Textarea**
13. **MultiSelect** - tags com chips
14. **FileUpload** - drag & drop area
15. **Timeline** - para histórico
16. **Table** - com ordenação
17. **Chart** - line, donut, bar

### Feature Components
1. **AuthForm** - login/signup
2. **LeadCard** - card do kanban
3. **LeadForm** - criar/editar lead
4. **LeadDetail** - sidebar com detalhes
5. **StatsCard** - cards de métricas
6. **KanbanColumn** - coluna do kanban
7. **KanbanBoard** - board completo
8. **FilterBar** - barra de filtros
9. **SearchBar** - busca global
10. **ImportFlow** - fluxo de importação
11. **InteractionTimeline** - timeline de interações

### Layout Components
1. **AppLayout** - layout principal com sidebar
2. **Header** - topbar
3. **Sidebar** - navigation
4. **Container** - max-width wrapper

## Real-time Features
- Notificações de novos leads
- Updates quando outros usuários movem leads no Kanban
- Badge de "novo" em leads recentes

## Validações Necessárias

### Frontend (Zod Schemas)
- Email format
- Phone format (BR)
- Required fields
- Max lengths
- Deal value (número positivo)
- File upload (tipo, tamanho)

### Backend
- Mesmas validações do frontend
- RLS policies (user_id match)
- File processing (CSV/XLSX parsing)
