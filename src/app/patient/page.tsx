// # Patient dashboard
// app/patient/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function PatientPage() {
  const { isGuest, guestInfo, setGuest } = useAuthStore()
  const router = useRouter()

  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestForm.name.trim() || !guestForm.phone.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setGuest({
      name: guestForm.name.trim(),
      phone: guestForm.phone.trim(),
    })
    setIsSubmitting(false)
  }

  const quickActions = [
    {
      title: 'Book New Appointment',
      description: 'Schedule an appointment with available doctors',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => router.push('/patient/book-appointment'),
    },
    {
      title: 'Check Queue Status',
      description: 'View current queue position and waiting time',
      icon: ClockIcon,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => router.push('/patient/queue-status'),
    },
  ]

  // Guest Login Form
  if (!isGuest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Patient Access
            </h2>
            <p className="text-gray-600">
              Enter your details to continue as a guest patient
            </p>
          </div>

          <form onSubmit={handleGuestLogin} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={guestForm.name}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={guestForm.phone}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              {isSubmitting ? 'Verifying...' : 'Continue as Guest'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Guest Access
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  No account required. Your information is used only for
                  appointment booking and queue management.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Main Patient Dashboard
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {guestInfo?.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          What would you like to do today?
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
      >
        {quickActions.map((action, index) => {
          const IconComponent = action.icon

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card hover className="p-6 cursor-pointer h-full">
                <div onClick={action.action} className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto transition-colors ${action.hoverColor}`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>

                  <Button variant="outline" size="lg" className="w-full">
                    Get Started
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Patient Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
            Your Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{guestInfo?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{guestInfo?.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Hospital Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Services
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                service: 'General Medicine',
                doctors: 2,
                waitTime: '15-30 min',
              },
              { service: 'Cardiology', doctors: 1, waitTime: '30-45 min' },
              { service: 'Dermatology', doctors: 1, waitTime: '20-40 min' },
              { service: 'Orthopedics', doctors: 1, waitTime: '25-35 min' },
              { service: 'Pediatrics', doctors: 1, waitTime: '15-25 min' },
              { service: 'ENT', doctors: 1, waitTime: '20-30 min' },
            ].map((service, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-100"
              >
                <h4 className="font-medium text-gray-900 mb-2">
                  {service.service}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    {service.doctors} Doctor{service.doctors > 1 ? 's' : ''}{' '}
                    Available
                  </p>
                  <p>Avg. Wait: {service.waitTime}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
