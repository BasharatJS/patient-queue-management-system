// components/landing/Footer.tsx
'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Screenshots', href: '#screenshots' },
        { name: 'Pricing', href: '#contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#contact' },
        { name: 'Documentation', href: '#contact' },
        { name: 'API Reference', href: '#contact' },
        { name: 'Training', href: '#contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#contact' },
        { name: 'Careers', href: '#contact' },
        { name: 'Blog', href: '#contact' },
        { name: 'News', href: '#contact' },
      ],
    },
    // {
    //   title: 'Legal',
    //   links: [
    //     { name: 'Privacy Policy', href: '#contact' },
    //     { name: 'Terms of Service', href: '#contact' },
    //     { name: 'HIPAA Compliance', href: '#contact' },
    //     { name: 'Security', href: '#contact' },
    //   ],
    // },
  ]

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">PQ</span>
                  </div>
                  <h3 className="text-xl font-bold">
                    Patient Queue Management System
                  </h3>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Transforming healthcare facilities with intelligent queue
                  management solutions. Streamline operations, enhance patient
                  experience, and optimize workflow efficiency.
                </p>

                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin', 'github'].map(
                    (social, index) => (
                      <motion.div
                        key={social}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <span className="text-sm font-semibold capitalize">
                          {social[0]}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-gray-300 hover:text-white transition-colors hover:underline"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300">
              © {currentYear} Patient Queue Management System. All rights
              reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-300">Made with</span>
              <span className="text-red-400">❤️</span>
              <span className="text-gray-300">for better healthcare</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Status: Operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
