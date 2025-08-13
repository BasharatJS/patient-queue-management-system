// app/patient/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ArrowLeftIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isGuest, guestInfo, clearGuest } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Home',
      href: '/patient',
      icon: HomeIcon,
    },
    {
      name: 'Book Appointment',
      href: '/patient/book-appointment',
      icon: ClockIcon,
    },
    {
      name: 'Queue Status',
      href: '/patient/queue-status',
      icon: ClockIcon,
    },
  ]

  const handleBackToHome = () => {
    clearGuest()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToHome}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </motion.button>
              <h1 className="text-xl font-semibold text-gray-900">
                Patient Portal
              </h1>
            </div>

            {isGuest && guestInfo && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  Welcome,{' '}
                  <span className="font-medium text-green-600">
                    {guestInfo.name}
                  </span>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">
                    {guestInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Navigation */}
      {isGuest && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 py-4">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href

                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Scrollable Main Content */}
      <main className={`flex-1 overflow-y-auto ${isGuest ? 'mt-32' : 'mt-16'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
