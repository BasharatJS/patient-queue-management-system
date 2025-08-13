// components/ui/LoadingSpinner.tsx
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  const containerClasses = size === 'sm' 
    ? 'flex justify-center items-center' 
    : 'flex justify-center items-center min-h-screen'

  return (
    <div className={`${containerClasses} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full`}
      />
    </div>
  )
}
