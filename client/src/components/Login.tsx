import { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { signIn, signInWithGoogle, signInWithGithub } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import AuthLayout from './AuthLayout'
import Input from './ui/Input'
import Button from './ui/Button'
import SocialButton from './ui/SocialButton'

interface LoginProps {
  onToggleAuth: () => void;
  onForgotPassword: () => void;
}

export default function Login({ onToggleAuth, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const { user } = await signIn({ email, password })
      if (user) {
        toast.success('Successfully signed in!')
        window.location.href = '/dashboard'
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign in')
      setErrors({ form: err instanceof Error ? err.message : 'Failed to sign in' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Successfully signed in with Google!')
    } catch (err) {
      toast.error('Failed to sign in with Google')
    }
  }

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub()
      toast.success('Successfully signed in with GitHub!')
    } catch (err) {
      toast.error('Failed to sign in with GitHub')
    }
  }

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Please sign in to your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.form}</div>
          </div>
        )}
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          icon={<LockClosedIcon className="h-5 w-5" />}
        >
          Sign in
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton provider="google" onClick={handleGoogleSignIn} />
          <SocialButton provider="github" onClick={handleGithubSignIn} />
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <button
            type="button"
            onClick={onToggleAuth}
            className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            Register now
          </button>
        </div>
      </form>
    </AuthLayout>
  )
} 