import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type LeadInteraction, type InteractionType } from '@/types'

export function useLeadInteractions(leadId: string) {
  return useQuery({
    queryKey: ['lead-interactions', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const interactionsWithProfiles = await Promise.all(
        (data || []).map(async (interaction) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', interaction.created_by)
            .single()

          return {
            ...interaction,
            created_by_profile: profile || { full_name: 'Unknown', email: '' }
          }
        })
      )

      return interactionsWithProfiles as (LeadInteraction & { created_by_profile: { full_name: string; email: string } })[]
    },
    enabled: !!leadId,
  })
}

export function useAddInteraction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      leadId,
      type,
      description,
    }: {
      leadId: string
      type: InteractionType
      description: string
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('lead_interactions')
        .insert({
          lead_id: leadId,
          type,
          description,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead-interactions', variables.leadId] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useUpdateLeadNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, notes }: { leadId: string; notes: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase.from('leads').delete().eq('id', leadId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] })
    },
  })
}
