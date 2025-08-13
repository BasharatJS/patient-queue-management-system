// app/patient/book-appointment/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getAllDoctors } from '@/lib/firebase/doctors'
import { getCurrentQueueByDoctor, getNextQueueNumber, addToQueue } from '@/lib/firebase/queue'
import { createAppointment } from '@/lib/firebase/appointments'
import { createOrUpdateGuestPatient } from '@/lib/firebase/patients'
import { Doctor } from '@/lib/types/auth'
import {
  UserIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface DoctorWithQueue extends Doctor {
  currentQueue: number
  estimatedWaitTime: string
}

export default function BookAppointmentPage() {
  const { isGuest, guestInfo } = useAuthStore()
  const router = useRouter()

  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [problem, setProblem] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null)
  const [doctors, setDoctors] = useState<DoctorWithQueue[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [doctorError, setDoctorError] = useState<string | null>(null)

  // Load doctors and their queue info
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true)
        const fetchedDoctors = await getAllDoctors()
        
        // Get queue info for each doctor
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
        setDoctorError(null)
        console.log('Doctors loaded successfully:', doctorsWithQueue.length)
      } catch (error) {
        console.error('Failed to load doctors:', error)
        setDoctorError(error instanceof Error ? error.message : 'Failed to load doctors')
      } finally {
        setIsLoadingDoctors(false)
      }
    }

    if (isGuest) {
      loadDoctors()
    } else {
      router.push('/patient')
    }
  }, [isGuest, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDoctor || !problem.trim() || !age || !gender) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create/update patient record
      const patientId = await createOrUpdateGuestPatient({
        name: guestInfo!.name,
        phone: guestInfo!.phone,
        age: parseInt(age),
        gender,
        problem: problem.trim(),
      })

      // Get next queue number for the selected doctor
      const queueNumber = await getNextQueueNumber(selectedDoctor)

      // Create appointment
      const appointmentId = await createAppointment({
        patientId,
        doctorId: selectedDoctor,
        patientName: guestInfo!.name,
        patientPhone: guestInfo!.phone,
        doctorName: doctors.find(d => d.id === selectedDoctor)!.name,
        specialization: doctors.find(d => d.id === selectedDoctor)!.specialization,
        appointmentDate: new Date(),
        status: 'waiting',
        queueNumber,
        createdBy: 'patient',
      })

      // Add to queue
      await addToQueue({
        appointmentId,
        patientName: guestInfo!.name,
        doctorId: selectedDoctor,
        queueNumber,
        status: 'waiting',
      })

      const selectedDoc = doctors.find((doc) => doc.id === selectedDoctor)!
      
      const appointment = {
        id: appointmentId,
        queueNumber,
        doctorName: selectedDoc.name,
        specialization: selectedDoc.specialization,
        estimatedTime: selectedDoc.estimatedWaitTime,
        patientName: guestInfo!.name,
        patientPhone: guestInfo!.phone,
        status: 'confirmed',
      }

      setAppointmentDetails(appointment)
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to book appointment:', error)
      alert('Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isGuest) {
    return <LoadingSpinner />
  }

  // Success screen
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
            Appointment Booked Successfully!
          </h2>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                Your Queue Number
              </h3>
              <div className="text-3xl font-bold text-green-600">
                #{appointmentDetails.queueNumber}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-medium">{appointmentDetails.doctorName}</p>
                <p className="text-sm text-gray-600">
                  {appointmentDetails.specialization}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Wait Time</p>
                <p className="font-medium">
                  {appointmentDetails.estimatedTime}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/patient/queue-status')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              View Queue Status
            </Button>

            <Button
              onClick={() => {
                setIsSuccess(false)
                setSelectedDoctor('')
                setProblem('')
                setAge('')
                setGender('')
              }}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Book Another Appointment
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
          Book an Appointment
        </h1>
        <p className="text-gray-600">
          Choose a doctor and provide your details to book an appointment
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Patient Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Patient Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={guestInfo?.name || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={guestInfo?.phone || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter your age"
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
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white resize-none"
              placeholder="Briefly describe your problem or symptoms"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingDoctors ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse"
                >
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ scale: doctor.isAvailable ? 1.02 : 1 }}
                whileTap={{ scale: doctor.isAvailable ? 0.98 : 1 }}
              >
                <div
                  onClick={() =>
                    doctor.isAvailable && setSelectedDoctor(doctor.id)
                  }
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDoctor === doctor.id
                      ? 'border-blue-500 bg-blue-50'
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
                          doctor.isAvailable ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        {doctor.specialization}
                      </p>
                    </div>

                    {doctor.isAvailable ? (
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    )}
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
          
          {!isLoadingDoctors && doctors.length === 0 && (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No doctors available at the moment.</p>
              {doctorError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-red-700 font-medium">Error Details:</p>
                  <p className="text-red-600 text-sm mt-1">{doctorError}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Please check:
                  </p>
                  <ul className="text-gray-600 text-sm mt-1 list-disc list-inside">
                    <li>Run: npm run setup-firebase</li>
                    <li>Check Firebase console for data</li>
                    <li>Verify Firestore rules allow read access</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || !selectedDoctor}
            className="px-12 py-3"
          >
            {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
