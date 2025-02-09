import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children" | "onClick"> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ 
  children, 
  isLoading, 
  variant = 'primary', 
  icon,
  className = '',
  onClick,
  ...props 
}: ButtonProps) {
  const baseStyles = 'relative flex justify-center items-center px-4 py-2.5 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isLoading ? 'cursor-not-allowed opacity-90 min-h-[44px]' : ''
      }`}
      disabled={isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-12 h-12 -my-2">
            {/* Outer spinning circle */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg
                className="w-full h-full text-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.83a1 1 0 00-2 0V4a6 6 0 00-6 6h2zm2 5.17V16a6 6 0 006-6h-2a4 4 0 01-4 4v1.17z"
                />
              </svg>
            </motion.div>
            
            {/* Inner pulsing circle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="w-5 h-5 bg-current rounded-full opacity-50" />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span>{children}</span>
        </div>
      )}
    </motion.button>
  );
} 