// lib/firebase/doctors.ts
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import { Doctor } from '../types/auth'

const DOCTORS_COLLECTION = 'doctors'

export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, DOCTORS_COLLECTION))
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Doctor
    })
  } catch (error) {
    throw new Error(`Failed to fetch doctors: ${error}`)
  }
}

export const getAvailableDoctors = async (): Promise<Doctor[]> => {
  try {
    const q = query(
      collection(db, DOCTORS_COLLECTION),
      where('isAvailable', '==', true)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Doctor
    })
  } catch (error) {
    throw new Error(`Failed to fetch available doctors: ${error}`)
  }
}

export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const doctorRef = doc(db, DOCTORS_COLLECTION, doctorId)
    const doctorDoc = await getDoc(doctorRef)
    
    if (!doctorDoc.exists()) {
      return null
    }
    
    const data = doctorDoc.data()!
    return {
      id: doctorDoc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as Doctor
  } catch (error) {
    throw new Error(`Failed to get doctor: ${error}`)
  }
}

export const updateDoctorAvailability = async (doctorId: string, isAvailable: boolean) => {
  try {
    const doctorRef = doc(db, DOCTORS_COLLECTION, doctorId)
    await updateDoc(doctorRef, { isAvailable })
  } catch (error) {
    throw new Error(`Failed to update doctor availability: ${error}`)
  }
}

export const updateCurrentPatient = async (doctorId: string, patientId: string | null) => {
  try {
    const doctorRef = doc(db, DOCTORS_COLLECTION, doctorId)
    await updateDoc(doctorRef, { currentPatient: patientId })
  } catch (error) {
    throw new Error(`Failed to update current patient: ${error}`)
  }
}

export const listenToAvailableDoctors = (callback: (doctors: Doctor[]) => void) => {
  const q = query(
    collection(db, DOCTORS_COLLECTION),
    where('isAvailable', '==', true)
  )

  return onSnapshot(q, (querySnapshot) => {
    const doctors = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Doctor
    })
    callback(doctors)
  })
}