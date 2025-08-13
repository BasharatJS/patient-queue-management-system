// lib/types/patient.ts
export interface Patient {
  id: string
  name: string
  phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  problem: string
  isGuest: boolean
  createdAt: Date
}
