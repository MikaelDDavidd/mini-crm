import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn(
            'h-5 w-5 rounded border-gray-300 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-custom-text-dark text-base font-normal leading-normal cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
