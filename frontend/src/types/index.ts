export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export type LeadSource = 'website' | 'referral' | 'social_media' | 'ad_campaign' | 'cold_call' | 'other'

export type LeadPriority = 'high' | 'normal' | 'low'

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'status_change'

export type UserRole = 'admin' | 'sales_manager' | 'sales_rep'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  status: LeadStatus
  source: LeadSource | null
  notes: string | null
  deal_value: number
  is_active: boolean
  tags: string[]
  assigned_to: string | null
  priority: LeadPriority
  created_at: string
  updated_at: string
  last_activity_at: string
  user_id: string
}

export interface LeadInteraction {
  id: string
  lead_id: string
  type: InteractionType
  description: string
  created_at: string
  created_by: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'qualified': 'Qualified',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'won': 'Won',
  'lost': 'Lost',
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  'website': 'Website',
  'referral': 'Referral',
  'social_media': 'Social Media',
  'ad_campaign': 'Ad Campaign',
  'cold_call': 'Cold Call',
  'other': 'Other',
}

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  'high': 'High Priority',
  'normal': 'Normal',
  'low': 'Low Priority',
}

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  'call': 'Call',
  'email': 'Email',
  'meeting': 'Meeting',
  'note': 'Note',
  'status_change': 'Status Change',
}
