import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useCreateLead } from '@/hooks/useCreateLead'
import { useUpdateLead } from '@/hooks/useLeads'
import { leadSchema, type LeadFormData } from '@/lib/validations'
import {
  type Lead,
  type LeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_PRIORITY_LABELS,
} from '@/types'

interface AddLeadDrawerProps {
  isOpen: boolean
  onClose: () => void
  defaultStatus?: LeadStatus
  lead?: Lead | null
}

export function AddLeadDrawer({ isOpen, onClose, defaultStatus = 'new', lead }: AddLeadDrawerProps) {
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()
  const isEditMode = !!lead

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: defaultStatus,
      priority: 'normal',
      deal_value: 0,
    },
  })

  useEffect(() => {
    if (lead && isOpen) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        priority: lead.priority,
        source: lead.source || undefined,
        deal_value: lead.deal_value,
        tags: lead.tags.join(', '),
        notes: lead.notes || '',
      })
    } else if (!isOpen) {
      reset({
        status: defaultStatus,
        priority: 'normal',
        deal_value: 0,
      })
    }
  }, [lead, isOpen, reset, defaultStatus])

  const onSubmit = async (data: LeadFormData) => {
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

      if (isEditMode && lead) {
        await updateLead.mutateAsync({
          leadId: lead.id,
          data: {
            ...data,
            tags,
          },
        })
      } else {
        await createLead.mutateAsync({
          ...data,
          tags,
        })
      }

      reset()
      onClose()
    } catch (error) {
      console.error(isEditMode ? 'Failed to update lead:' : 'Failed to create lead:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const statusOptions = Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  const sourceOptions = [
    { value: '', label: 'Select source *' },
    ...Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  const priorityOptions = Object.entries(LEAD_PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title={isEditMode ? "Edit Lead" : "Add New Lead"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <Input
          label="Name *"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email *"
          type="email"
          placeholder="john@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="(11) 98765-4321"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Company"
          type="text"
          placeholder="Company Name"
          error={errors.company?.message}
          {...register('company')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status *"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />

          <Select
            label="Priority *"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register('priority')}
          />
        </div>

        <Select
          label="Source *"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source')}
        />

        <Input
          label="Deal Value (R$)"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          error={errors.deal_value?.message}
          {...register('deal_value')}
        />

        <Input
          label="Tags"
          type="text"
          placeholder="Enterprise, Hot Lead, Follow-up (comma separated)"
          error={errors.tags?.message}
          {...register('tags')}
        />

        <div>
          <label className="block text-sm font-medium text-[#101828] mb-1.5">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#EAECF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            rows={4}
            placeholder="Add any notes about this lead..."
            {...register('notes')}
          />
          {errors.notes && (
            <p className="mt-1.5 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#EAECF0]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            className="flex-1"
            disabled={createLead.isPending || updateLead.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
            isLoading={createLead.isPending || updateLead.isPending}
          >
            {isEditMode
              ? updateLead.isPending ? 'Updating...' : 'Update Lead'
              : createLead.isPending ? 'Creating...' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}
