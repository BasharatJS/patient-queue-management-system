// components/ui/Card.tsx
import { motion } from 'framer-motion'
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  )
}
