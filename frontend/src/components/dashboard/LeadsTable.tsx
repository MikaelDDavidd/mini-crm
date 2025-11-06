import { type Lead } from '@/types'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface LeadsTableProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: 'bg-[#EEF4FF] text-[#3538CD]',
  contacted: 'bg-[#F2F4F7] text-[#344054]',
  qualified: 'bg-[#ECFDF3] text-[#027A48]',
  proposal: 'bg-[#FEF6FB] text-[#C11574]',
  won: 'bg-[#ECFDF3] text-[#027A48]',
  lost: 'bg-[#F2F4F7] text-[#667085]',
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-[#EAECF0]">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-[#EAECF0]">
          <tr>
            <th className="px-6 py-3 font-medium text-[#667085]" scope="col">
              Name
            </th>
            <th className="px-6 py-3 font-medium text-[#667085]" scope="col">
              Email
            </th>
            <th className="px-6 py-3 font-medium text-[#667085]" scope="col">
              Stage
            </th>
            <th className="px-6 py-3 font-medium text-[#667085]" scope="col">
              Source
            </th>
            <th className="px-6 py-3 font-medium text-[#667085]" scope="col">
              Date Added
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-[#667085]">
                No leads found. Create your first lead to get started.
              </td>
            </tr>
          ) : (
            leads.map((lead, index) => (
              <tr
                key={lead.id}
                className={cn(
                  'border-b border-[#EAECF0]',
                  index % 2 === 1 && 'bg-gray-50'
                )}
              >
                <td className="px-6 py-4 font-medium text-[#101828]">{lead.name}</td>
                <td className="px-6 py-4 text-[#667085]">{lead.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      statusColors[lead.status] || statusColors.new
                    )}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#667085] capitalize">
                  {lead.source?.replace('_', ' ') || 'N/A'}
                </td>
                <td className="px-6 py-4 text-[#667085]">{formatDate(lead.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
