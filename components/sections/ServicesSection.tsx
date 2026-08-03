'use client'

import React, { useState, useEffect, memo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion'
import { ChevronDown, CheckCircle2, ArrowRight, X } from 'lucide-react'
import { serviceCategories, ServiceCategory } from '@/lib/services-data'
import FadeInView from '@/components/ui/FadeInView'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

interface ServiceCardProps {
  category: ServiceCategory
  index: number
  expandedService: string | null
  setExpandedService: (id: string | null) => void
  shouldReduceMotion: boolean | null
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: CUBIC_EASE,
      delay: (i % 2 === 0 ? i * 0.12 : i * 0.12 + 0.08),
    },
  }),
}

const ServiceCard = memo(function ServiceCard({
  category,
  index,
  expandedService,
  setExpandedService,
  shouldReduceMotion
}: ServiceCardProps) {
  const Icon = category.icon
  const isExpanded = expandedService === category.id

  // Floating animation parameters per card
  const floatDuration = 6 + (index % 3) * 0.8
  const floatDelay = (index % 4) * 0.5

  return (
    <motion.div
      custom={index}
      variants={shouldReduceMotion ? undefined : cardVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -10,
              scale: 1.015,
              transition: { duration: 0.25, ease: CUBIC_EASE },
            }
      }
      className={`group relative h-full p-3.5 sm:p-5 lg:p-6 bg-white/95 backdrop-blur-md rounded-2xl border ${
        isExpanded
          ? 'border-brand-purple/60 shadow-xl'
          : 'border-gray-150 shadow-sm hover:shadow-xl hover:border-brand-purple/35'
      } transition-all duration-300 flex flex-col justify-between select-none`}
    >
      {/* Light Sweep Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none overflow-hidden" />

      {/* Top Thin Animated Gradient Line */}
      <div className="absolute top-0 left-5 right-5 h-[2.5px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-grow justify-between">
        {/* 1. Icon Container */}
        <div className="mb-3 sm:mb-4">
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -2, 0] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }
            }
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-red/10 via-brand-magenta/10 to-brand-purple/10 group-hover:bg-brand-gradient rounded-xl shadow-xs group-hover:scale-105 group-hover:rotate-5 transition-all duration-300"
          >
            <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-brand-purple group-hover:text-white transition-colors duration-300" />
          </motion.div>
        </div>

        {/* 2. Fixed Title Area */}
        <div className="min-h-0 sm:min-h-[2.85rem] flex items-start mb-1.5 sm:mb-2.5">
          <h3 className="text-xs sm:text-base lg:text-lg font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors duration-300">
            {category.title}
          </h3>
        </div>

        {/* 3. Fixed Description Area */}
        <div className="min-h-0 sm:min-h-[3.25rem] flex items-start mb-3 sm:mb-4">
          <p className="hidden sm:block text-neutral-black/70 leading-relaxed text-xs sm:text-sm font-normal">
            {category.description}
          </p>
        </div>
      </div>

      {/* 4. Bottom CTA & Trigger Button */}
      <div className="mt-auto pt-3.5 border-t border-gray-100/80">
        <button
          onClick={() => setExpandedService(category.id)}
          aria-expanded={isExpanded}
          className="flex items-center justify-between w-full text-brand-purple font-semibold text-xs md:text-sm hover:text-brand-text-purple transition-colors duration-300 focus:outline-none cursor-pointer group/btn"
        >
          <span className="flex items-center gap-1.5 group-hover/btn:translate-x-0.5 transition-transform duration-300">
            <span>View All {category.services.length} Services</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
          </span>
          <ChevronDown
            size={15}
            className="text-brand-purple/60 group-hover/btn:text-brand-purple transition-colors duration-300 -rotate-90"
          />
        </button>
      </div>
    </motion.div>
  )
})

