import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Mail,
  Phone,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Award,
  Plus,
} from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { InteractionTimeline } from './InteractionTimeline'
import {
  useLeadInteractions,
  useAddInteraction,
  useUpdateLeadNotes,
  useDeleteLead,
} from '@/hooks/useLeadDetails'
import {
  type Lead,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_PRIORITY_LABELS,
} from '@/types'

interface LeadDetailDrawerProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (lead: Lead) => void
}

export function LeadDetailDrawer({ lead, isOpen, onClose, onEdit }: LeadDetailDrawerProps) {
  const [notes, setNotes] = useState(lead?.notes || '')
  const [newInteraction, setNewInteraction] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '')
    }
  }, [lead])

  const { data: interactions = [], isLoading: loadingInteractions } = useLeadInteractions(
    lead?.id || ''
  )
  const addInteraction = useAddInteraction()
  const updateNotes = useUpdateLeadNotes()
  const deleteLead = useDeleteLead()

  if (!lead) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray'> = {
      new: 'purple',
      contacted: 'default',
      qualified: 'warning',
      proposal: 'info',
      negotiation: 'warning',
      won: 'success',
      lost: 'gray',
    }
    return colors[status] || 'default'
  }

  const handleSaveNotes = async () => {
    try {
      await updateNotes.mutateAsync({ leadId: lead.id, notes })
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  const handleAddNote = async () => {
    if (!newInteraction.trim()) return

    try {
      await addInteraction.mutateAsync({
        leadId: lead.id,
        type: 'note',
        description: newInteraction,
      })
      setNewInteraction('')
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteLead.mutateAsync(lead.id)
      setShowDeleteConfirm(false)
      onClose()
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Lead Details" size="xl">
      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-2xl font-bold text-[#101828]">{lead.name}</h3>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(lead.status)}>
                {LEAD_STATUS_LABELS[lead.status]}
              </Badge>
              {lead.is_active && <Badge variant="success">Active</Badge>}
            </div>
          </div>

          {lead.priority !== 'normal' && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#7B61FF]" />
              <span className="text-sm font-medium text-[#7B61FF]">
                {LEAD_PRIORITY_LABELS[lead.priority]}
              </span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-3 pb-6 border-b border-[#EAECF0]">
          <div className="flex items-center gap-3 text-[#667085]">
            <Mail className="h-5 w-5 flex-shrink-0" />
            <a href={`mailto:${lead.email}`} className="hover:text-primary">
              {lead.email}
            </a>
          </div>

          {lead.phone && (
            <div className="flex items-center gap-3 text-[#667085]">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <a href={`tel:${lead.phone}`} className="hover:text-primary">
                {lead.phone}
              </a>
            </div>
          )}

          {lead.company && (
            <div className="flex items-center gap-3 text-[#667085]">
              <Building2 className="h-5 w-5 flex-shrink-0" />
              <span>{lead.company}</span>
            </div>
          )}
        </div>

        {/* Deal Info */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#EAECF0]">
          <div>
            <p className="text-xs text-[#667085] mb-1">Deal Value</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#027A48]" />
              <p className="text-lg font-semibold text-[#027A48]">
                {formatCurrency(lead.deal_value)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#667085] mb-1">Source</p>
            <p className="text-sm font-medium text-[#101828]">
              {lead.source ? LEAD_SOURCE_LABELS[lead.source] : 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#667085] mb-1">Created</p>
            <div className="flex items-center gap-2 text-sm text-[#101828]">
              <Calendar className="h-4 w-4" />
              {format(new Date(lead.created_at), 'MMM dd, yyyy')}
            </div>
          </div>

          <div>
            <p className="text-xs text-[#667085] mb-1">Last Activity</p>
            <div className="flex items-center gap-2 text-sm text-[#101828]">
              <Clock className="h-4 w-4" />
              {format(new Date(lead.last_activity_at), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="pb-6 border-b border-[#EAECF0]">
            <p className="text-sm font-medium text-[#101828] mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="purple">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="pb-6 border-b border-[#EAECF0]">
          <p className="text-sm font-medium text-[#101828] mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-[#EAECF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            rows={4}
            placeholder="Add notes about this lead..."
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveNotes}
              disabled={updateNotes.isPending}
            >
              {updateNotes.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>

        {/* Add Interaction */}
        <div className="pb-6 border-b border-[#EAECF0]">
          <p className="text-sm font-medium text-[#101828] mb-2">Add Note</p>
          <textarea
            value={newInteraction}
            onChange={(e) => setNewInteraction(e.target.value)}
            className="w-full px-3 py-2 border border-[#EAECF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            rows={3}
            placeholder="Describe the interaction or add a note..."
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNote}
              disabled={addInteraction.isPending || !newInteraction.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {addInteraction.isPending ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </div>

        {/* Interaction History */}
        <div>
          <p className="text-sm font-medium text-[#101828] mb-4">Interaction History</p>
          {loadingInteractions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <InteractionTimeline interactions={interactions} />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-[#EAECF0]">
          <Button
            variant="outline"
            size="md"
            className="flex-1 gap-2"
            onClick={() => onEdit?.(lead)}
          >
            <Edit className="h-4 w-4" />
            Edit Lead
          </Button>
          <Button
            variant="outline"
            size="md"
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone and all associated interactions will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLead.isPending}
        variant="danger"
      />
    </Drawer>
  )
}
