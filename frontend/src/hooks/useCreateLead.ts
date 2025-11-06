import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type LeadStatus, type LeadSource, type LeadPriority } from '@/types'

interface CreateLeadData {
  name: string
  email: string
  phone?: string
  company?: string
  status: LeadStatus
  source?: LeadSource
  priority: LeadPriority
  deal_value: number
  notes?: string
  tags?: string[]
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      const cleanData = {
        ...data,
        phone: data.phone || undefined,
        company: data.company || undefined,
        source: data.source || undefined,
        notes: data.notes || undefined,
        user_id: user.id,
        is_active: true,
      }

      const { data: lead, error } = await supabase
        .from('leads')
        .insert(cleanData)
        .select()
        .single()

      if (error) throw error
      return lead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] })
    },
  })
}
