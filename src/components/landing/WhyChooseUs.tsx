// components/landing/WhyChooseUs.tsx
'use client'

import { motion, Variants } from 'framer-motion'
import {
  RocketLaunchIcon,
  AcademicCapIcon,
  CogIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: RocketLaunchIcon,
      title: 'Quick Implementation',
      description:
        'Get up and running in just 24 hours with our streamlined setup process. No complex configurations or lengthy deployment cycles.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradientColor: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:bg-blue-100',
      features: [
        'One-day setup process',
        'Pre-configured templates',
        'Automated data migration',
        'Zero downtime deployment',
      ],
    },
    {
      icon: AcademicCapIcon,
      title: 'Complete Training & Support',
      description:
        'Comprehensive training programs and 24/7 expert support ensure your team masters the system quickly and efficiently.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradientColor: 'from-green-400 to-green-600',
      hoverColor: 'hover:bg-green-100',
      features: [
        'Interactive training sessions',
        '24/7 technical support',
        'Video tutorials library',
        'Dedicated success manager',
      ],
    },
    {
      icon: CogIcon,
      title: 'Fully Customizable',
      description:
        "Tailor every aspect to match your hospital's unique workflow, branding, and operational requirements with ease.",
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradientColor: 'from-purple-400 to-purple-600',
      hoverColor: 'hover:bg-purple-100',
      features: [
        'Custom branding options',
        'Workflow adaptability',
        'Role-based permissions',
        'API integrations available',
      ],
    },
    {
      icon: ShieldCheckIcon,
      title: 'HIPAA Compliant & Secure',
      description:
        'Enterprise-grade security with full HIPAA compliance ensures patient data protection and regulatory adherence.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradientColor: 'from-red-400 to-red-600',
      hoverColor: 'hover:bg-red-100',
      features: [
        'End-to-end encryption',
        'HIPAA compliance certified',
        'Regular security audits',
        'Secure cloud infrastructure',
      ],
    },
    {
      icon: ArrowPathIcon,
      title: 'Continuous Updates',
      description:
        'Stay ahead with regular feature updates, security patches, and performance improvements at no additional cost.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradientColor: 'from-orange-400 to-orange-600',
      hoverColor: 'hover:bg-orange-100',
      features: [
        'Monthly feature releases',
        'Automatic security updates',
        'Performance optimizations',
        'New integration options',
      ],
    },
    {
      icon: HeartIcon,
      title: 'Patient-Centered Design',
      description:
        'Built with healthcare professionals and patients in mind, delivering exceptional user experience for everyone.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      gradientColor: 'from-pink-400 to-pink-600',
      hoverColor: 'hover:bg-pink-100',
      features: [
        'Intuitive user interfaces',
        'Accessibility compliant',
        'Multi-language support',
        'Patient feedback integration',
      ],
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  const cardHoverVariants: Variants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for 'easeOut'
      },
    },
  }

  return (
    <section
      id="why-choose-us"
      className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
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
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our System?
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover what makes our Patient Queue Management System the
            preferred choice for healthcare facilities worldwide. Experience the
            difference quality makes.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="group"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className={`relative overflow-hidden rounded-3xl border-2 ${reason.borderColor} ${reason.bgColor} p-8 h-full shadow-lg transition-all duration-300 ${reason.hoverColor} hover:shadow-2xl hover:border-opacity-60`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div
                      className={`w-full h-full bg-gradient-to-br ${reason.gradientColor} rounded-full transform translate-x-16 -translate-y-16`}
                    ></div>
                  </div>

                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${reason.gradientColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3
                      className={`text-2xl font-bold ${reason.color} mb-4 group-hover:scale-105 transition-transform duration-200`}
                    >
                      {reason.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      {reason.description}
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-2">
                      {reason.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ x: -10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${reason.gradientColor}`}
                          ></div>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mt-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join 500+ Healthcare Facilities
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Transform your patient experience today with our award-winning
                queue management system. Trusted by hospitals worldwide.
              </p>

              <div className="flex flex-wrap justify-center gap-8 mb-8">
                {[
                  { number: '99.9%', label: 'Uptime Guarantee' },
                  { number: '< 24h', label: 'Implementation Time' },
                  { number: '500+', label: 'Happy Hospitals' },
                  { number: '24/7', label: 'Expert Support' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="text-3xl font-bold text-blue-600 group-hover:text-purple-600 transition-colors duration-200">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById('home')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  Start Your Transformation Today
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
