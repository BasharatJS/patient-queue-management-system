// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import { useAuthStore } from '@/lib/store/authStore'
import { getCurrentUser } from '@/lib/firebase/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setUser, setLoading, isLoading } = useAuthStore()

  useEffect(() => {
    // Initialize authentication state
    const unsubscribe = getCurrentUser((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [setUser])

  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <LoadingSpinner />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  )
}
