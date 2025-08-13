// components/landing/Hero.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  UserIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

export default function Hero() {
  const router = useRouter()

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book appointments and check queue status in real-time',
      icon: UserIcon,
      color: 'bg-gradient-to-r from-green-400 to-blue-500',
      textColor: 'text-green-600',
      borderColor: 'border-green-500',
      hoverColor: 'hover:bg-green-50',
      path: '/patient',
    },
    {
      id: 'receptionist',
      title: 'Receptionist',
      description: 'Manage patient registrations and queue efficiently',
      icon: UserGroupIcon,
      color: 'bg-gradient-to-r from-purple-400 to-pink-500',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500',
      hoverColor: 'hover:bg-purple-50',
      path: '/receptionist/login',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'View patient queue and manage consultations seamlessly',
      icon: ClipboardDocumentListIcon,
      color: 'bg-gradient-to-r from-orange-400 to-red-500',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-500',
      hoverColor: 'hover:bg-orange-50',
      path: '/doctor/login',
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  return (
    <section
      id="home"
      className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Welcome to Our
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              PQMS
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Streamline your healthcare experience with our intelligent queue
            management system. Choose your role to access personalized
            dashboards and features.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              ✨ Real-time Updates
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              🚀 Easy Booking
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              📱 Mobile Friendly
            </div>
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              🔒 Secure Access
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {roles.map((role, index) => {
            const IconComponent = role.icon

            return (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Card
                  className={`p-8 text-center cursor-pointer h-full border-2 transition-all duration-300 ${role.hoverColor} hover:shadow-xl hover:border-opacity-50 ${role.borderColor} border-opacity-20`}
                >
                  <div
                    onClick={() => router.push(role.path)}
                    className="flex flex-col items-center space-y-6"
                  >
                    {/* Icon with animated background */}
                    <div className="relative">
                      <div
                        className={`w-24 h-24 rounded-2xl ${role.color} flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform duration-300`}
                      >
                        <IconComponent className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                    </div>

                    <div>
                      <h3
                        className={`text-3xl font-bold ${role.textColor} mb-3 group-hover:scale-105 transition-transform duration-200`}
                      >
                        {role.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {role.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      className={`border-2 ${role.borderColor} ${role.textColor} ${role.hoverColor} hover:shadow-md transition-all duration-300 group-hover:scale-105`}
                    >
                      Continue as {role.title}
                      <span className="ml-2">→</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
