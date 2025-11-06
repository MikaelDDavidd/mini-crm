import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: FC<{ className?: string }>
  label: string
  value: string | number
  iconColor?: string
}

export function StatsCard({ icon: Icon, label, value, iconColor = 'text-[#7F56D9]' }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl p-6 border border-[#EAECF0] bg-white">
      <Icon className={cn('h-6 w-6', iconColor)} />
      <p className="text-[#667085] text-sm font-medium">{label}</p>
      <p className="text-[#101828] tracking-light text-3xl font-semibold">{value}</p>
    </div>
  )
}
