// scripts/setup-firebase.ts
// Run this script to populate your Firebase with initial test data
// Usage: npx tsx scripts/setup-firebase.ts

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
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
const db = getFirestore(app)

const setupInitialData = async () => {
  try {
    console.log('🚀 Setting up Firebase with initial data...')

    // Create doctors
    const doctors = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@hospital.com',
        role: 'doctor',
        specialization: 'General Medicine',
        isAvailable: true,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        role: 'doctor',
        specialization: 'Cardiology',
        isAvailable: true,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Dr. Amit Patel',
        email: 'amit.patel@hospital.com',
        role: 'doctor',
        specialization: 'Dermatology',
        isAvailable: false,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Dr. Sunita Verma',
        email: 'sunita.verma@hospital.com',
        role: 'doctor',
        specialization: 'Pediatrics',
        isAvailable: true,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@hospital.com',
        role: 'doctor',
        specialization: 'Orthopedics',
        isAvailable: true,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Dr. Meera Joshi',
        email: 'meera.joshi@hospital.com',
        role: 'doctor',
        specialization: 'ENT',
        isAvailable: true,
        currentPatient: null,
        createdAt: Timestamp.now(),
      },
    ]

    console.log('👨‍⚕️ Creating doctors...')
    const doctorIds: string[] = []
    for (const doctor of doctors) {
      const docRef = await addDoc(collection(db, 'doctors'), doctor)
      doctorIds.push(docRef.id)
      console.log(`✅ Created doctor: ${doctor.name} (${docRef.id})`)
    }

    // Create some sample patients
    console.log('👥 Creating sample patients...')
    const patients = [
      {
        name: 'John Doe',
        phone: '+91-9876543210',
        age: 35,
        gender: 'male',
        problem: 'Fever and headache',
        isGuest: true,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Jane Smith',
        phone: '+91-8765432109',
        age: 28,
        gender: 'female',
        problem: 'Regular checkup',
        isGuest: true,
        createdAt: Timestamp.now(),
      },
      {
        name: 'Amit Kumar',
        phone: '+91-7654321098',
        age: 42,
        gender: 'male',
        problem: 'Back pain',
        isGuest: true,
        createdAt: Timestamp.now(),
      }
    ]

    const patientIds: string[] = []
    for (const patient of patients) {
      const patientRef = await addDoc(collection(db, 'patients'), patient)
      patientIds.push(patientRef.id)
      console.log(`✅ Created patient: ${patient.name} (${patientRef.id})`)
    }

    // Create sample appointments and queue items
    console.log('📅 Creating sample appointments and queue...')
    
    const today = new Date()
    const appointments = [
      {
        patientId: patientIds[0],
        doctorId: doctorIds[0],
        patientName: 'John Doe',
        patientPhone: '+91-9876543210',
        doctorName: 'Dr. Rajesh Kumar',
        specialization: 'General Medicine',
        appointmentDate: Timestamp.fromDate(today),
        status: 'waiting',
        queueNumber: 1,
        estimatedTime: null,
        createdBy: 'patient',
        createdAt: Timestamp.now(),
      },
      {
        patientId: patientIds[1],
        doctorId: doctorIds[0],
        patientName: 'Jane Smith',
        patientPhone: '+91-8765432109',
        doctorName: 'Dr. Rajesh Kumar',
        specialization: 'General Medicine',
        appointmentDate: Timestamp.fromDate(today),
        status: 'waiting',
        queueNumber: 2,
        estimatedTime: null,
        createdBy: 'patient',
        createdAt: Timestamp.now(),
      },
      {
        patientId: patientIds[2],
        doctorId: doctorIds[4],
        patientName: 'Amit Kumar',
        patientPhone: '+91-7654321098',
        doctorName: 'Dr. Vikram Singh',
        specialization: 'Orthopedics',
        appointmentDate: Timestamp.fromDate(today),
        status: 'waiting',
        queueNumber: 1,
        estimatedTime: null,
        createdBy: 'patient',
        createdAt: Timestamp.now(),
      }
    ]

    const appointmentIds: string[] = []
    for (const appointment of appointments) {
      const appointmentRef = await addDoc(collection(db, 'appointments'), appointment)
      appointmentIds.push(appointmentRef.id)
      console.log(`✅ Created appointment for ${appointment.patientName} with ${appointment.doctorName}`)
    }

    // Create queue items
    const queueItems = [
      {
        appointmentId: appointmentIds[0],
        patientName: 'John Doe',
        doctorId: doctorIds[0],
        queueNumber: 1,
        status: 'current',
        createdAt: Timestamp.now(),
      },
      {
        appointmentId: appointmentIds[1],
        patientName: 'Jane Smith',
        doctorId: doctorIds[0],
        queueNumber: 2,
        status: 'waiting',
        createdAt: Timestamp.now(),
      },
      {
        appointmentId: appointmentIds[2],
        patientName: 'Amit Kumar',
        doctorId: doctorIds[4],
        queueNumber: 1,
        status: 'current',
        createdAt: Timestamp.now(),
      }
    ]

    for (const queueItem of queueItems) {
      const queueRef = await addDoc(collection(db, 'queue'), queueItem)
      console.log(`✅ Created queue item for ${queueItem.patientName} (Queue #${queueItem.queueNumber})`)
    }

    // Create receptionist user
    console.log('👩‍💼 Creating receptionist user...')
    const receptionist = {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      role: 'receptionist',
      shift: 'morning',
      createdAt: Timestamp.now(),
    }

    const receptionistRef = await addDoc(collection(db, 'users'), receptionist)
    console.log(`✅ Created receptionist: ${receptionist.name} (${receptionistRef.id})`)

    console.log('\n🎉 Firebase setup completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   • Created ${doctors.length} doctors`)
    console.log(`   • Created ${patients.length} sample patients`)
    console.log(`   • Created ${appointments.length} sample appointments`)
    console.log(`   • Created ${queueItems.length} queue items`)
    console.log(`   • Created 1 receptionist user`)
    
    console.log('\n🚀 Your app is ready to use!')
    console.log('   • Patient dashboard: http://localhost:3000/patient')
    console.log('   • Public display: http://localhost:3000/display')
    console.log('   • Receptionist: http://localhost:3000/receptionist/login')
    console.log('   • Doctor: http://localhost:3000/doctor/login')

  } catch (error) {
    console.error('❌ Error setting up Firebase:', error)
  }
}

// Run the setup
setupInitialData()