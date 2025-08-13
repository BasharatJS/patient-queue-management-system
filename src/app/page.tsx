// app/page.tsx
'use client'

import { useRef } from 'react'
import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  WhyChooseUs,
  Screenshots,
  Contact,
  Footer,
} from '@/components/landing'

export default function HomePage() {
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Navigation */}
      <Navbar onSectionClick={handleSectionClick} />
      
      {/* Page Sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <Screenshots />
      <Contact />
      <Footer />
    </div>
  )
}
