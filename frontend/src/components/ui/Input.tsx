import { type InputHTMLAttributes, forwardRef, type ReactNode, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="flex w-full flex-col">
        {label && (
          <label className="text-custom-text-dark text-base font-medium leading-normal pb-2">
            {label}
          </label>
        )}
        <div className={cn(
          "relative flex w-full flex-1 items-center rounded-lg bg-custom-input-bg transition-all",
          "focus-within:ring-2 focus-within:ring-primary",
          error && 'ring-2 ring-red-500'
        )}>
          {icon && (
            <div className="text-custom-placeholder flex items-center justify-center pl-4">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-custom-text-dark focus:outline-none border-none bg-transparent h-14 placeholder:text-custom-placeholder text-base font-normal leading-normal',
              icon ? 'pl-2 pr-4' : 'px-4',
              isPassword ? 'pr-12' : icon ? 'pr-4' : 'pr-4',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-custom-placeholder hover:text-custom-text-dark transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
