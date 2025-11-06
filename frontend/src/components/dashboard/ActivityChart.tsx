import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type Lead } from '@/types'

interface ActivityChartProps {
  leads: Lead[]
}

export function ActivityChart({ leads }: ActivityChartProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })

    return last7Days.map(date => {
      const dayStart = new Date(date)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const count = leads.filter(lead => {
        const leadDate = new Date(lead.created_at)
        return leadDate >= dayStart && leadDate <= dayEnd
      }).length

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leads: count
      }
    })
  }, [leads])

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] p-6">
      <h3 className="text-lg font-semibold text-[#101828] mb-4">
        Activity (Last 7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7F56D9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7F56D9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" />
          <XAxis
            dataKey="date"
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
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#7F56D9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLeads)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
