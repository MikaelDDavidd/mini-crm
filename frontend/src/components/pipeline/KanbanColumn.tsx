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
    <div className="flex flex-col w-full md:min-w-[320px] md:w-[320px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1.5 rounded-lg text-sm font-semibold', statusColors[status])}>
            {LEAD_STATUS_LABELS[status]}
          </span>
          <span className="text-[#667085] text-sm font-semibold">
            {leads.length}
          </span>
        </div>

        <button
          onClick={() => onAddLead?.(status)}
          className="flex items-center gap-1.5 text-[#667085] hover:text-primary text-sm font-medium transition-colors px-2 py-1 hover:bg-gray-50 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </button>
      </div>

      <div
        className="bg-[#F9FAFB] rounded-xl p-3 space-y-3 overflow-y-auto min-h-[200px] md:min-h-[500px]"
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
