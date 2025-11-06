import { cn } from '@/lib/utils'
import { getPasswordStrength } from '@/lib/validations'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getPasswordStrength(password)

  if (!password) return null

  const percentage = (score / 6) * 100

  return (
    <div className="mt-2 space-y-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && (
        <p className="text-sm text-gray-600">
          Password strength: <span className="font-medium">{label}</span>
        </p>
      )}
      <div className="text-xs text-gray-500 space-y-1">
        <p className={cn(password.length >= 8 ? 'text-green-600' : '')}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </p>
        <p className={cn(/[A-Z]/.test(password) ? 'text-green-600' : '')}>
          {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
        </p>
        <p className={cn(/[a-z]/.test(password) ? 'text-green-600' : '')}>
          {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
        </p>
        <p className={cn(/[0-9]/.test(password) ? 'text-green-600' : '')}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </p>
      </div>
    </div>
  )
}
