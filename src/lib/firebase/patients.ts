// lib/firebase/patients.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { Patient } from '../types/patient'

const PATIENTS_COLLECTION = 'patients'

export const createPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
      ...patientData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to create patient: ${error}`)
  }
}

export const getPatientByPhone = async (phone: string): Promise<Patient | null> => {
  try {
    const q = query(
      collection(db, PATIENTS_COLLECTION),
      where('phone', '==', phone)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return null
    }
    
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as Patient
  } catch (error) {
    throw new Error(`Failed to get patient: ${error}`)
  }
}

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, patientId)
    const patientDoc = await getDoc(patientRef)
    
    if (!patientDoc.exists()) {
      return null
    }
    
    const data = patientDoc.data()!
    return {
      id: patientDoc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    } as Patient
  } catch (error) {
    throw new Error(`Failed to get patient: ${error}`)
  }
}

export const updatePatient = async (patientId: string, updateData: Partial<Patient>) => {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, patientId)
    await updateDoc(patientRef, updateData)
  } catch (error) {
    throw new Error(`Failed to update patient: ${error}`)
  }
}

export const createOrUpdateGuestPatient = async (
  guestData: { name: string; phone: string; age: number; gender: string; problem: string }
): Promise<string> => {
  try {
    // Check if patient already exists
    const existingPatient = await getPatientByPhone(guestData.phone)
    
    if (existingPatient) {
      // Update existing patient
      await updatePatient(existingPatient.id, {
        name: guestData.name,
        age: guestData.age,
        gender: guestData.gender as 'male' | 'female' | 'other',
        problem: guestData.problem,
      })
      return existingPatient.id
    } else {
      // Create new patient
      const patientId = await createPatient({
        name: guestData.name,
        phone: guestData.phone,
        age: guestData.age,
        gender: guestData.gender as 'male' | 'female' | 'other',
        problem: guestData.problem,
        isGuest: true,
      })
      return patientId
    }
  } catch (error) {
    throw new Error(`Failed to create/update guest patient: ${error}`)
  }
}