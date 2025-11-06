import { supabase } from '@/lib/supabase'
import { LeadInteraction, InteractionType } from '@/types'

export interface CreateInteractionData {
  lead_id: string
  type: InteractionType
  description: string
}

export const interactionsService = {
  async getByLeadId(leadId: string) {
    const { data, error } = await supabase
      .from('lead_interactions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as LeadInteraction[]
  },

  async create(interactionData: CreateInteractionData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('lead_interactions')
      .insert({
        ...interactionData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data as LeadInteraction
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lead_interactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
