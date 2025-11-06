import { Plus } from 'lucide-react'
import { type Lead, type LeadStatus, LEAD_STATUS_LABELS } from '@/types'
import { LeadCard } from './LeadCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: LeadStatus
  leads: Lead[]
  onDragStart: (leadId: string, fromStatus: LeadStatus) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (status: LeadStatus) => void
  onLeadClick?: (lead: Lead) => void
  onAddLead?: (status: LeadStatus) => void
  draggingLeadId?: string | null
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-purple-100 text-purple-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-orange-100 text-orange-700',
  proposal: 'bg-cyan-100 text-cyan-700',
  negotiation: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-700',
}

export function KanbanColumn({
  status,
  leads,
  onDragStart,
  onDragOver,
  onDrop,
  onLeadClick,
  onAddLead,
  draggingLeadId,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver(e)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop(status)
  }

  return (
    <div className="flex flex-col h-full min-w-[300px] w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-1 rounded-md text-sm font-semibold', statusColors[status])}>
            {LEAD_STATUS_LABELS[status]}
          </span>
          <span className="text-[#667085] text-sm font-medium">
            {leads.length}
          </span>
        </div>

        <button
          onClick={() => onAddLead?.(status)}
          className="flex items-center gap-1 text-[#667085] hover:text-primary text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      <div
        className="flex-1 bg-[#F9FAFB] rounded-lg p-3 space-y-3 overflow-y-auto min-h-[500px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[#667085] text-sm">
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isDragging={draggingLeadId === lead.id}
              onDragStart={() => onDragStart(lead.id, status)}
              onClick={() => onLeadClick?.(lead)}
            />
          ))
        )}
      </div>
    </div>
  )
}
