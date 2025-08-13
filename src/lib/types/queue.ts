// lib/types/queue.ts
export interface QueueItem {
  id: string
  appointmentId: string
  patientName: string
  doctorId: string
  queueNumber: number
  status: 'waiting' | 'current' | 'completed' | 'skipped'
  createdAt: Date
}
