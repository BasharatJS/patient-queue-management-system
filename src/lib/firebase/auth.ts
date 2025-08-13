// lib/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'
import { User } from '../types/auth'

export const signIn = async (email: string, password: string) => {
  if (!auth || !db) {
    throw new Error('Firebase not initialized')
  }

  const authInstance = auth
  const dbInstance = db

  try {
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    )
    const user = userCredential.user

    // Get user data from Firestore
    const userDocRef = doc(dbInstance, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      return {
        id: user.uid,
        email: user.email!,
        ...userDoc.data(),
      } as User
    }

    throw new Error('User data not found')
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const signOut = async () => {
  if (!auth) {
    throw new Error('Firebase not initialized')
  }

  const authInstance = auth

  try {
    await firebaseSignOut(authInstance)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getCurrentUser = (callback: (user: User | null) => void) => {
  if (!auth || !db) {
    callback(null)
    return () => {}
  }
  
  const authInstance = auth
  const dbInstance = db
  
  return onAuthStateChanged(authInstance, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(dbInstance, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userDoc.data(),
          } as User
          callback(userData)
        } else {
          callback(null)
        }
      } catch (error) {
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}
