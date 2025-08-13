// components/landing/Features.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import {
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export default function Features() {
  const features = [
    {
      icon: ClockIcon,
      title: 'Real-time Queue Updates',
      description:
        'Get instant updates on queue positions and wait times with live notifications.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: CalendarDaysIcon,
      title: 'Online Appointment Booking',
      description:
        'Book appointments easily with available doctors and get instant confirmations.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-Doctor Support',
      description:
        'Manage queues for multiple doctors with specialized departments and services.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Guest Patient Access',
      description:
        'Allow walk-in patients to join queues without prior registration or accounts.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: CheckCircleIcon,
      title: 'Smart Queue Management',
      description:
        'Intelligent queue optimization with estimated wait times and patient flow control.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      icon: CogIcon,
      title: 'Role-based Dashboards',
      description:
        'Customized interfaces for patients, receptionists, and doctors with relevant features.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      icon: BellIcon,
      title: 'Instant Notifications',
      description:
        'Automated alerts for appointment confirmations, queue updates, and status changes.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description:
        'HIPAA-compliant security with encrypted data and secure user authentication.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="features" className="py-20 bg-white">
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
            Powerful{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Features
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our comprehensive queue management system offers everything you need
            for efficient healthcare operations and enhanced patient experience.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div
                  className={`p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} h-full transition-all duration-300 hover:shadow-xl hover:border-opacity-50`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>

                    <h3
                      className={`text-xl font-bold ${feature.color} group-hover:scale-105 transition-transform duration-200`}
                    >
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Trusted by Healthcare Professionals
            </h3>
            <p className="text-blue-100 text-lg">
              Join thousands of medical facilities using our system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Hospitals' },
              { number: '10K+', label: 'Daily Appointments' },
              { number: '95%', label: 'Patient Satisfaction' },
              { number: '24/7', label: 'System Uptime' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
