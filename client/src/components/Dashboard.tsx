import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUser, signOut } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getUser();
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else if (user?.email) {
          // If name is not available, use the part of email before @
          setUserName(user.email.split('@')[0]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Successfully logged out!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900"
              >
                Hello, {userName}!
              </motion.h1>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleLogout}
                disabled={isLoading}
                className={`
                  inline-flex items-center px-4 py-2 border border-transparent 
                  text-sm font-medium rounded-md shadow-sm text-white 
                  bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-red-500 transition-colors
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : null}
                {isLoading ? 'Logging out...' : 'Logout'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 