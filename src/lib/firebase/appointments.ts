// lib/firebase/appointments.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { Appointment } from '../types/appointment'

const APPOINTMENTS_COLLECTION = 'appointments'

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  const dbInstance = db
  
  try {
    const docRef = await addDoc(collection(dbInstance, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      appointmentDate: Timestamp.fromDate(appointmentData.appointmentDate),
      estimatedTime: appointmentData.estimatedTime ? Timestamp.fromDate(appointmentData.estimatedTime) : null,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to create appointment: ${error}`)
  }
}

export const getAppointmentsByDoctor = async (doctorId: string, date: Date = new Date()) => {
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  const dbInstance = db
  
  try {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    
    const q = query(
      collection(dbInstance, APPOINTMENTS_COLLECTION),
      where('doctorId', '==', doctorId),
      where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
      where('appointmentDate', '<', Timestamp.fromDate(endOfDay)),
      orderBy('queueNumber', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        appointmentDate: data.appointmentDate.toDate(),
        estimatedTime: data.estimatedTime?.toDate(),
        createdAt: data.createdAt.toDate(),
      } as Appointment
    })
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error}`)
  }
}

export const getPatientAppointments = async (patientPhone: string) => {
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  const dbInstance = db
  
  try {
    const q = query(
      collection(dbInstance, APPOINTMENTS_COLLECTION),
      where('patientPhone', '==', patientPhone)
    )
    
    const querySnapshot = await getDocs(q)
    const allAppointments = querySnapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          appointmentDate: data.appointmentDate.toDate(),
          estimatedTime: data.estimatedTime?.toDate(),
          createdAt: data.createdAt.toDate(),
        } as Appointment
      })
    
    // Filter and sort in memory to avoid index
    return allAppointments
      .filter(appointment => 
        appointment.status === 'waiting' || 
        appointment.status === 'in-progress'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by createdAt desc
  } catch (error) {
    throw new Error(`Failed to fetch patient appointments: ${error}`)
  }
}

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  const dbInstance = db
  
  try {
    const appointmentRef = doc(dbInstance, APPOINTMENTS_COLLECTION, appointmentId)
    await updateDoc(appointmentRef, { status })
  } catch (error) {
    throw new Error(`Failed to update appointment status: ${error}`)
  }
}

export const listenToAppointmentsByDoctor = (
  doctorId: string,
  callback: (appointments: Appointment[]) => void,
  date: Date = new Date()
) => {
  if (!db) {
    callback([])
    return () => {}
  }
  
  const dbInstance = db
  
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  
  const q = query(
    collection(dbInstance, APPOINTMENTS_COLLECTION),
    where('doctorId', '==', doctorId),
    where('appointmentDate', '>=', Timestamp.fromDate(startOfDay)),
    where('appointmentDate', '<', Timestamp.fromDate(endOfDay)),
    orderBy('queueNumber', 'asc')
  )

  return onSnapshot(q, (querySnapshot) => {
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        appointmentDate: data.appointmentDate.toDate(),
        estimatedTime: data.estimatedTime?.toDate(),
        createdAt: data.createdAt.toDate(),
      } as Appointment
    })
    callback(appointments)
  })
}

export const listenToPatientAppointments = (
  patientPhone: string,
  callback: (appointments: Appointment[]) => void
) => {
  if (!db) {
    callback([])
    return () => {}
  }
  
  const dbInstance = db
  
  // Simplified query to avoid index requirements
  const q = query(
    collection(dbInstance, APPOINTMENTS_COLLECTION),
    where('patientPhone', '==', patientPhone)
  )

  return onSnapshot(q, (querySnapshot) => {
    const allAppointments = querySnapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          appointmentDate: data.appointmentDate.toDate(),
          estimatedTime: data.estimatedTime?.toDate(),
          createdAt: data.createdAt.toDate(),
        } as Appointment
      })
    
    // Filter and sort in memory to avoid index
    const filteredAppointments = allAppointments
      .filter(appointment => 
        appointment.status === 'waiting' || 
        appointment.status === 'in-progress'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by createdAt desc
    
    callback(filteredAppointments)
  })
}