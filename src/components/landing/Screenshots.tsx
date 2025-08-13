// components/landing/Screenshots.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import { useState } from 'react'
import {
  UserIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline'

export default function Screenshots() {
  const [activeTab, setActiveTab] = useState(0)

  const dashboards = [
    {
      id: 'patient',
      title: 'Patient Dashboard',
      description:
        'Easy appointment booking, queue tracking, and real-time updates for patients.',
      icon: UserIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      gradientColor: 'from-green-400 to-blue-500',
      features: [
        'Book appointments instantly',
        'Track queue position in real-time',
        'Receive automated notifications',
        'View doctor availability',
        'Guest access available',
      ],
      mockupContent: {
        title: 'Book Appointment',
        subtitle: 'Dr. Sarah Johnson - Cardiology',
        status: 'Queue Position: #3',
        waitTime: 'Estimated Wait: 15-20 min',
      },
    },
    {
      id: 'receptionist',
      title: 'Receptionist Dashboard',
      description:
        'Comprehensive patient registration, queue management, and appointment coordination.',
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      gradientColor: 'from-purple-400 to-pink-500',
      features: [
        'Register walk-in patients',
        'Manage multiple doctor queues',
        'Real-time statistics dashboard',
        'Call next patient functionality',
        'Appointment scheduling tools',
      ],
      mockupContent: {
        title: 'Queue Management',
        subtitle: 'Managing 3 Active Queues',
        status: 'Current: Sarah Miller #12',
        waitTime: 'Avg Wait Time: 25 min',
      },
    },
    {
      id: 'doctor',
      title: 'Doctor Dashboard',
      description:
        'Streamlined patient flow management with detailed queue insights and controls.',
      icon: ClipboardDocumentListIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      gradientColor: 'from-orange-400 to-red-500',
      features: [
        'View current patient queue',
        'Call next patient with one click',
        'Patient history and notes',
        'Consultation time tracking',
        'Queue status controls',
      ],
      mockupContent: {
        title: 'My Queue',
        subtitle: 'Cardiology Department',
        status: 'Next: John Doe #8',
        waitTime: '12 patients waiting',
      },
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  const mockupVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  return (
    <section id="screenshots" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Dashboard{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Previews
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Explore our intuitive dashboards designed for different user roles.
            Each interface is optimized for specific workflows and
            responsibilities.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {dashboards.map((dashboard, index) => {
            const IconComponent = dashboard.icon

            return (
              <motion.button
                key={dashboard.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(index)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === index
                    ? `${dashboard.bgColor} ${dashboard.color} border-2 ${dashboard.borderColor} shadow-lg`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span>{dashboard.title}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Features List */}
          <motion.div variants={itemVariants}>
            <div className="space-y-6">
              <div>
                <h3
                  className={`text-3xl font-bold ${dashboards[activeTab].color} mb-4`}
                >
                  {dashboards[activeTab].title}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {dashboards[activeTab].description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Key Features:
                </h4>
                <ul className="space-y-3">
                  {dashboards[activeTab].features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${dashboards[activeTab].gradientColor}`}
                      ></div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Device Icons */}
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <ComputerDesktopIcon className="w-5 h-5" />
                  <span className="text-sm">Desktop</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  <span className="text-sm">Mobile</span>
                </div>
                <div className="text-sm text-gray-500">Responsive Design</div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div variants={mockupVariants} className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser Bar */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 ml-4">
                    localhost:3000/{dashboards[activeTab].id}
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${dashboards[activeTab].gradientColor} rounded-xl p-6 text-white mb-6`}
                >
                  <h3 className="text-2xl font-bold mb-2">
                    {dashboards[activeTab].mockupContent.title}
                  </h3>
                  <p className="opacity-90">
                    {dashboards[activeTab].mockupContent.subtitle}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className={`${dashboards[activeTab].bgColor} rounded-xl p-4 border ${dashboards[activeTab].borderColor} border-opacity-20`}
                  >
                    <div
                      className={`text-sm ${dashboards[activeTab].color} opacity-70 mb-1`}
                    >
                      Status
                    </div>
                    <div className={`font-bold ${dashboards[activeTab].color}`}>
                      {dashboards[activeTab].mockupContent.status}
                    </div>
                  </div>
                  <div
                    className={`${dashboards[activeTab].bgColor} rounded-xl p-4 border ${dashboards[activeTab].borderColor} border-opacity-20`}
                  >
                    <div
                      className={`text-sm ${dashboards[activeTab].color} opacity-70 mb-1`}
                    >
                      Wait Time
                    </div>
                    <div className={`font-bold ${dashboards[activeTab].color}`}>
                      {dashboards[activeTab].mockupContent.waitTime}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    className={`w-full bg-gradient-to-r ${dashboards[activeTab].gradientColor} text-white py-3 rounded-lg font-medium`}
                  >
                    Primary Action
                  </button>
                  <button
                    className={`w-full border-2 ${dashboards[activeTab].borderColor} ${dashboards[activeTab].color} py-3 rounded-lg font-medium`}
                  >
                    Secondary Action
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full opacity-10 animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
          </motion.div>
        </motion.div>

        {/* Demo CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mt-20 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-200"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Experience the Full Demo
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ready to see how our system works? Try each dashboard with real
              functionality and experience the seamless workflow yourself.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById('home')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Try Live Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
