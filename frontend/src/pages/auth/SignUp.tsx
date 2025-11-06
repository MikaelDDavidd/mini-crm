import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { signUpSchema, type SignUpFormData } from '@/lib/validations'

export function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  })

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true)
      setError('')
      await signUp(data.email, data.password, data.fullName)
      navigate('/login')
    } catch (err: any) {
      console.error('SignUp Error:', err)

      if (err.message?.includes('500')) {
        setError('Database not configured. Please run the SQL script in Supabase first. Check RODAR_SQL_AGORA.md')
      } else if (err.message?.includes('already registered')) {
        setError('This email is already registered. Try logging in instead.')
      } else {
        setError(err.message || 'Error creating account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#9C88FF] to-[#7B61FF] p-4 font-display">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>

          <h1 className="text-custom-text-dark text-[32px] font-bold leading-tight tracking-tight text-center">
            Create Account
          </h1>

          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User size={24} />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={24} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                icon={<Lock size={24} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <PasswordStrength password={password} />
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<Lock size={24} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              {!errors.confirmPassword && confirmPassword && password !== confirmPassword && (
                <p className="mt-2 text-sm text-red-500">✗ Passwords don't match</p>
              )}
              {!errors.confirmPassword && confirmPassword && password === confirmPassword && password.length > 0 && (
                <p className="mt-2 text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              Sign Up
            </Button>

            <p className="text-center text-base text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
