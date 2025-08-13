// lib/firebase/queue.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { QueueItem } from '../types/queue'

const QUEUE_COLLECTION = 'queue'

export const addToQueue = async (queueData: Omit<QueueItem, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, QUEUE_COLLECTION), {
      ...queueData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw new Error(`Failed to add to queue: ${error}`)
  }
}

export const getCurrentQueueByDoctor = async (doctorId: string) => {
  try {
    // Simplified query to avoid index requirements
    const q = query(
      collection(db, QUEUE_COLLECTION),
      where('doctorId', '==', doctorId)
    )
    
    const querySnapshot = await getDocs(q)
    const allItems = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as QueueItem
    })
    
    // Filter and sort in memory to avoid index
    return allItems
      .filter(item => item.status === 'waiting' || item.status === 'current' || item.status === 'completed' || item.status === 'skipped')
      .sort((a, b) => a.queueNumber - b.queueNumber)
  } catch (error) {
    throw new Error(`Failed to fetch queue: ${error}`)
  }
}

export const getCurrentQueueNumber = async (doctorId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, QUEUE_COLLECTION),
      where('doctorId', '==', doctorId)
    )
    
    const querySnapshot = await getDocs(q)
    const currentPatients = querySnapshot.docs
      .map(doc => doc.data())
      .filter(data => data.status === 'current')
    
    if (currentPatients.length === 0) {
      return 0
    }
    
    return currentPatients[0].queueNumber || 0
  } catch (error) {
    throw new Error(`Failed to get current queue number: ${error}`)
  }
}

export const getNextQueueNumber = async (doctorId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, QUEUE_COLLECTION),
      where('doctorId', '==', doctorId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return 1
    }
    
    const allQueueNumbers = querySnapshot.docs
      .map(doc => doc.data().queueNumber || 0)
      .sort((a, b) => b - a) // Sort descending
    
    return (allQueueNumbers[0] || 0) + 1
  } catch (error) {
    throw new Error(`Failed to get next queue number: ${error}`)
  }
}

export const updateQueueItemStatus = async (queueId: string, status: QueueItem['status']) => {
  try {
    const queueRef = doc(db, QUEUE_COLLECTION, queueId)
    await updateDoc(queueRef, { status })
  } catch (error) {
    throw new Error(`Failed to update queue status: ${error}`)
  }
}

export const updateQueueItemStatusByAppointmentId = async (appointmentId: string, status: QueueItem['status']) => {
  try {
    // Find queue item by appointmentId
    const queueQuery = query(
      collection(db, QUEUE_COLLECTION),
      where('appointmentId', '==', appointmentId)
    )
    
    const querySnapshot = await getDocs(queueQuery)
    
    if (!querySnapshot.empty) {
      const queueDoc = querySnapshot.docs[0]
      await updateDoc(queueDoc.ref, { status })
    } else {
      throw new Error('Queue item not found for appointment')
    }
  } catch (error) {
    throw new Error(`Failed to update queue status: ${error}`)
  }
}

export const moveToNext = async (doctorId: string) => {
  try {
    // Get all queue items for this doctor to avoid complex index requirements
    const allQueueQuery = query(
      collection(db, QUEUE_COLLECTION),
      where('doctorId', '==', doctorId)
    )
    
    const allQueueSnapshot = await getDocs(allQueueQuery)
    const allQueueItems = allQueueSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ref: doc.ref,
        appointmentId: data.appointmentId,
        patientName: data.patientName,
        doctorId: data.doctorId,
        queueNumber: data.queueNumber,
        status: data.status,
        createdAt: data.createdAt.toDate(),
      }
    })
    
    // Find current patient and mark as completed
    const currentPatient = allQueueItems.find(item => item.status === 'current')
    if (currentPatient) {
      await updateDoc(currentPatient.ref, { status: 'completed' })
    }
    
    // Find next waiting patient (lowest queue number)
    const waitingPatients = allQueueItems
      .filter(item => item.status === 'waiting')
      .sort((a, b) => a.queueNumber - b.queueNumber)
    
    if (waitingPatients.length > 0) {
      const nextPatient = waitingPatients[0]
      await updateDoc(nextPatient.ref, { status: 'current' })
      return {
        id: nextPatient.id,
        appointmentId: nextPatient.appointmentId,
        patientName: nextPatient.patientName,
        doctorId: nextPatient.doctorId,
        queueNumber: nextPatient.queueNumber,
        status: 'current' as const,
        createdAt: nextPatient.createdAt,
      } as QueueItem
    }
    
    return null
  } catch (error) {
    throw new Error(`Failed to move to next patient: ${error}`)
  }
}

export const listenToQueue = (doctorId: string, callback: (queue: QueueItem[]) => void) => {
  const q = query(
    collection(db, QUEUE_COLLECTION),
    where('doctorId', '==', doctorId)
  )

  return onSnapshot(q, (querySnapshot) => {
    const allItems = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as QueueItem
    })
    
    // Filter and sort in memory to avoid index
    const queue = allItems
      .filter(item => item.status === 'waiting' || item.status === 'current' || item.status === 'completed' || item.status === 'skipped')
      .sort((a, b) => a.queueNumber - b.queueNumber)
    
    callback(queue)
  })
}

export const listenToCurrentQueueNumber = (doctorId: string, callback: (currentNumber: number) => void) => {
  const q = query(
    collection(db, QUEUE_COLLECTION),
    where('doctorId', '==', doctorId)
  )

  return onSnapshot(q, (querySnapshot) => {
    const currentPatients = querySnapshot.docs
      .map(doc => doc.data())
      .filter(data => data.status === 'current')
    
    if (currentPatients.length === 0) {
      callback(0)
    } else {
      callback(currentPatients[0].queueNumber || 0)
    }
  })
}