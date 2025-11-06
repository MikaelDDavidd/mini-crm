import { useState, useMemo } from 'react'
import { type Lead, type LeadStatus } from '@/types'
import { KanbanColumn } from './KanbanColumn'
import { useUpdateLeadStatus } from '@/hooks/useLeads'

interface KanbanBoardProps {
  leads: Lead[]
  onLeadClick?: (lead: Lead) => void
  onAddLead?: (status: LeadStatus) => void
}

const PIPELINE_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
]

export function KanbanBoard({ leads, onLeadClick, onAddLead }: KanbanBoardProps) {
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null)
  const [dragFromStatus, setDragFromStatus] = useState<LeadStatus | null>(null)

  const updateLeadStatus = useUpdateLeadStatus()

  const leadsByStatus = useMemo(() => {
    return PIPELINE_STATUSES.reduce((acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status)
      return acc
    }, {} as Record<LeadStatus, Lead[]>)
  }, [leads])

  const handleDragStart = (leadId: string, fromStatus: LeadStatus) => {
    setDraggingLeadId(leadId)
    setDragFromStatus(fromStatus)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (toStatus: LeadStatus) => {
    if (!draggingLeadId || !dragFromStatus || dragFromStatus === toStatus) {
      setDraggingLeadId(null)
      setDragFromStatus(null)
      return
    }

    try {
      await updateLeadStatus.mutateAsync({
        leadId: draggingLeadId,
        status: toStatus,
      })
    } catch (error) {
      console.error('Failed to update lead status:', error)
    } finally {
      setDraggingLeadId(null)
      setDragFromStatus(null)
    }
  }

  return (
    <div className="md:overflow-x-auto md:-mx-6 md:px-6 pb-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:min-w-max">
        {PIPELINE_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leadsByStatus[status] || []}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onLeadClick={onLeadClick}
            onAddLead={onAddLead}
            draggingLeadId={draggingLeadId}
          />
        ))}
      </div>
    </div>
  )
}
