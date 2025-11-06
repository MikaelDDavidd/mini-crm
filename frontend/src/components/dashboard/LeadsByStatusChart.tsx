import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { type Lead, LEAD_STATUS_LABELS } from '@/types'

interface LeadsByStatusChartProps {
  leads: Lead[]
}

const COLORS = {
  new: '#8B5CF6',
  contacted: '#3B82F6',
  qualified: '#F59E0B',
  proposal: '#10B981',
  negotiation: '#F97316',
  won: '#059669',
  lost: '#6B7280',
}

export function LeadsByStatusChart({ leads }: LeadsByStatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS],
      value: count,
      color: COLORS[status as keyof typeof COLORS]
    }))
  }, [leads])

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-6">
      <h3 className="text-lg font-semibold text-[#101828] mb-4">
        Leads by Stage
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #EAECF0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
