// components/landing/Contact.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import { useState } from 'react'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM EST',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'support@pqms.com',
      subtitle: '24/7 Support Available',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MapPinIcon,
      title: 'Address',
      details: '123 Healthcare Ave',
      subtitle: 'Medical District, NY 10001',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Monday - Friday',
      subtitle: '9:00 AM - 6:00 PM EST',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    }, 3000)
  }

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

  return (
    <section
      id="contact"
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
            Get in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Ready to transform your healthcare facility? Contact us for a demo,
            consultation, or any questions about our queue management system.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 text-lg">
                We're here to help you implement the perfect queue management
                solution for your healthcare facility.
              </p>
            </motion.div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group"
                  >
                    <div
                      className={`relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-opacity-60`}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                        <div
                          className={`w-full h-full ${info.bgColor} rounded-full transform translate-x-8 -translate-y-8`}
                        ></div>
                      </div>

                      <div className="flex items-start space-x-4 relative z-10">
                        <div
                          className={`w-14 h-14 ${info.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                        >
                          <IconComponent className={`w-7 h-7 ${info.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {info.title}
                          </h4>
                          <p
                            className={`${info.color} font-semibold text-lg mb-1`}
                          >
                            {info.details}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {info.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="demo">Request a Demo</option>
                        <option value="pricing">Pricing Information</option>
                        <option value="implementation">
                          Implementation Support
                        </option>
                        <option value="technical">Technical Questions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us about your healthcare facility and how we can help..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll get back to you within 24
                    hours.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
