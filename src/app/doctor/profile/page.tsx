// app/doctor/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { updateDoctorAvailability, getDoctorById } from '@/lib/firebase/doctors'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Doctor } from '@/lib/types/auth'
import {
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

export default function DoctorProfilePage() {
  const { user } = useAuthStore()
  const [doctorData, setDoctorData] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user?.id) return

      try {
        const doctor = await getDoctorById(user.id)
        setDoctorData(doctor)
      } catch (error) {
        console.error('Error fetching doctor data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctorData()
  }, [user?.id])

  const handleAvailabilityToggle = async () => {
    if (!doctorData) return

    setIsUpdating(true)
    try {
      const newAvailability = !doctorData.isAvailable
      await updateDoctorAvailability(doctorData.id, newAvailability)
      setDoctorData({ ...doctorData, isAvailable: newAvailability })
    } catch (error) {
      console.error('Error updating availability:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!doctorData) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {doctorData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Dr. {doctorData.name}
                </h2>
                <p className="text-lg text-blue-600 font-medium">
                  {doctorData.specialization}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${
                    doctorData.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    doctorData.isAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {doctorData.isAvailable ? 'Available' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{doctorData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{doctorData.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {doctorData.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{doctorData.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Availability Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Availability Status
            </h3>
            
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                doctorData.isAvailable ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {doctorData.isAvailable ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircleIcon className="w-8 h-8 text-red-600" />
                )}
              </div>
              <p className={`text-lg font-semibold ${
                doctorData.isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                {doctorData.isAvailable ? 'Currently Available' : 'Currently Offline'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {doctorData.isAvailable 
                  ? 'Patients can book appointments with you'
                  : 'No new appointments will be accepted'
                }
              </p>
            </div>

            <Button
              onClick={handleAvailabilityToggle}
              disabled={isUpdating}
              className={`w-full flex items-center justify-center space-x-2 ${
                doctorData.isAvailable
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isUpdating ? (
                <LoadingSpinner size="sm" />
              ) : doctorData.isAvailable ? (
                <XCircleIcon className="w-4 h-4" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              <span>
                {doctorData.isAvailable ? 'Go Offline' : 'Go Online'}
              </span>
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Statistics & Activity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Patients Today</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Consultations</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Avg. Wait Time</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent activity to display</p>
            <p className="text-sm text-gray-500 mt-2">
              Your consultation history will appear here
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}