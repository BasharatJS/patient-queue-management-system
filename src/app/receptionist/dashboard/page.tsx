// app/receptionist/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getAllDoctors } from '@/lib/firebase/doctors'
import { getCurrentQueueByDoctor } from '@/lib/firebase/queue'
import { Doctor } from '@/lib/types/auth'
import {
  UserPlusIcon,
  QueueListIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

// Interface for doctor statistics displayed on dashboard
interface DoctorStats {
  doctor: Doctor // Doctor information
  totalPatients: number // Total patients in queue today
  currentPatient: number // Queue number of current patient (0 if none)
  waitingPatients: number // Number of patients still waiting
  estimatedWaitTime: string // Calculated wait time for new patients
}

export default function ReceptionistDashboardPage() {
  const router = useRouter()
  const [doctorStats, setDoctorStats] = useState<DoctorStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [todayStats, setTodayStats] = useState({
    totalRegistrations: 0,
    completedAppointments: 0,
    activeQueues: 0,
    averageWaitTime: '0 min',
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  /**
   * Loads all dashboard data including doctor statistics and queue information
   * - Fetches all doctors from Firebase
   * - Gets queue statistics for each doctor
   * - Calculates today's overall statistics
   * - Updates component state with processed data
   */
  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Get all doctors
      const doctors = await getAllDoctors()

      // Get queue stats for each doctor
      const statsPromises = doctors.map(async (doctor) => {
        try {
          const queue = await getCurrentQueueByDoctor(doctor.id)
          const totalPatients = queue.length
          const currentPatient =
            queue.find((item) => item.status === 'current')?.queueNumber || 0
          const waitingPatients = queue.filter(
            (item) => item.status === 'waiting'
          ).length
          const estimatedWaitTime =
            waitingPatients === 0
              ? '0 min'
              : waitingPatients <= 2
              ? '10-20 min'
              : waitingPatients <= 4
              ? '20-35 min'
              : '35-50 min'

          return {
            doctor,
            totalPatients,
            currentPatient,
            waitingPatients,
            estimatedWaitTime,
          }
        } catch (error) {
          console.error(`Failed to get stats for doctor ${doctor.id}:`, error)
          return {
            doctor,
            totalPatients: 0,
            currentPatient: 0,
            waitingPatients: 0,
            estimatedWaitTime: '0 min',
          }
        }
      })

      const stats = await Promise.all(statsPromises)
      setDoctorStats(stats)

      // Calculate today's overall statistics from all doctors' queues
      // Aggregates data for dashboard overview cards
      const totalRegistrations = stats.reduce(
        (sum, stat) => sum + stat.totalPatients,
        0
      )
      const activeQueues = stats.filter(
        (stat) => stat.waitingPatients > 0
      ).length

      setTodayStats({
        totalRegistrations,
        completedAppointments: Math.floor(totalRegistrations * 0.6), // Mock calculation
        activeQueues,
        averageWaitTime: totalRegistrations > 0 ? '25 min' : '0 min',
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Quick action buttons configuration
  // Provides easy access to main receptionist functions
  const quickActions = [
    {
      title: 'Register New Patient',
      description: 'Add a new patient and book appointment',
      icon: UserPlusIcon,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => router.push('/receptionist/register-patient'),
    },
    {
      title: 'Manage Queue',
      description: 'View and manage doctor queues',
      icon: QueueListIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => router.push('/receptionist/queue-management'),
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Receptionist Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage patient registrations and monitor queue status
        </p>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-purple-600" />
            Today's Overview
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {todayStats.totalRegistrations}
              </div>
              <p className="text-blue-800 font-medium">Total Registrations</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {todayStats.completedAppointments}
              </div>
              <p className="text-green-800 font-medium">Completed</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {todayStats.activeQueues}
              </div>
              <p className="text-purple-800 font-medium">Active Queues</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {todayStats.averageWaitTime}
              </div>
              <p className="text-orange-800 font-medium">Avg. Wait Time</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
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
                  <div
                    onClick={action.action}
                    className="text-center space-y-4"
                  >
                    <div
                      className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto transition-colors`}
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
        </div>
      </motion.div>

      {/* Doctor Queue Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Doctor Queue Status
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorStats.map((stat, index) => (
            <motion.div
              key={stat.doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {stat.doctor.name}
                    </h3>
                    <p className="text-purple-600 text-sm">
                      {stat.doctor.specialization}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stat.doctor.isAvailable ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  ></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Current Number:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {stat.currentPatient === 0
                        ? '--'
                        : `#${stat.currentPatient}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Waiting:</span>
                    <span className="font-semibold text-orange-600">
                      {stat.waitingPatients} patients
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Est. Wait:</span>
                    <span className="text-sm text-gray-900">
                      {stat.estimatedWaitTime}
                    </span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          stat.doctor.isAvailable
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.doctor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Button
          onClick={loadDashboardData}
          variant="outline"
          size="lg"
          disabled={isLoading}
          className="flex items-center mx-auto"
        >
          <ClockIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </motion.div>
    </div>
  )
}
