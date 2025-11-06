import { supabase } from '@/lib/supabase'
import type { Lead, LeadStatus } from '@/types'

export interface CreateLeadData {
  name: string
  email: string
  phone: string
  company: string
  source: string
  notes?: string
  status?: LeadStatus
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: LeadStatus
}

export const leadsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Lead[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Lead
  },

  async create(leadData: CreateLeadData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...leadData,
        user_id: user.id,
        status: leadData.status || 'new',
      })
      .select()
      .single()

    if (error) throw error
    return data as Lead
  },

  async update(id: string, leadData: UpdateLeadData) {
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Lead
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getByStatus(status: LeadStatus) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Lead[]
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Lead[]
  },
}
