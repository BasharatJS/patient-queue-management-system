// app/display/page.tsx - Public waiting area display screen
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllDoctors } from '@/lib/firebase/doctors'
import { listenToCurrentQueueNumber, listenToQueue } from '@/lib/firebase/queue'
import { Doctor } from '@/lib/types/auth'
import { QueueItem } from '@/lib/types/queue'
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

interface DoctorQueueInfo {
  doctor: Doctor
  currentNumber: number
  totalWaiting: number
  queueItems: QueueItem[]
}

export default function DisplayPage() {
  const [doctorQueues, setDoctorQueues] = useState<DoctorQueueInfo[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load doctors and setup real-time listeners
  useEffect(() => {
    let unsubscribeFunctions: (() => void)[] = []
    
    const setupDoctorListeners = async () => {
      try {
        setIsLoading(true)
        const doctors = await getAllDoctors()
        
        // Initialize doctor queue info
        const initialDoctorQueues = doctors.map(doctor => ({
          doctor,
          currentNumber: 0,
          totalWaiting: 0,
          queueItems: [],
        }))
        setDoctorQueues(initialDoctorQueues)
        
        // Setup listeners for each doctor
        doctors.forEach((doctor, index) => {
          // Listen to current queue number
          const unsubscribeCurrentNumber = listenToCurrentQueueNumber(
            doctor.id,
            (currentNumber) => {
              setDoctorQueues(prev => 
                prev.map((dq, i) => 
                  i === index 
                    ? { ...dq, currentNumber }
                    : dq
                )
              )
            }
          )
          unsubscribeFunctions.push(unsubscribeCurrentNumber)
          
          // Listen to queue items
          const unsubscribeQueue = listenToQueue(
            doctor.id,
            (queueItems) => {
              setDoctorQueues(prev => 
                prev.map((dq, i) => 
                  i === index 
                    ? { 
                        ...dq, 
                        queueItems,
                        totalWaiting: queueItems.filter(item => item.status === 'waiting').length
                      }
                    : dq
                )
              )
            }
          )
          unsubscribeFunctions.push(unsubscribeQueue)
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to setup display listeners:', error)
        setIsLoading(false)
      }
    }

    setupDoctorListeners()
    
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading queue display...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Hospital Queue Status
        </h1>
        <div className="flex justify-center items-center space-x-4 text-xl text-gray-600">
          <ClockIcon className="w-6 h-6" />
          <span>{currentTime.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Current Numbers Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center">
            <BellIcon className="w-8 h-8 mr-3 text-green-600" />
            Now Serving
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorQueues.map((dq, index) => (
              <AnimatePresence key={dq.doctor.id} mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl text-white"
                >
                  <h3 className="text-lg font-semibold mb-2">{dq.doctor.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{dq.doctor.specialization}</p>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-2">
                      {dq.currentNumber === 0 ? '--' : `#${dq.currentNumber}`}
                    </div>
                    <p className="text-sm opacity-90">Current Number</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Waiting: {dq.totalWaiting}</span>
                    <span className={`px-2 py-1 rounded ${
                      dq.doctor.isAvailable 
                        ? 'bg-green-600 bg-opacity-50' 
                        : 'bg-red-600 bg-opacity-50'
                    }`}>
                      {dq.doctor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detailed Queue Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {doctorQueues.map((dq, index) => (
          <div key={dq.doctor.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{dq.doctor.name}</h3>
                <p className="text-blue-600">{dq.doctor.specialization}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {dq.currentNumber === 0 ? '--' : `#${dq.currentNumber}`}
                </div>
                <p className="text-sm text-gray-600">Now Serving</p>
              </div>
            </div>

            {/* Queue List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 border-b pb-2">
                <span>Patient</span>
                <span>Number</span>
              </div>
              
              {dq.queueItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No patients in queue</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {dq.queueItems
                    .filter(item => item.status !== 'completed')
                    .map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className={`flex items-center justify-between py-3 px-4 rounded-lg ${
                          item.status === 'current'
                            ? 'bg-green-100 border-l-4 border-green-500'
                            : item.status === 'waiting' && item.queueNumber === dq.currentNumber + 1
                            ? 'bg-yellow-100 border-l-4 border-yellow-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.status === 'current' && (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          )}
                          <span className={`font-medium ${
                            item.status === 'current' ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {item.patientName}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-lg ${
                            item.status === 'current' 
                              ? 'text-green-600' 
                              : item.queueNumber === dq.currentNumber + 1
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                          }`}>
                            #{item.queueNumber}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p>Watch for your number on the display above</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <p>Proceed to the doctor's chamber when called</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <p>Keep your appointment receipt ready</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}