export default function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeCategory = serviceCategories.find(c => c.id === expandedService)

  // Handle scroll lock and Escape key for Modal
  useEffect(() => {
    if (expandedService) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedService(null)
    }

    if (expandedService) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedService])

  const handleScrollToContact = () => {
    setExpandedService(null)
    const contactSec = document.getElementById('contact')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="services" className="py-14 sm:py-16 md:py-20 lg:py-24 bg-transparent relative overflow-visible isolate">
      {/* Decorative Drifting Background Radial Blobs */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ x: [-35, 35, -35], y: [-15, 15, -15], opacity: [0.04, 0.06, 0.04] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-brand-red via-brand-magenta to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          />
          <motion.div
            animate={{ x: [35, -35, 35], y: [15, -15, 15], opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-gradient-to-br from-brand-purple via-brand-magenta to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          />
        </>
      )}

      {/* Subtle dot-grid behind cards */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c026d3 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Faint AI network SVG — decorative, behind all cards */}
      {!shouldReduceMotion && (
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 600 400"
          className="absolute right-[5%] top-[15%] w-[380px] opacity-[0.028] pointer-events-none -z-10"
          animate={{ opacity: [0.022, 0.035, 0.022] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Network edges */}
          <line x1="80" y1="80" x2="200" y2="140" stroke="#7c3aed" strokeWidth="1"/>
          <line x1="200" y1="140" x2="350" y2="90" stroke="#7c3aed" strokeWidth="1"/>
          <line x1="350" y1="90" x2="500" y2="160" stroke="#7c3aed" strokeWidth="1"/>
          <line x1="200" y1="140" x2="280" y2="260" stroke="#c026d3" strokeWidth="1"/>
          <line x1="280" y1="260" x2="420" y2="300" stroke="#c026d3" strokeWidth="1"/>
          <line x1="420" y1="300" x2="500" y2="160" stroke="#7c3aed" strokeWidth="1"/>
          <line x1="80" y1="80" x2="280" y2="260" stroke="#c026d3" strokeWidth="0.5"/>
          <line x1="350" y1="90" x2="280" y2="260" stroke="#7c3aed" strokeWidth="0.5"/>
          {/* Network nodes */}
          <circle cx="80" cy="80" r="5" fill="#7c3aed"/>
          <circle cx="200" cy="140" r="7" fill="#c026d3"/>
          <circle cx="350" cy="90" r="5" fill="#7c3aed"/>
          <circle cx="500" cy="160" r="6" fill="#7c3aed"/>
          <circle cx="280" cy="260" r="8" fill="#c026d3"/>
          <circle cx="420" cy="300" r="5" fill="#7c3aed"/>
        </motion.svg>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInView className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Services We Provide
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto font-medium">
            Comprehensive marketing solutions designed to drive measurable business results.
          </p>
        </FadeInView>

        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 items-stretch overflow-visible">
          {serviceCategories.map((category, index) => (
            <ServiceCard
              key={category.id}
              category={category}
              index={index}
              expandedService={expandedService}
              setExpandedService={setExpandedService}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>

      {/* MODAL OVERLAY — Portal directly into document.body to escape parent transform containing blocks */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeCategory && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden isolate">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 bg-black/40 backdrop-blur-[14px]"
                onClick={() => setExpandedService(null)}
                aria-hidden="true"
              />

              {/* Modal Dialog — Truly Centered relative to Viewport */}
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[760px] max-h-[85vh] sm:max-h-[80vh] bg-white/98 backdrop-blur-xl rounded-[24px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)] border border-white/40 flex flex-col overflow-hidden z-10 my-auto"
              >
                {/* Modal Header */}
                <div className="flex-shrink-0 flex items-start justify-between p-6 sm:p-8 border-b border-gray-100 bg-white/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red/10 via-brand-magenta/10 to-brand-purple/10 flex items-center justify-center text-brand-purple flex-shrink-0">
                      <activeCategory.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-black mb-1.5">
                        {activeCategory.title}
                      </h3>
                      <p className="text-sm text-neutral-black/70">
                        {activeCategory.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedService(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-neutral-500 hover:text-neutral-black transition-colors duration-200 cursor-pointer ml-4 flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body — ONLY this region scrolls */}
                <div
                  className="flex-grow min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
                  onWheel={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-black uppercase tracking-wider">
                      Included Services
                    </h4>
                    <div className="h-px flex-grow bg-gray-100" />
                  </div>
                  
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {activeCategory.services.map((service, i) => (
                      <motion.li
                        key={i}
                        initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-purple/5 transition-colors duration-200 group/item"
                      >
                        <CheckCircle2 size={16} className="text-brand-purple mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                        <span className="text-[13px] sm:text-sm text-neutral-black/80 font-medium leading-snug">
                          {service}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Modal Footer */}
                <div className="flex-shrink-0 p-6 sm:p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
                      {activeCategory.services.length}
                    </span>
                    <span className="text-sm font-semibold text-neutral-black/60">
                      Total specialized services
                    </span>
                  </div>
                  
                  <button
                    onClick={handleScrollToContact}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-gradient text-white rounded-xl text-sm font-semibold hover:shadow-[0_8px_20px_rgba(214,0,60,0.25)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer btn-arrow"
                  >
                    <span>Book Free Audit</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}

