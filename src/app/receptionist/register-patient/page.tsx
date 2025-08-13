// app/receptionist/register-patient/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getAllDoctors } from '@/lib/firebase/doctors'
import { getCurrentQueueByDoctor, getNextQueueNumber, addToQueue } from '@/lib/firebase/queue'
import { createAppointment } from '@/lib/firebase/appointments'
import { createOrUpdateGuestPatient } from '@/lib/firebase/patients'
import { Doctor } from '@/lib/types/auth'
import {
  UserPlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

// Extended doctor interface with real-time queue information
interface DoctorWithQueue extends Doctor {
  currentQueue: number        // Number of patients currently in queue
  estimatedWaitTime: string   // Calculated wait time based on queue length
}

export default function RegisterPatientPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    problem: '',
    selectedDoctor: '',
  })
  
  const [doctors, setDoctors] = useState<DoctorWithQueue[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  /**
   * Loads all doctors with their current queue information
   * - Fetches doctors from Firebase
   * - Gets current queue length for each doctor
   * - Calculates estimated wait times
   * - Updates state with doctor + queue data
   */
  const loadDoctors = async () => {
    try {
      setIsLoadingDoctors(true)
      const fetchedDoctors = await getAllDoctors()
      
      const doctorsWithQueue = await Promise.all(
        fetchedDoctors.map(async (doctor) => {
          try {
            const queue = await getCurrentQueueByDoctor(doctor.id)
            const currentQueue = queue.length
            const estimatedWaitTime = currentQueue === 0 ? '5-10 min' : 
                                    currentQueue <= 2 ? '10-20 min' :
                                    currentQueue <= 4 ? '20-35 min' : '35-50 min'
            
            return {
              ...doctor,
              currentQueue,
              estimatedWaitTime,
            } as DoctorWithQueue
          } catch (error) {
            console.error(`Failed to get queue for doctor ${doctor.id}:`, error)
            return {
              ...doctor,
              currentQueue: 0,
              estimatedWaitTime: '5-10 min',
            } as DoctorWithQueue
          }
        })
      )
      
      setDoctors(doctorsWithQueue)
    } catch (error) {
      console.error('Failed to load doctors:', error)
      setError('Failed to load doctors. Please try again.')
    } finally {
      setIsLoadingDoctors(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  /**
   * Handles form submission for patient registration
   * - Validates all required form fields
   * - Creates/updates patient record in Firebase
   * - Gets next queue number for selected doctor
   * - Creates appointment record
   * - Adds patient to doctor's queue
   * - Shows success confirmation with appointment details
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.name.trim() || !formData.phone.trim() || !formData.age || 
        !formData.gender || !formData.problem.trim() || !formData.selectedDoctor) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create/update patient record
      const patientId = await createOrUpdateGuestPatient({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        problem: formData.problem.trim(),
      })

      // Get next queue number for the selected doctor
      const queueNumber = await getNextQueueNumber(formData.selectedDoctor)

      // Create appointment
      const appointmentId = await createAppointment({
        patientId,
        doctorId: formData.selectedDoctor,
        patientName: formData.name.trim(),
        patientPhone: formData.phone.trim(),
        doctorName: doctors.find(d => d.id === formData.selectedDoctor)!.name,
        specialization: doctors.find(d => d.id === formData.selectedDoctor)!.specialization,
        appointmentDate: new Date(),
        status: 'waiting',
        queueNumber,
        createdBy: 'receptionist',
      })

      // Add to queue
      await addToQueue({
        appointmentId,
        patientName: formData.name.trim(),
        doctorId: formData.selectedDoctor,
        queueNumber,
        status: 'waiting',
      })

      const selectedDoc = doctors.find((doc) => doc.id === formData.selectedDoctor)!
      
      setAppointmentDetails({
        id: appointmentId,
        queueNumber,
        doctorName: selectedDoc.name,
        specialization: selectedDoc.specialization,
        estimatedTime: selectedDoc.estimatedWaitTime,
        patientName: formData.name.trim(),
        patientPhone: formData.phone.trim(),
        status: 'confirmed',
      })

      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to register patient:', error)
      setError('Failed to register patient. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Resets form to initial state for registering another patient
   * - Clears all form fields
   * - Resets success state
   * - Clears appointment details
   * - Removes any error messages
   */
  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      age: '',
      gender: '',
      problem: '',
      selectedDoctor: '',
    })
    setIsSuccess(false)
    setAppointmentDetails(null)
    setError('')
  }

  // Success screen - shown after successful patient registration
  // Displays appointment confirmation with queue number and details
  if (isSuccess && appointmentDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className="p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Patient Registered Successfully!
          </h2>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                Queue Number Assigned
              </h3>
              <div className="text-3xl font-bold text-green-600">
                #{appointmentDetails.queueNumber}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium">{appointmentDetails.patientName}</p>
                <p className="text-sm text-gray-600">{appointmentDetails.patientPhone}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-medium">{appointmentDetails.doctorName}</p>
                <p className="text-sm text-gray-600">{appointmentDetails.specialization}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Wait Time</p>
                <p className="font-medium">{appointmentDetails.estimatedTime}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-green-600">Confirmed</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={resetForm}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Register Another Patient
            </Button>

            <Button
              onClick={() => router.push('/receptionist/queue-management')}
              variant="outline"
              size="lg"
              className="w-full"
            >
              View Queue Management
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Register New Patient
        </h1>
        <p className="text-gray-600">
          Add patient details and book appointment with available doctors
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Patient Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Patient Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter age"
                required
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="" className="text-gray-500">Select Gender</option>
                <option value="male" className="text-gray-900">Male</option>
                <option value="female" className="text-gray-900">Female</option>
                <option value="other" className="text-gray-900">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white resize-none"
              placeholder="Describe the patient's problem or symptoms"
              required
            />
          </div>
        </Card>

        {/* Doctor Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Select Doctor
          </h3>

          {isLoadingDoctors ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse"
                >
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  whileHover={{ scale: doctor.isAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: doctor.isAvailable ? 0.98 : 1 }}
                >
                  <div
                    onClick={() =>
                      doctor.isAvailable && handleInputChange('selectedDoctor', doctor.id)
                    }
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.selectedDoctor === doctor.id
                        ? 'border-purple-500 bg-purple-50'
                        : doctor.isAvailable
                        ? 'border-gray-200 hover:border-gray-300 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4
                          className={`font-medium ${
                            doctor.isAvailable ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {doctor.name}
                        </h4>
                        <p
                          className={`text-sm ${
                            doctor.isAvailable ? 'text-purple-600' : 'text-gray-400'
                          }`}
                        >
                          {doctor.specialization}
                        </p>
                      </div>

                      <div className={`w-3 h-3 rounded-full ${
                        doctor.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>Queue: {doctor.currentQueue} patients</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Wait: {doctor.estimatedWaitTime}
                      </div>

                      {!doctor.isAvailable && (
                        <div className="flex items-center text-sm text-red-600 mt-2">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          <span>Currently Unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoadingDoctors && doctors.length === 0 && (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600">No doctors available at the moment.</p>
            </div>
          )}
        </Card>

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

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || !formData.selectedDoctor || isLoadingDoctors}
            className="px-12 py-3 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          >
            {isSubmitting ? 'Registering Patient...' : 'Register Patient & Book Appointment'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}