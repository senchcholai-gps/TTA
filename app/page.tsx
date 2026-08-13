'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'
import InfiniteMarquee, { MarqueeItem } from '@/components/InfiniteMarquee'
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
import HeroShowcaseWrapper from '@/components/ui/HeroShowcaseWrapper'


export default function Home() {
  const shouldReduceMotion = useReducedMotion()

  const clientLogos: MarqueeItem[] = [
    {
      name: 'UNICEF',
      logo: '/logos/optimized/unicef.png',
      maxHeight: '28px',
      maxWidth: '130px',
      scale: 0.82,
      opacity: 0.95,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: 'Maven Consulting',
      logo: '/logos/optimized/maven-consulting.png',
      maxHeight: '40px',
      maxWidth: '175px',
      scale: 1.25,
      opacity: 0.98,
      contrast: 1.15,
      brightness: 0.95
    },
    {
      name: 'Jashmi Investment',
      logo: '/logos/optimized/jashmi-investment.png',
      maxHeight: '46px',
      maxWidth: '130px',
      scale: 1.30,
      opacity: 0.98,
      contrast: 1.20,
      brightness: 0.90
    },
    {
      name: 'Maven Education',
      logo: '/logos/optimized/maven-education.png',
      maxHeight: '40px',
      maxWidth: '145px',
      scale: 1.15,
      opacity: 0.98,
      contrast: 1.15,
      brightness: 0.95
    },
    {
      name: 'The Book Show',
      logo: '/logos/optimized/the-book-show.png',
      maxHeight: '46px',
      maxWidth: '90px',
      scale: 1.20,
      opacity: 0.98,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: 'Why Tap',
      logo: '/logos/optimized/why-tap.png',
      maxHeight: '36px',
      maxWidth: '135px',
      scale: 1.05,
      opacity: 0.95,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: 'Namma Yatri',
      logo: '/logos/optimized/namma-yatri.png',
      maxHeight: '36px',
      maxWidth: '140px',
      scale: 1.05,
      opacity: 0.95,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: 'Ather',
      logo: '/logos/optimized/ather.png',
      maxHeight: '30px',
      maxWidth: '135px',
      scale: 0.92,
      opacity: 0.95,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: 'Yellow Owl',
      logo: '/logos/optimized/yellow-owl.png',
      maxHeight: '30px',
      maxWidth: '145px',
      scale: 0.92,
      opacity: 0.95,
      contrast: 1.0,
      brightness: 1.0
    },
    {
      name: "Aara's Chicken",
      logo: '/logos/optimized/aaras-chicken.png',
      maxHeight: '44px',
      maxWidth: '125px',
      scale: 1.15,
      opacity: 0.98,
      contrast: 1.15,
      brightness: 0.95
    }
  ]

  const handleScrollToContact = () => {
    const contactSec = document.getElementById('contact')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToPortfolio = () => {
    const portfolioSec = document.getElementById('portfolio')
    if (portfolioSec) {
      portfolioSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full bg-transparent relative overflow-clip text-neutral-black">
      <Header />



      {/* Hero Section — Kept EXACTLY as it is, but made backgrounds translucent */}
      <section id="home" className="relative overflow-hidden bg-transparent" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(253,251,255,0.75)_0%,rgba(253,251,255,0.25)_100%]" />
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" style={{ minHeight: '450px' }}>
            
            {/* Left Column - Content */}
            <FadeInView className="lg:col-span-5 text-left flex flex-col justify-center pt-6 lg:pt-0">
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-black tracking-tight leading-[1.2]" style={{ marginBottom: '20px' }}>
                Accelerate Your <br />
                <span className="text-brand-gradient inline-block" style={{ paddingTop: '0.4em', marginTop: '-0.4em', paddingBottom: '0.1em' }}>Growth</span> Today
              </h1>

              {/* Paragraph */}
              <p className="text-sm sm:text-base md:text-lg text-neutral-black/70 max-w-lg leading-relaxed font-semibold" style={{ marginBottom: '28px' }}>
                AI-powered marketing solutions, compelling content, and performance-driven campaigns that generate leads, boost engagement, and grow your brand.
              </p>

              {/* Buttons */}
              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4">
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
                  onClick={handleScrollToPortfolio}
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
              <div className="relative w-full max-w-3xl mx-auto lg:mr-0">
                {/* Left Purple/Magenta Glow */}
                <div className="absolute left-[-15%] top-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-brand-purple to-brand-magenta rounded-full blur-[100px] opacity-[0.15] -z-10 pointer-events-none" />
                {/* Right Blue/Purple Glow */}
                <div className="absolute right-[-15%] bottom-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-blue-500 to-brand-purple rounded-full blur-[100px] opacity-[0.15] -z-10 pointer-events-none" />

                {/* Responsive Browser Frame — scales perfectly to every viewport */}
                <HeroShowcaseWrapper />
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
