import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type Lead, type LeadStatus } from '@/types'

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Lead[]
    },
  })
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status, created_at')

      if (error) throw error

      const total = leads?.length || 0
      const active = leads?.filter((l) => l.status !== 'won' && l.status !== 'lost').length || 0
      const won = leads?.filter((l) => l.status === 'won').length || 0
      const lost = leads?.filter((l) => l.status === 'lost').length || 0

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const newToday =
        leads?.filter((l) => new Date(l.created_at) >= today).length || 0

      const conversionRate = total > 0 ? ((won / total) * 100).toFixed(2) : '0.00'

      return {
        total,
        active,
        won,
        lost,
        newToday,
        conversionRate,
      }
    },
  })
}

export function useLeadsBySource() {
  return useQuery({
    queryKey: ['leads-by-source'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('source')

      if (error) throw error

      const sourceCounts = data.reduce((acc, lead) => {
        const source = lead.source || 'other'
        acc[source] = (acc[source] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return Object.entries(sourceCounts).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    },
  })
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: LeadStatus }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, data }: { leadId: string; data: Partial<Lead> }) => {
      const { data: updated, error } = await supabase
        .from('leads')
        .update(data)
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] })
    },
  })
}
