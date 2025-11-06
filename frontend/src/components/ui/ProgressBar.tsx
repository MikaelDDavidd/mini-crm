import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  label?: string
  className?: string
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, label, className }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-gray-900">{label}</p>}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
