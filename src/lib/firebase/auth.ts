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
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid)
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
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getCurrentUser = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
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
