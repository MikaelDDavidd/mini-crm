import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer'
import { AddLeadDrawer } from '@/components/leads/AddLeadDrawer'
import { FilterBar } from '@/components/pipeline/FilterBar'
import { useLeads } from '@/hooks/useLeads'
import { useAuth } from '@/contexts/AuthContext'
import { type Lead, type LeadStatus, type LeadSource } from '@/types'

export function Pipeline() {
  const { data: leads = [], isLoading } = useLeads()
  const { user } = useAuth()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<LeadStatus>('new')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all')
  const [selectedSource, setSelectedSource] = useState<LeadSource | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | '90days' | 'all'>('all')
  const [ownerFilter, setOwnerFilter] = useState<'me' | 'all'>('all')

  const filteredLeads = useMemo(() => {
    const now = new Date()

    return leads.filter((lead) => {
      const matchesSearch = !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus
      const matchesSource = selectedSource === 'all' || !lead.source || lead.source === selectedSource

      const createdAt = new Date(lead.created_at)
      const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === '7days' && daysDiff <= 7) ||
        (dateFilter === '30days' && daysDiff <= 30) ||
        (dateFilter === '90days' && daysDiff <= 90)

      const matchesOwner =
        ownerFilter === 'all' ||
        (ownerFilter === 'me' && user && lead.user_id === user.id)

      return matchesSearch && matchesStatus && matchesSource && matchesDate && matchesOwner
    })
  }, [leads, searchQuery, selectedStatus, selectedSource, dateFilter, ownerFilter, user])

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailDrawerOpen(true)
  }

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false)
    setTimeout(() => setSelectedLead(null), 300)
  }

  const handleAddLead = (status?: LeadStatus) => {
    setDefaultStatus(status || 'new')
    setIsAddDrawerOpen(true)
  }

  const handleCloseAddDrawer = () => {
    setIsAddDrawerOpen(false)
    setLeadToEdit(null)
  }

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead)
    setIsDetailDrawerOpen(false)
    setIsAddDrawerOpen(true)
  }

  return (
    <AppLayout title="Sales Pipeline">
      <div className="space-y-0">
        <div className="mb-6">
          <h1 className="text-[#101828] text-2xl font-bold leading-tight tracking-[-0.015em] px-6">
            Manage and track your leads through the sales funnel.
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-[#EAECF0]">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            ownerFilter={ownerFilter}
            onOwnerFilterChange={setOwnerFilter}
            onAddLead={() => handleAddLead()}
          />

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-[#667085] mt-4">Loading pipeline...</p>
            </div>
          ) : (
            <div className="p-6">
              <KanbanBoard
                leads={filteredLeads}
                onLeadClick={handleLeadClick}
                onAddLead={handleAddLead}
              />
            </div>
          )}
        </div>
      </div>

      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        onEdit={handleEditLead}
      />

      <AddLeadDrawer
        isOpen={isAddDrawerOpen}
        onClose={handleCloseAddDrawer}
        defaultStatus={defaultStatus}
        lead={leadToEdit}
      />
    </AppLayout>
  )
}
