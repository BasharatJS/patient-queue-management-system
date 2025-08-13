// lib/types/appointment.ts
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  patientName: string
  patientPhone: string
  doctorName: string
  specialization: string
  appointmentDate: Date
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled'
  queueNumber: number
  estimatedTime?: Date
  createdBy: 'patient' | 'receptionist'
  createdAt: Date
}
