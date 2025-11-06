export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'status_change'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: LeadStatus
  source: string
  notes: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface LeadInteraction {
  id: string
  lead_id: string
  type: InteractionType
  description: string
  created_at: string
  user_id: string
}

export interface User {
  id: string
  email: string
  created_at: string
}
