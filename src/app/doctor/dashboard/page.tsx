// app/doctor/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { updateDoctorAvailability } from '@/lib/firebase/doctors'
import { 
  listenToQueue, 
  moveToNext, 
  updateQueueItemStatus,
  getCurrentQueueNumber 
} from '@/lib/firebase/queue'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { QueueItem } from '@/lib/types/queue'
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  ClockIcon,
  UserGroupIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

export default function DoctorDashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [isAvailable, setIsAvailable] = useState(false)
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [currentQueueNumber, setCurrentQueueNumber] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Listen to queue updates
  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = listenToQueue(user.id, (queue) => {
      setQueueItems(queue)
      setIsLoading(false)
    })

    return unsubscribe
  }, [user?.id])

  // Get current queue number
  useEffect(() => {
    if (!user?.id) return

    const fetchCurrentNumber = async () => {
      try {
        const number = await getCurrentQueueNumber(user.id)
        setCurrentQueueNumber(number)
      } catch (error) {
        console.error('Error fetching current queue number:', error)
      }
    }

    fetchCurrentNumber()
  }, [user?.id, queueItems])

  const handleAvailabilityToggle = async () => {
    if (!user?.id) return

    try {
      const newAvailability = !isAvailable
      await updateDoctorAvailability(user.id, newAvailability)
      setIsAvailable(newAvailability)
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleMoveToNext = async () => {
    if (!user?.id || isProcessing) return

    setIsProcessing(true)
    try {
      const nextPatient = await moveToNext(user.id)
      if (nextPatient) {
        setCurrentQueueNumber(nextPatient.queueNumber)
      }
    } catch (error) {
      console.error('Error moving to next patient:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSkipPatient = async (queueId: string) => {
    try {
      await updateQueueItemStatus(queueId, 'skipped')
    } catch (error) {
      console.error('Error skipping patient:', error)
    }
  }

  const handleStartConsultation = (patientId: string) => {
    router.push(`/doctor/consultation/${patientId}`)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const waitingPatients = queueItems.filter(item => item.status === 'waiting')
  const currentPatient = queueItems.find(item => item.status === 'current')
  const completedToday = queueItems.filter(item => item.status === 'completed').length
  const skippedToday = queueItems.filter(item => item.status === 'skipped').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your patient queue efficiently</p>
        </div>
        
        {/* Availability Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleAvailabilityToggle}
            className={`flex items-center space-x-2 px-6 py-3 ${
              isAvailable 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isAvailable ? (
              <>
                <PauseIcon className="w-5 h-5" />
                <span>Go Offline</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-5 h-5" />
                <span>Go Online</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Current Number</p>
                <p className="text-2xl font-bold text-blue-900">
                  {currentQueueNumber || 'None'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-900">{waitingPatients.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-900">{completedToday}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gray-50 border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <XMarkIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skipped Today</p>
                <p className="text-2xl font-bold text-gray-900">{skippedToday}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Current Patient Section */}
      {currentPatient ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Current Patient
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">
                      {currentPatient.patientName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-blue-600">Queue #</span>
                    <span className="font-bold text-blue-800 ml-1">
                      {currentPatient.queueNumber}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleStartConsultation(currentPatient.appointmentId)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Start Consultation</span>
                </Button>
                <Button
                  onClick={() => handleSkipPatient(currentPatient.id)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Skip
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 text-center">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Current Patient
            </h3>
            <p className="text-gray-600 mb-4">
              {waitingPatients.length > 0 
                ? 'Call the next patient when ready' 
                : 'No patients in queue'}
            </p>
            {waitingPatients.length > 0 && (
              <Button
                onClick={handleMoveToNext}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ForwardIcon className="w-4 h-4" />
                )}
                <span>Call Next Patient</span>
              </Button>
            )}
          </Card>
        </motion.div>
      )}

      {/* Queue List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Patient Queue ({waitingPatients.length} waiting)
          </h3>
          
          {waitingPatients.length === 0 ? (
            <div className="text-center py-8">
              <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients waiting in queue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {patient.queueNumber}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.patientName}</p>
                      <p className="text-sm text-gray-600">
                        Added: {patient.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleSkipPatient(patient.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Skip
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Call Next Button */}
          {waitingPatients.length > 0 && !currentPatient && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleMoveToNext}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 mx-auto"
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ForwardIcon className="w-4 h-4" />
                )}
                <span>Call Next Patient</span>
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}