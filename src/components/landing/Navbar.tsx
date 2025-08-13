// components/landing/Navbar.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavbarProps {
  onSectionClick: (sectionId: string) => void
}

export default function Navbar({ onSectionClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'why-choose-us', label: 'Why Choose Us' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleNavClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm border-b backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">PQ</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Patient Queue Management System
            </h1>
            <h1 className="text-xl font-bold text-gray-900 sm:hidden">PQMS</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t bg-white"
          >
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
