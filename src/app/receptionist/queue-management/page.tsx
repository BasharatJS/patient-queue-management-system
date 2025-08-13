// app/receptionist/queue-management/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getAllDoctors } from '@/lib/firebase/doctors'
import {
  getCurrentQueueByDoctor,
  updateQueueItemStatus,
  updateQueueItemStatusByAppointmentId,
  moveToNext,
} from '@/lib/firebase/queue'
import { updateAppointmentStatus } from '@/lib/firebase/appointments'
import { Doctor } from '@/lib/types/auth'
import {
  QueueListIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  UserIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

// Interface for individual queue items with patient information
interface QueueItem {
  id: string
  appointmentId: string
  patientName: string
  patientPhone?: string
  queueNumber: number
  status: 'waiting' | 'current' | 'completed' | 'skipped'
  estimatedTime: string
  problem?: string
}

// Interface for doctor's complete queue information
interface DoctorQueue {
  doctor: Doctor
  queue: QueueItem[]
  currentPatient: QueueItem | null
  waitingCount: number
}

export default function QueueManagementPage() {
  const [doctorQueues, setDoctorQueues] = useState<DoctorQueue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingQueue, setUpdatingQueue] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    loadQueueData()
    // Removed automatic interval to prevent continuous loading
    // Users can manually refresh using the refresh button
  }, [])

  // Auto-refresh effect (only when enabled)
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      if (!isLoading) {
        loadQueueData()
      }
    }, 30000) // 30 seconds interval when enabled

    return () => clearInterval(interval)
  }, [autoRefresh, isLoading])

  /**
   * Loads queue data for all doctors from Firebase
   * - Fetches all doctors from database
   * - Gets current queue for each doctor
   * - Calculates statistics and estimated wait times
   * - Updates component state with processed data
   */
  const loadQueueData = async () => {
    try {
      setIsLoading(true)
      setError('')

      const doctors = await getAllDoctors()

      const queuePromises = doctors.map(async (doctor) => {
        try {
          const queueData = await getCurrentQueueByDoctor(doctor.id)

          const queue: QueueItem[] = queueData.map((item: any) => ({
            id: item.id,
            appointmentId: item.appointmentId,
            patientName: item.patientName,
            patientPhone: item.patientPhone,
            queueNumber: item.queueNumber,
            status: item.status,
            estimatedTime: calculateEstimatedTime(item.queueNumber, queueData),
            problem: item.problem,
          }))

          const currentPatient =
            queue.find((item) => item.status === 'current') || null
          const waitingCount = queue.filter(
            (item) => item.status === 'waiting'
          ).length

          return {
            doctor,
            queue: queue.sort((a, b) => a.queueNumber - b.queueNumber),
            currentPatient,
            waitingCount,
          }
        } catch (error) {
          console.error(`Failed to load queue for doctor ${doctor.id}:`, error)
          return {
            doctor,
            queue: [],
            currentPatient: null,
            waitingCount: 0,
          }
        }
      })

      const queues = await Promise.all(queuePromises)
      setDoctorQueues(queues)

      // Auto-select first doctor if none selected
      if (!selectedDoctor && queues.length > 0) {
        setSelectedDoctor(queues[0].doctor.id)
      }

      // Update last refreshed timestamp
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load queue data:', error)
      setError('Failed to load queue data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Calculates estimated wait time for a patient based on queue position
   * @param queueNumber - The patient's position number in queue
   * @param queueData - Array of all queue items for the doctor
   * @returns Formatted wait time string (e.g., "10-15 min", "Next")
   */
  const calculateEstimatedTime = (queueNumber: number, queueData: any[]) => {
    const position = queueData.filter(
      (item) => item.status === 'waiting' && item.queueNumber < queueNumber
    ).length

    if (position === 0) return 'Next'
    if (position <= 2) return `${5 + position * 5}-${10 + position * 5} min`
    return `${15 + position * 5}-${25 + position * 5} min`
  }

  /**
   * Calls the next patient in queue for a specific doctor
   * - Updates queue status from 'waiting' to 'current'
   * - Moves previous patient to completed if applicable
   * - Refreshes queue data to reflect changes
   * @param doctorId - ID of the doctor whose queue to update
   */
  const handleCallNext = async (doctorId: string) => {
    setUpdatingQueue(doctorId)
    setError('')

    try {
      await moveToNext(doctorId)
      await loadQueueData() // Refresh data
    } catch (error) {
      console.error('Failed to call next patient:', error)
      setError('Failed to call next patient. Please try again.')
    } finally {
      setUpdatingQueue(null)
    }
  }

  /**
   * Marks current patient's appointment as completed
   * - Updates appointment status in appointments collection
   * - Updates queue item status to 'completed'
   * - Refreshes data to show updated queue state
   * @param doctorId - ID of the doctor
   * @param appointmentId - ID of the appointment to complete
   */
  const handleCompleteAppointment = async (
    doctorId: string,
    appointmentId: string
  ) => {
    setUpdatingQueue(doctorId)
    setError('')

    try {
      await updateAppointmentStatus(appointmentId, 'completed')
      await updateQueueItemStatusByAppointmentId(appointmentId, 'completed')
      await loadQueueData() // Refresh data
    } catch (error) {
      console.error('Failed to complete appointment:', error)
      setError('Failed to complete appointment. Please try again.')
    } finally {
      setUpdatingQueue(null)
    }
  }

  /**
   * Skips current patient (marks as 'skipped' without completing)
   * - Updates queue item status to 'skipped'
   * - Patient remains in queue but is no longer active
   * - Allows calling next patient while keeping record
   * @param doctorId - ID of the doctor
   * @param appointmentId - ID of the appointment to skip
   */
  const handleSkipPatient = async (doctorId: string, appointmentId: string) => {
    setUpdatingQueue(doctorId)
    setError('')

    try {
      await updateQueueItemStatusByAppointmentId(appointmentId, 'skipped')
      await loadQueueData() // Refresh data
    } catch (error) {
      console.error('Failed to skip patient:', error)
      setError('Failed to skip patient. Please try again.')
    } finally {
      setUpdatingQueue(null)
    }
  }

  const selectedQueue = doctorQueues.find(
    (dq) => dq.doctor.id === selectedDoctor
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-gray-600">Loading queue data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Queue Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage patient queues for all doctors
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Doctor Selection Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Doctor
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctorQueues.map((dq) => (
              <motion.button
                key={dq.doctor.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDoctor(dq.doctor.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDoctor === dq.doctor.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {dq.doctor.name}
                    </h4>
                    <p className="text-purple-600 text-sm">
                      {dq.doctor.specialization}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      dq.doctor.isAvailable ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  ></div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span
                      className={`font-medium ${
                        dq.currentPatient ? 'text-blue-600' : 'text-gray-800'
                      }`}
                    >
                      {dq.currentPatient
                        ? `#${dq.currentPatient.queueNumber}`
                        : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Waiting:</span>
                    <span className="text-orange-600 font-medium">
                      {dq.waitingCount}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Selected Doctor Queue */}
      {selectedQueue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Current Patient */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Current Patient - Dr. {selectedQueue.doctor.name}
              </h3>
              <div className="flex items-center space-x-4">
                {lastUpdated && (
                  <span className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-700">Auto-refresh (30s)</span>
                </label>
                <Button
                  onClick={loadQueueData}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <ClockIcon
                    className={`w-4 h-4 mr-2 ${
                      isLoading ? 'animate-spin' : ''
                    }`}
                  />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {selectedQueue.currentPatient ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-blue-900">
                      #{selectedQueue.currentPatient.queueNumber} -{' '}
                      {selectedQueue.currentPatient.patientName}
                    </h4>
                    {selectedQueue.currentPatient.patientPhone && (
                      <p className="text-blue-700 flex items-center mt-1">
                        <PhoneIcon className="w-4 h-4 mr-1" />
                        {selectedQueue.currentPatient.patientPhone}
                      </p>
                    )}
                    {selectedQueue.currentPatient.problem && (
                      <p className="text-blue-700 mt-2 text-sm">
                        <strong>Problem:</strong>{' '}
                        {selectedQueue.currentPatient.problem}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    In Progress
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() =>
                      handleCompleteAppointment(
                        selectedQueue.doctor.id,
                        selectedQueue.currentPatient!.appointmentId
                      )
                    }
                    variant="primary"
                    disabled={updatingQueue === selectedQueue.doctor.id}
                    className="bg-green-600 hover:bg-green-700 flex items-center"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                  <Button
                    onClick={() =>
                      handleSkipPatient(
                        selectedQueue.doctor.id,
                        selectedQueue.currentPatient!.appointmentId
                      )
                    }
                    variant="outline"
                    disabled={updatingQueue === selectedQueue.doctor.id}
                  >
                    Skip Patient
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">No current patient</p>
                {selectedQueue.waitingCount > 0 ? (
                  <Button
                    onClick={() => handleCallNext(selectedQueue.doctor.id)}
                    variant="primary"
                    disabled={updatingQueue === selectedQueue.doctor.id}
                    className="flex items-center mx-auto"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Call Next Patient
                  </Button>
                ) : (
                  <p className="text-gray-500">No patients waiting</p>
                )}
              </div>
            )}
          </Card>

          {/* Waiting Queue */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <QueueListIcon className="w-5 h-5 mr-2" />
                Waiting Queue ({selectedQueue.waitingCount} patients)
              </h3>
              {selectedQueue.waitingCount > 0 &&
                !selectedQueue.currentPatient && (
                  <Button
                    onClick={() => handleCallNext(selectedQueue.doctor.id)}
                    variant="primary"
                    disabled={updatingQueue === selectedQueue.doctor.id}
                    className="flex items-center"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Call Next
                  </Button>
                )}
            </div>

            {selectedQueue.queue.filter((item) => item.status === 'waiting')
              .length > 0 ? (
              <div className="space-y-3">
                {selectedQueue.queue
                  .filter((item) => item.status === 'waiting')
                  .map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-orange-600">
                            #{patient.queueNumber}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {patient.patientName}
                          </h4>
                          {patient.patientPhone && (
                            <p className="text-gray-600 text-sm flex items-center">
                              <PhoneIcon className="w-3 h-3 mr-1" />
                              {patient.patientPhone}
                            </p>
                          )}
                          {patient.problem && (
                            <p className="text-gray-600 text-sm mt-1">
                              <strong>Problem:</strong> {patient.problem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{patient.estimatedTime}</span>
                        </div>
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Waiting
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <QueueListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No patients in queue</p>
              </div>
            )}
          </Card>

          {/* Completed Today */}
          {selectedQueue.queue.filter((item) => item.status === 'completed')
            .length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                Completed Today (
                {
                  selectedQueue.queue.filter(
                    (item) => item.status === 'completed'
                  ).length
                }
                )
              </h3>

              <div className="space-y-2">
                {selectedQueue.queue
                  .filter((item) => item.status === 'completed')
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            #{patient.queueNumber}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-green-900">
                            {patient.patientName}
                          </p>
                          {patient.patientPhone && (
                            <p className="text-green-700 text-sm">
                              {patient.patientPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {doctorQueues.reduce((sum, dq) => sum + dq.queue.length, 0)}
              </div>
              <p className="text-blue-800 text-sm">Total Patients</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {doctorQueues.reduce((sum, dq) => sum + dq.waitingCount, 0)}
              </div>
              <p className="text-orange-800 text-sm">Currently Waiting</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {doctorQueues.reduce(
                  (sum, dq) =>
                    sum +
                    dq.queue.filter((item) => item.status === 'completed')
                      .length,
                  0
                )}
              </div>
              <p className="text-green-800 text-sm">Completed</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {doctorQueues.filter((dq) => dq.doctor.isAvailable).length}
              </div>
              <p className="text-purple-800 text-sm">Available Doctors</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
