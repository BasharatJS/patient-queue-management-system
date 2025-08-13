// scripts/test-firebase.ts
// Simple script to test Firebase connection
// Usage: npx tsx scripts/test-firebase.ts

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const testFirebase = async () => {
  try {
    console.log('🔧 Testing Firebase connection...')
    console.log('Project ID:', firebaseConfig.projectId)
    console.log('Auth Domain:', firebaseConfig.authDomain)

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('✅ Firebase initialized successfully')

    // Test reading from doctors collection
    console.log('📖 Testing read access to doctors collection...')
    const doctorsRef = collection(db, 'doctors')
    const doctorsSnapshot = await getDocs(doctorsRef)
    
    console.log(`✅ Found ${doctorsSnapshot.size} doctors in database`)
    
    if (doctorsSnapshot.size === 0) {
      console.log('⚠️  No doctors found. Run: npm run setup-firebase')
    } else {
      console.log('📋 Doctors found:')
      doctorsSnapshot.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. ${data.name} - ${data.specialization}`)
      })
    }

  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        console.log('\n🔒 Permission denied - Check your Firestore security rules')
        console.log('Go to Firebase Console → Firestore → Rules')
        console.log('Set rules to: allow read, write: if true;')
      }
      
      if (error.message.includes('not-found')) {
        console.log('\n📂 Project not found - Check your project ID in .env.local')
      }
      
      if (error.message.includes('invalid-api-key')) {
        console.log('\n🔑 Invalid API key - Check your Firebase API key in .env.local')
      }
    }
  }
}

testFirebase()