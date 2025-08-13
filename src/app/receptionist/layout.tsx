// app/receptionist/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserPlusIcon,
  QueueListIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Authentication guard - ensures only receptionist users can access these pages
  // Redirects to login page if user is not authenticated or not a receptionist
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'receptionist')) {
      if (pathname !== '/receptionist/login') {
        router.push('/receptionist/login')
      }
    }
  }, [user, isLoading, router, pathname])

  // Navigation menu configuration for receptionist portal
  // Defines main sections: Dashboard, Patient Registration, Queue Management
  const navigation = [
    {
      name: 'Dashboard',
      href: '/receptionist/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Register Patient',
      href: '/receptionist/register-patient',
      icon: UserPlusIcon,
    },
    {
      name: 'Queue Management',
      href: '/receptionist/queue-management',
      icon: QueueListIcon,
    },
  ]

  /**
   * Handles user logout process
   * - Clears authentication state
   * - Redirects to home page
   */
  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Show loading spinner while verifying authentication status
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Allow login page to be shown for non-authenticated users
  // All other pages will be protected by the authentication guard above
  if (!user || user.role !== 'receptionist') {
    return children
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Receptionist Portal
                </h1>
                <p className="text-sm text-gray-500">Patient Management System</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome,{' '}
                <span className="font-medium text-purple-600">
                  {user.name}
                </span>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation */}
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
                      ? 'bg-purple-100 text-purple-700 font-medium'
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

      {/* Scrollable Main Content */}
      <main className="flex-1 mt-32 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}