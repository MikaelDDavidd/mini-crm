import { format } from 'date-fns'
import { Phone, Mail, Calendar, FileText, ArrowRightLeft } from 'lucide-react'
import { type LeadInteraction, type InteractionType, INTERACTION_TYPE_LABELS } from '@/types'

interface InteractionTimelineProps {
  interactions: (LeadInteraction & { created_by_profile: { full_name: string; email: string } })[]
}

const interactionIcons: Record<InteractionType, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  status_change: ArrowRightLeft,
}

const interactionColors: Record<InteractionType, string> = {
  call: 'bg-blue-100 text-blue-700',
  email: 'bg-green-100 text-green-700',
  meeting: 'bg-purple-100 text-purple-700',
  note: 'bg-orange-100 text-orange-700',
  status_change: 'bg-gray-100 text-gray-700',
}

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 text-[#667085]">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No interactions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction, index) => {
        const Icon = interactionIcons[interaction.type]
        const isLast = index === interactions.length - 1

        return (
          <div key={interaction.id} className="relative flex gap-3">
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-[#EAECF0]" />
            )}

            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${interactionColors[interaction.type]}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-[#101828] text-sm font-medium">
                    {INTERACTION_TYPE_LABELS[interaction.type]}
                  </p>
                  <p className="text-[#667085] text-xs">
                    {interaction.created_by_profile.full_name || interaction.created_by_profile.email}
                  </p>
                </div>
                <span className="text-[#667085] text-xs whitespace-nowrap">
                  {format(new Date(interaction.created_at), 'MMM dd, HH:mm')}
                </span>
              </div>

              <p className="text-[#667085] text-sm whitespace-pre-wrap">
                {interaction.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
