import { motion, HTMLMotionProps } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface InputProps extends Omit<HTMLMotionProps<"input">, "onFocus" | "onBlur"> {
  label: string;
  error?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function Input({ label, error, onFocus, onBlur, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
            appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 
            transition-colors duration-200
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
          `}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </motion.div>
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
} 