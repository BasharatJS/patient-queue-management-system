// lib/store/authStore.ts
import { create } from 'zustand'
import { User } from '../types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  isGuest: boolean
  guestInfo: {
    name: string
    phone: string
  } | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setGuest: (guestInfo: { name: string; phone: string }) => void
  clearGuest: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isGuest: false,
  guestInfo: null,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setGuest: (guestInfo) => set({ isGuest: true, guestInfo }),
  clearGuest: () => set({ isGuest: false, guestInfo: null }),
  logout: () => set({ user: null, isGuest: false, guestInfo: null }),
}))
