// app/patient/queue-status/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { listenToPatientAppointments } from '@/lib/firebase/appointments'
import { listenToCurrentQueueNumber } from '@/lib/firebase/queue'
import { Appointment } from '@/lib/types/appointment'
import {
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

interface QueueStatus {
  currentNumber: number
  yourNumber: number
  estimatedWaitTime: string
  peopleAhead: number
  doctorName: string
  specialization: string
  status: 'waiting' | 'next' | 'current' | 'completed'
}

export default function QueueStatusPage() {
  const { isGuest, guestInfo } = useAuthStore()
  const router = useRouter()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentQueueNumber, setCurrentQueueNumber] = useState<number>(0)
  const [queueData, setQueueData] = useState<QueueStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  // Simplified Firebase listeners to avoid index issues
  useEffect(() => {
    if (!isGuest || !guestInfo) {
      router.push('/patient')
      return
    }

    setIsLoading(true)
    let unsubscribeAppointments: (() => void) | undefined
    let unsubscribeQueue: (() => void) | undefined

    const setupListeners = async () => {
      try {
        // Listen to patient's appointments with simplified query
        unsubscribeAppointments = listenToPatientAppointments(
          guestInfo.phone,
          (fetchedAppointments) => {
            console.log('Appointments received:', fetchedAppointments)
            setAppointments(fetchedAppointments)
            setLastUpdate(new Date())
            setError(null)
            
            if (fetchedAppointments.length === 0) {
              setQueueData(null)
              setIsLoading(false)
              return
            }

            // Get the most recent active appointment
            const activeAppointment = fetchedAppointments[0]
            
            // Listen to current queue number for this doctor
            if (unsubscribeQueue) {
              unsubscribeQueue()
            }
            
            unsubscribeQueue = listenToCurrentQueueNumber(
              activeAppointment.doctorId,
              (current) => {
                setCurrentQueueNumber(current)
                
                // Calculate queue status
                const yourNumber = activeAppointment.queueNumber
                const peopleAhead = Math.max(0, yourNumber - current)
                
                let status: 'waiting' | 'next' | 'current' | 'completed' = 'waiting'
                if (current === yourNumber) {
                  status = 'current'
                } else if (current === yourNumber - 1) {
                  status = 'next'
                } else if (activeAppointment.status === 'completed') {
                  status = 'completed'
                }
                
                const estimatedWaitTime = peopleAhead <= 0 ? 'Your turn!' :
                  peopleAhead === 1 ? '2-5 minutes' :
                  `${peopleAhead * 5}-${peopleAhead * 8} minutes`
                
                setQueueData({
                  currentNumber: current,
                  yourNumber,
                  estimatedWaitTime,
                  peopleAhead,
                  doctorName: activeAppointment.doctorName,
                  specialization: activeAppointment.specialization,
                  status,
                })
                
                setIsLoading(false)
              }
            )
          }
        )
      } catch (error) {
        console.error('Failed to setup queue listeners:', error)
        setError(error instanceof Error ? error.message : 'Failed to load queue status')
        setIsLoading(false)
      }
    }

    setupListeners()

    return () => {
      if (unsubscribeAppointments) unsubscribeAppointments()
      if (unsubscribeQueue) unsubscribeQueue()
    }
  }, [isGuest, guestInfo, router])

  const refreshStatus = async () => {
    // Data refreshes automatically via Firebase listeners
    // This is just for UI feedback
    setLastUpdate(new Date())
  }

  if (!isGuest) {
    return <LoadingSpinner />
  }

  if (isLoading && !queueData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600">Loading your queue status...</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
            <p className="text-red-700 font-medium">Error:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>
    )
  }

  if (!queueData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <Card className="p-8">
          <ExclamationCircleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Active Appointment
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have any active appointments in the queue.
          </p>
          <Button
            onClick={() => router.push('/patient/book-appointment')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Book an Appointment
          </Button>
        </Card>
      </motion.div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-blue-600 bg-blue-100'
      case 'next':
        return 'text-orange-600 bg-orange-100'
      case 'current':
        return 'text-green-600 bg-green-100'
      case 'completed':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting in Queue'
      case 'next':
        return "You're Next!"
      case 'current':
        return 'Your Turn Now!'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Queue Status</h1>
        <p className="text-gray-600">Real-time updates for your appointment</p>
      </motion.div>

      {/* Main Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                queueData.status
              )}`}
            >
              {queueData.status === 'current' && (
                <BellIcon className="w-4 h-4 mr-2" />
              )}
              {getStatusText(queueData.status)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                #{queueData.currentNumber}
              </div>
              <p className="text-gray-600">Current Number</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                #{queueData.yourNumber}
              </div>
              <p className="text-gray-600">Your Number</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {queueData.peopleAhead}
              </div>
              <p className="text-gray-600">People Ahead</p>
            </div>
          </div>

          {queueData.status === 'current' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                It's Your Turn!
              </h3>
              <p className="text-green-700">
                Please proceed to the doctor's chamber for your consultation.
              </p>
            </motion.div>
          )}

          {queueData.status === 'next' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6"
            >
              <BellIcon className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                You're Next!
              </h3>
              <p className="text-orange-700">
                Please be ready. Your turn is coming up very soon.
              </p>
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">Estimated Wait Time</p>
            <p className="text-2xl font-semibold text-gray-900 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 mr-2" />
              {queueData.estimatedWaitTime}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Doctor Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {queueData.doctorName}
                </p>
                <p className="text-blue-600">{queueData.specialization}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{guestInfo?.name}</p>
                <p className="text-gray-600">{guestInfo?.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={refreshStatus}
          variant="outline"
          size="lg"
          disabled={isLoading}
          className="flex items-center"
        >
          <ArrowPathIcon
            className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          {isLoading ? 'Refreshing...' : 'Refresh Status'}
        </Button>

        <Button
          onClick={() => router.push('/patient/book-appointment')}
          variant="outline"
          size="lg"
        >
          Book Another Appointment
        </Button>
      </motion.div>

      {/* Last Updated */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Status updates automatically in real-time
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Helpful Tips
          </h3>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>
                Your queue status updates automatically. No need to refresh
                constantly.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>Please arrive at the doctor's chamber when it's your turn.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>
                If you need to leave, please inform the receptionist to avoid
                delays for others.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p>
                Keep this page open to receive real-time updates about your
                appointment.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
