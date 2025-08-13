// lib/types/auth.ts
export interface User {
  id: string
  email: string
  role: 'patient' | 'doctor' | 'receptionist'
  name: string
  createdAt: Date
}

export interface Doctor extends User {
  role: 'doctor'
  specialization: string
  isAvailable: boolean
  currentPatient?: string
}

export interface Receptionist extends User {
  role: 'receptionist'
  shift: 'morning' | 'evening' | 'night'
}
