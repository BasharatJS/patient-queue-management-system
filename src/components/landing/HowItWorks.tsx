// components/landing/HowItWorks.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import {
  UserPlusIcon,
  QueueListIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: UserPlusIcon,
      title: 'Choose Your Role',
      description:
        "Select whether you're a patient, receptionist, or doctor to access the appropriate dashboard with tailored features.",
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradientColor: 'from-blue-400 to-blue-600',
    },
    {
      step: 2,
      icon: QueueListIcon,
      title: 'Book or Join Queue',
      description:
        'Patients can book appointments online or join as walk-ins. Receptionists manage registrations and queue assignments.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradientColor: 'from-green-400 to-green-600',
    },
    {
      step: 3,
      icon: CheckCircleIcon,
      title: 'Track & Manage',
      description:
        'Real-time updates on queue positions, wait times, and appointment status. Doctors can call next patients efficiently.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradientColor: 'from-purple-400 to-purple-600',
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  const arrowVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    },
  }

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
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
            How It{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Get started in just three simple steps. Our intuitive system makes
            queue management effortless for everyone involved.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative"
        >
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon

              return (
                <div key={step.step} className="flex items-center">
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="text-center max-w-sm group"
                  >
                    {/* Step Number */}
                    <div className="relative mb-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                        className={`w-20 h-20 bg-gradient-to-r ${step.gradientColor} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {step.step}
                        </span>
                      </motion.div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-8 h-8 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3
                      className={`text-2xl font-bold ${step.color} mb-4 group-hover:scale-105 transition-transform duration-200`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <motion.div variants={arrowVariants} className="mx-8">
                      <ArrowRightIcon className="w-8 h-8 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon

              return (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="text-center group"
                >
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className={`w-20 h-20 bg-gradient-to-r ${step.gradientColor} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {step.step}
                      </span>
                    </motion.div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-2xl font-bold ${step.color} mb-4 group-hover:scale-105 transition-transform duration-200`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mt-20 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your healthcare facility with our intelligent queue
              management system. Simple setup, powerful results.
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
              Choose Your Role
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
