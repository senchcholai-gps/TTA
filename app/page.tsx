'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'
import InfiniteMarquee from '@/components/InfiniteMarquee'
import { motion, useReducedMotion } from 'framer-motion'
import FadeInView from '@/components/ui/FadeInView'

// Section Imports
import ServicesSection from '@/components/sections/ServicesSection'
import IndustriesSection from '@/components/sections/IndustriesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import OurProcessSection from '@/components/sections/OurProcessSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import AboutSection from '@/components/sections/AboutSection'
import PricingSection from '@/components/sections/PricingSection'
import FAQSection from '@/components/sections/FAQSection'
import ContactSection from '@/components/sections/ContactSection'
import BlogSection from '@/components/sections/BlogSection'

// UI Imports
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp'
import StickyConsultationCTA from '@/components/ui/StickyConsultationCTA'
import HeroBrowserShowcase from '@/components/ui/HeroBrowserShowcase'

export default function Home() {
  const shouldReduceMotion = useReducedMotion()

  const clientLogos = [
    { name: 'UNICEF', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UNICEF-y6MyOOKAx8EQtBTbfXFwHWEikptNH4.png' },
    { name: 'Maven Consulting', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png' },
    { name: 'Jashmi Investment', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jashmi%20Investment%20OG-goF9QlKoFLmlXVsrVdJrtK2VkPa0jh.png' },
    { name: 'Maven Education', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dubai%20white%20bg-kZiV7txXe4NrIVW2X3wvZf5pIPTtg5.png' },
    { name: 'The Book Show', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BOOK%20SHOW%20BLACK%20%281%29%20%281%29-i10FK1CNukXX8qVzO2KYu8Y8El7ji2.png' },
    { name: 'Why Tap', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WHY%20TAP-VIHSkp7bSVxdPtM0AS58hlx8GqSADW.png' },
    { name: 'Namma Yatri', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NAMMA%20YATRI-Yg2ysSqLXnZIWKVT4JNO4NcXRdrECN.png' },
    { name: 'Ather', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ATHER-sLXUFIZEC449oB5q2oL3R4oj0MhBAa.png' },
    { name: 'Yellow Owl', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/YELLOW%20OWL-wHKFoboqZgrZM3Lqv5us1LUgND6ucd.png' },
    { name: 'Aara\'s Chicken', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20alone%2001-hv3lhoxVZPNxauFyWA0pKKx1g3DI2L.jpeg' },
    { name: 'Bhakthi Infinity', logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg' }
  ]

  const handleScrollToContact = () => {
    const contactSec = document.getElementById('contact')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full bg-[#FDFBFF] relative overflow-hidden text-neutral-black">
      <Header />

      {/* Continuous Subtle Ambient Lighting Canvas (Spans entire page below Hero) */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          {/* 1. About Us Ambient Glow (Top Left) */}
          <motion.div
            animate={{ x: [-6, 6, -6], y: [-4, 4, -4], opacity: [0.025, 0.04, 0.025] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[500px] left-[-5%] w-[900px] h-[900px] bg-gradient-to-br from-brand-purple via-brand-magenta to-transparent rounded-full blur-[240px]"
          />

          {/* 2. Services Ambient Glow (Top Right) */}
          <motion.div
            animate={{ x: [8, -8, 8], y: [5, -5, 5], opacity: [0.02, 0.035, 0.02] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[1500px] right-[-5%] w-[1000px] h-[1000px] bg-gradient-to-br from-brand-red via-brand-magenta to-transparent rounded-full blur-[260px]"
          />

          {/* 3. Industries & Portfolio Ambient Glow (Middle Left) */}
          <motion.div
            animate={{ x: [-8, 8, -8], y: [6, -6, 6], opacity: [0.02, 0.035, 0.02] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[2700px] left-[-8%] w-[950px] h-[950px] bg-gradient-to-br from-brand-purple via-blue-500 to-transparent rounded-full blur-[250px]"
          />

          {/* 4. Testimonials & Process Ambient Glow (Middle Right) */}
          <motion.div
            animate={{ x: [6, -6, 6], y: [-5, 5, -5], opacity: [0.02, 0.03, 0.02] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[3900px] right-[-6%] w-[1000px] h-[1000px] bg-gradient-to-br from-brand-magenta via-brand-red to-transparent rounded-full blur-[260px]"
          />

          {/* 5. Pricing, FAQ & Contact Ambient Glow (Bottom Diagonal) */}
          <motion.div
            animate={{ x: [-7, 7, -7], y: [4, -4, 4], opacity: [0.02, 0.035, 0.02] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[5100px] left-[10%] w-[1050px] h-[1050px] bg-gradient-to-br from-brand-purple via-brand-magenta to-transparent rounded-full blur-[260px]"
          />
        </div>
      )}

      {/* Hero Section — Kept EXACTLY as it is */}
      <section id="home" className="relative overflow-hidden bg-white" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="absolute inset-0 bg-radial-[circle_at_center,var(--color-neutral-white)_0%,#fafafa_100%]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-brand-red/10 to-brand-magenta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-brand-purple/10 to-brand-magenta/10 rounded-full blur-3xl" />

        {/* Subtle low-opacity background watermark graphic */}
        <div className="absolute right-[-10%] bottom-[-5%] w-[600px] h-[600px] opacity-[0.03] select-none pointer-events-none">
          <img src="/TTA_Logo_Icon.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute left-[-10%] top-[-5%] w-[500px] h-[500px] opacity-[0.03] select-none pointer-events-none">
          <img src="/TTA_Logo_Icon.png" alt="" className="w-full h-full object-contain animate-pulse" style={{ animationDuration: '8s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" style={{ minHeight: '450px' }}>
            
            {/* Left Column - Content */}
            <FadeInView className="lg:col-span-5 text-left flex flex-col justify-center">
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-black text-neutral-black tracking-tight leading-tight" style={{ marginBottom: '20px' }}>
                Accelerate Your <br />
                <span className="text-brand-gradient">Growth</span> Today
              </h1>

              {/* Paragraph */}
              <p className="text-base md:text-lg text-neutral-black/70 max-w-lg leading-relaxed font-semibold" style={{ marginBottom: '28px' }}>
                AI-powered marketing solutions, compelling content, and performance-driven campaigns that generate leads, boost engagement, and grow your brand.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleScrollToContact}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="px-6 py-3.5 bg-brand-gradient text-white rounded-xl font-semibold hover:shadow-[0_8px_30px_rgba(214,0,60,0.35)] transition-shadow duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm btn-arrow"
                >
                  <span>Schedule Free Audit</span>
                  <ArrowRight size={16} className="arrow-icon" />
                </motion.button>
                <motion.button
                  onClick={handleScrollToContact}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="px-6 py-3.5 border-2 border-brand-purple/20 text-brand-purple rounded-xl font-semibold hover:bg-brand-purple/5 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand-purple">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Watch Demo</span>
                </motion.button>
              </div>

            </FadeInView>

            {/* Right Column - Browser Mockup */}
            <div className="lg:col-span-7 w-full relative">
              <div className="relative max-w-2xl mx-auto lg:mr-0">
                {/* Left Purple/Magenta Glow */}
                <div className="absolute left-[-15%] top-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-brand-purple to-brand-magenta rounded-full blur-[100px] opacity-[0.15] -z-10 pointer-events-none" />
                
                {/* Right Blue/Purple Glow */}
                <div className="absolute right-[-15%] bottom-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-blue-500 to-brand-purple rounded-full blur-[100px] opacity-[0.15] -z-10 pointer-events-none" />

                {/* Browser Frame */}
                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-md">
                  {/* Aspect container for the interactive animation */}
                  <div className="w-full relative bg-transparent" style={{ height: '450px' }}>
                    <HeroBrowserShowcase />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Centered Trusted by Industry Leaders and Infinite Marquee */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '40px' }}>
          <div className="mx-auto w-fit px-4 py-1.5 bg-brand-purple/10 text-brand-purple rounded-full text-[10px] font-black tracking-widest uppercase" style={{ marginBottom: '16px' }}>
            Trusted by Industry Leaders
          </div>
          <InfiniteMarquee items={clientLogos} isLogoMode={true} speed={35} />
        </div>
      </section>

      {/* 2. About Us */}
      <AboutSection />

      {/* 3. Services */}
      <ServicesSection />

      {/* 4. Industries */}
      <IndustriesSection />

      {/* 5. Portfolio */}
      <PortfolioSection />

      {/* 6. Case Studies */}
      <CaseStudiesSection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Our Process */}
      <OurProcessSection />

      {/* 9. Pricing */}
      <PricingSection />

      {/* 10. FAQs */}
      <FAQSection />

      {/* 11. Blog */}
      <BlogSection />

      {/* 12. Contact & 13. Free Marketing Audit Form */}
      <ContactSection />

      <Footer />

      {/* Floating UI Elements */}
      <FloatingWhatsApp />
      <StickyConsultationCTA />
    </div>
  )
}
