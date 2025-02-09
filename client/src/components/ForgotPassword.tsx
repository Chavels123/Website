import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../lib/supabase';
import Input from './ui/Input';
import Button from './ui/Button';
import AuthLayout from './AuthLayout';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      toast.success('Password reset instructions sent to your email!');
      // Optionally redirect to a confirmation page
      onBackToLogin();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset instructions');
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you instructions to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md bg-red-50 p-4"
          >
            <div className="text-sm text-red-700">{error}</div>
          </motion.div>
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
          error={error}
        />

        <Button
          type="submit"
          isLoading={isLoading}
        >
          Send Reset Instructions
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            Back to Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
} 