import { Search, Calendar, User, Plus, X } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { type LeadStatus, type LeadSource, LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from '@/types'

type DateFilter = '7days' | '30days' | '90days' | 'all'
type OwnerFilter = 'me' | 'all'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedStatus: LeadStatus | 'all'
  onStatusChange: (value: LeadStatus | 'all') => void
  selectedSource: LeadSource | 'all'
  onSourceChange: (value: LeadSource | 'all') => void
  dateFilter: DateFilter
  onDateFilterChange: (value: DateFilter) => void
  ownerFilter: OwnerFilter
  onOwnerFilterChange: (value: OwnerFilter) => void
  onAddLead: () => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedSource,
  onSourceChange,
  dateFilter,
  onDateFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  onAddLead,
}: FilterBarProps) {
  const statusOptions = [
    { value: 'all', label: 'All Stages' },
    ...Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    ...Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ]

  const ownerOptions = [
    { value: 'all', label: 'All Owners' },
    { value: 'me', label: 'My Leads' },
  ]

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedStatus !== 'all' ||
    selectedSource !== 'all' ||
    dateFilter !== 'all' ||
    ownerFilter !== 'all'

  const clearAllFilters = () => {
    onSearchChange('')
    onStatusChange('all')
    onSourceChange('all')
    onDateFilterChange('all')
    onOwnerFilterChange('all')
  }

  return (
    <div className="bg-white border-b border-[#EAECF0] px-6 py-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#667085]" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#EAECF0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* All Stages */}
        <div className="w-[160px]">
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus | 'all')}
          />
        </div>

        {/* Source */}
        <div className="w-[160px]">
          <Select
            options={sourceOptions}
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value as LeadSource | 'all')}
          />
        </div>

        {/* Date Range */}
        <div className="w-[160px]">
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
          />
        </div>

        {/* Owner */}
        <div className="w-[140px]">
          <Select
            options={ownerOptions}
            value={ownerFilter}
            onChange={(e) => onOwnerFilterChange(e.target.value as OwnerFilter)}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}

        {/* New Lead Button */}
        <Button
          variant="primary"
          size="md"
          onClick={onAddLead}
          className="ml-auto gap-2"
        >
          <Plus className="h-5 w-5" />
          New Lead
        </Button>
      </div>
    </div>
  )
}
