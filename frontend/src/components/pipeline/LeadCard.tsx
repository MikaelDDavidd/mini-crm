import { type Lead, LEAD_PRIORITY_LABELS } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Mail, Phone, Building2, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadCardProps {
  lead: Lead
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onClick?: () => void
}

export function LeadCard({ lead, isDragging, onDragStart, onDragEnd, onClick }: LeadCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'low':
        return 'gray'
      default:
        return 'default'
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-[#EAECF0] p-4 cursor-grab active:cursor-grabbing',
        'hover:shadow-md transition-shadow duration-200',
        'space-y-3',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[#101828] text-base font-semibold leading-tight flex-1">
          {lead.name}
        </h3>
        {lead.priority !== 'normal' && (
          <Badge variant={getPriorityColor(lead.priority)} size="sm">
            {LEAD_PRIORITY_LABELS[lead.priority]}
          </Badge>
        )}
      </div>

      {lead.company && (
        <div className="flex items-center gap-2 text-[#667085] text-sm">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{lead.company}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[#667085] text-sm">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-2 text-[#667085] text-sm">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
      </div>

      {lead.deal_value > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-[#EAECF0]">
          <DollarSign className="h-4 w-4 text-[#027A48]" />
          <span className="text-[#027A48] text-sm font-semibold">
            {formatCurrency(lead.deal_value)}
          </span>
        </div>
      )}

      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {lead.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="purple" size="sm">
              {tag}
            </Badge>
          ))}
          {lead.tags.length > 2 && (
            <Badge variant="gray" size="sm">
              +{lead.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
