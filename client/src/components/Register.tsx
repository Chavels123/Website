import { useState } from 'react'
import { UserPlusIcon } from '@heroicons/react/24/solid'
import { signUp, signInWithGoogle, signInWithGithub } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import AuthLayout from './AuthLayout'
import Input from './ui/Input'
import Button from './ui/Button'
import SocialButton from './ui/SocialButton'

interface RegisterProps {
  onToggleAuth: () => void;
}

export default function Register({ onToggleAuth }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    try {
      const { user } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      if (user) {
        toast.success('Account created successfully!')
        window.location.href = '/dashboard'
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create account')
      setErrors({ form: err instanceof Error ? err.message : 'Failed to create account' })
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
      title="Create your account"
      subtitle="Start your journey with us today"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.form}</div>
          </div>
        )}

        <Input
          id="name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          icon={<UserPlusIcon className="h-5 w-5" />}
        >
          Create account
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
          <span className="text-gray-600">Already have an account?</span>{' '}
          <button
            type="button"
            onClick={onToggleAuth}
            className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            Sign in
          </button>
        </div>
      </form>
    </AuthLayout>
  )
} 