// app/doctor/consultation/[patientId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { moveToNext, updateQueueItemStatus } from '@/lib/firebase/queue'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ForwardIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

interface PatientData {
  id: string
  name: string
  queueNumber: number
  appointmentTime?: string
  symptoms?: string
  notes?: string
}

export default function ConsultationPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const patientId = params.patientId as string

  const [patient, setPatient] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [consultationNotes, setConsultationNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')

  // Mock patient data - In real app, fetch from Firebase
  useEffect(() => {
    // Simulate loading patient data
    const timer = setTimeout(() => {
      setPatient({
        id: patientId,
        name: 'John Doe',
        queueNumber: 5,
        appointmentTime: '10:30 AM',
        symptoms: 'Fever, headache, and sore throat',
        notes: 'Patient reported symptoms started 2 days ago',
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [patientId])

  const handleBackToDashboard = () => {
    router.push('/doctor/dashboard')
  }

  const handleCompleteConsultation = async () => {
    if (!user?.id || !patient) return

    setIsProcessing(true)
    try {
      // Mark current patient as completed and move to next
      await moveToNext(user.id)
      
      // In real app, save consultation data to Firebase
      console.log('Consultation completed:', {
        patientId: patient.id,
        notes: consultationNotes,
        diagnosis,
        prescription,
        doctorId: user.id,
        completedAt: new Date(),
      })

      router.push('/doctor/dashboard')
    } catch (error) {
      console.error('Error completing consultation:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMoveToNext = async () => {
    if (!user?.id) return

    setIsProcessing(true)
    try {
      await moveToNext(user.id)
      router.push('/doctor/dashboard')
    } catch (error) {
      console.error('Error moving to next patient:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Not Found</h3>
        <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
        <Button onClick={handleBackToDashboard}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToDashboard}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Consultation</h1>
            <p className="text-gray-600">Manage patient care and consultation notes</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleMoveToNext}
            disabled={isProcessing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isProcessing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ForwardIcon className="w-4 h-4" />
            )}
            <span>Next Patient</span>
          </Button>
          
          <Button
            onClick={handleCompleteConsultation}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
          >
            {isProcessing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <CheckCircleIcon className="w-4 h-4" />
            )}
            <span>Complete & Next</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {patient.queueNumber}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                <p className="text-gray-600">Queue #{patient.queueNumber}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Appointment Time</p>
                  <p className="font-medium">{patient.appointmentTime || 'Walk-in'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <HeartIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Reported Symptoms</p>
                  <p className="font-medium">{patient.symptoms || 'No symptoms reported'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Initial Notes</p>
                  <p className="font-medium">{patient.notes || 'No additional notes'}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Consultation Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consultation Details
            </h3>

            <div className="space-y-4">
              {/* Consultation Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Notes
                </label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter detailed consultation notes..."
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter diagnosis..."
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription
                </label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter prescription details..."
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Complete Consultation
              </h3>
              <p className="text-gray-600">
                Save consultation details and proceed to next patient
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleBackToDashboard}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Save & Return</span>
              </Button>
              
              <Button
                onClick={handleCompleteConsultation}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                <span>Complete & Next Patient</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left">
              <HeartIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-blue-900">Vital Signs</p>
              <p className="text-sm text-blue-600">Record patient vitals</p>
            </button>
            
            <button className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-blue-900">Medical History</p>
              <p className="text-sm text-blue-600">View patient history</p>
            </button>
            
            <button className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-left">
              <EyeIcon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-blue-900">Lab Results</p>
              <p className="text-sm text-blue-600">Check lab reports</p>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}