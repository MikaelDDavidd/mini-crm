import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type Lead, LEAD_SOURCE_LABELS } from '@/types'

interface LeadsBySourceChartProps {
  leads: Lead[]
}

export function LeadsBySourceChart({ leads }: LeadsBySourceChartProps) {
  const chartData = useMemo(() => {
    const sourceCounts = leads.reduce((acc, lead) => {
      const source = lead.source || 'other'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(sourceCounts).map(([source, count]) => ({
      name: LEAD_SOURCE_LABELS[source as keyof typeof LEAD_SOURCE_LABELS],
      leads: count
    }))
  }, [leads])

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-6">
      <h3 className="text-lg font-semibold text-[#101828] mb-4">
        Leads by Source
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" />
          <XAxis
            dataKey="name"
            stroke="#667085"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#667085"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #EAECF0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Bar
            dataKey="leads"
            fill="#7F56D9"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
