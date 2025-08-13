// scripts/create-doctor-users.ts
// Run this script to create doctor users in Firebase Auth
// Usage: npx tsx scripts/create-doctor-users.ts

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore'
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

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase configuration. Please check your .env.local file.')
  console.log('Required variables:')
  console.log('- NEXT_PUBLIC_FIREBASE_API_KEY')
  console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const createDoctorUsers = async () => {
  try {
    console.log('🚀 Creating doctor users...')

    // Doctor users with both Auth and Firestore data
    const doctors = [
      {
        email: 'doctor@clinic.com',
        password: 'doctor123',
        name: 'John Smith',
        specialization: 'General Medicine',
        isAvailable: true,
        currentPatient: null,
      },
      {
        email: 'cardio@clinic.com',
        password: 'cardio123',
        name: 'Sarah Johnson',
        specialization: 'Cardiology',
        isAvailable: true,
        currentPatient: null,
      },
      {
        email: 'ortho@clinic.com',
        password: 'ortho123',
        name: 'Michael Brown',
        specialization: 'Orthopedics',
        isAvailable: false,
        currentPatient: null,
      },
    ]

    console.log('👨‍⚕️ Creating doctor accounts...')
    
    for (const doctor of doctors) {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          doctor.email,
          doctor.password
        )
        
        const user = userCredential.user
        console.log(`✅ Created Auth user: ${doctor.email} (${user.uid})`)

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: doctor.email,
          name: doctor.name,
          role: 'doctor',
          createdAt: Timestamp.now(),
        })
        console.log(`✅ Created user document for: ${doctor.name}`)

        // Create doctor document in Firestore
        await setDoc(doc(db, 'doctors', user.uid), {
          email: doctor.email,
          name: doctor.name,
          role: 'doctor',
          specialization: doctor.specialization,
          isAvailable: doctor.isAvailable,
          currentPatient: doctor.currentPatient,
          createdAt: Timestamp.now(),
        })
        console.log(`✅ Created doctor document for: ${doctor.name}`)

      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  User already exists: ${doctor.email}`)
        } else {
          console.error(`❌ Error creating user ${doctor.email}:`, error.message)
        }
      }
    }

    // Also create receptionist user
    console.log('\n👩‍💼 Creating receptionist user...')
    try {
      const receptionistCredential = await createUserWithEmailAndPassword(
        auth,
        'receptionist@clinic.com',
        'reception123'
      )
      
      const receptionistUser = receptionistCredential.user
      console.log(`✅ Created Auth user: receptionist@clinic.com (${receptionistUser.uid})`)

      // Create user document
      await setDoc(doc(db, 'users', receptionistUser.uid), {
        email: 'receptionist@clinic.com',
        name: 'Sarah Wilson',
        role: 'receptionist',
        shift: 'morning',
        createdAt: Timestamp.now(),
      })
      console.log(`✅ Created receptionist user document`)

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Receptionist user already exists`)
      } else {
        console.error(`❌ Error creating receptionist:`, error.message)
      }
    }

    console.log('\n🎉 Doctor users created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('🩺 Doctor Portal:')
    doctors.forEach(doctor => {
      console.log(`   • Email: ${doctor.email}`)
      console.log(`   • Password: ${doctor.password}`)
      console.log(`   • Specialization: ${doctor.specialization}`)
      console.log('')
    })
    
    console.log('👩‍💼 Receptionist Portal:')
    console.log('   • Email: receptionist@clinic.com')
    console.log('   • Password: reception123')
    
    console.log('\n🚀 You can now login to:')
    console.log('   • Doctor portal: http://localhost:3000/doctor/login')
    console.log('   • Receptionist portal: http://localhost:3000/receptionist/login')

  } catch (error) {
    console.error('❌ Error creating doctor users:', error)
  }
}

// Run the script
createDoctorUsers()