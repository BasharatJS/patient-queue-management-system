// app/receptionist/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/lib/store/authStore'
import {
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

export default function ReceptionistLoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handles login form submission
   * - Validates form fields (email, password)
   * - Checks credentials against demo account
   * - Sets user authentication state on success
   * - Redirects to receptionist dashboard
   * - Shows error message on invalid credentials
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Demo authentication - in production, this should use Firebase Auth
      // Currently uses hardcoded credentials for demonstration purposes
      if (
        formData.email === 'receptionist@hospital.com' &&
        formData.password === 'receptionist123'
      ) {
        // Create mock receptionist user object for demo
        // In production, this would come from Firebase Auth
        const receptionistUser = {
          id: 'receptionist_1',
          email: formData.email,
          name: 'Sarah Johnson',
          role: 'receptionist' as const,
          createdAt: new Date(),
        }

        setUser(receptionistUser)
        router.push('/receptionist/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles input field changes and clears errors
   * @param field - Form field name (email or password)
   * @param value - New field value
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Receptionist Login
            </h1>
            <p className="text-gray-600">
              Access the patient management system
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <ExclamationCircleIcon className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Demo Credentials
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> receptionist@hospital.com
              </p>
              <p>
                <strong>Password:</strong> receptionist123
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              � Back to Home
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
