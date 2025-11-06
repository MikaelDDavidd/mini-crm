import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-blue-50 text-blue-700 border-blue-200',
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-orange-50 text-orange-700 border-orange-200',
      error: 'bg-red-50 text-red-700 border-red-200',
      info: 'bg-sky-50 text-sky-700 border-sky-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
