'use client'

import React, { useState, useEffect, useRef, memo } from 'react'
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
  const cardRef = useRef<HTMLDivElement>(null)

  // Column position for smart popover alignment
  const isRightColumn = (index + 1) % 3 === 0
  const isCenterColumn = (index + 1) % 3 === 2

  // Handle click outside & Escape key to close popover
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setExpandedService(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedService(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded, setExpandedService])

  // Floating animation parameters per card
  const floatDuration = 6 + (index % 3) * 0.8
  const floatDelay = (index % 4) * 0.5

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedService(null)
    const contactSec = document.getElementById('contact')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      ref={cardRef}
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
      className={`group relative h-full p-6 bg-white/95 backdrop-blur-md rounded-2xl border ${
        isExpanded
          ? 'border-brand-purple/60 shadow-xl z-[60]'
          : 'border-gray-150 shadow-sm hover:shadow-xl hover:border-brand-purple/35 z-10'
      } transition-all duration-300 flex flex-col justify-between overflow-visible select-none`}
    >
      {/* Light Sweep Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none overflow-hidden" />

      {/* Top Thin Animated Gradient Line */}
      <div className="absolute top-0 left-5 right-5 h-[2.5px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-grow justify-between">
        {/* 1. Icon Container */}
        <div className="mb-4">
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
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-red/10 via-brand-magenta/10 to-brand-purple/10 group-hover:bg-brand-gradient rounded-xl shadow-xs group-hover:scale-105 group-hover:rotate-5 transition-all duration-300"
          >
            <Icon className="w-5 h-5 text-brand-purple group-hover:text-white transition-colors duration-300" />
          </motion.div>
        </div>

        {/* 2. Fixed Title Area */}
        <div className="min-h-[2.85rem] flex items-start mb-2.5">
          <h3 className="text-lg font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors duration-300">
            {category.title}
          </h3>
        </div>

        {/* 3. Fixed Description Area */}
        <div className="min-h-[3.25rem] flex items-start mb-4">
          <p className="text-neutral-black/70 leading-relaxed text-xs md:text-sm font-normal">
            {category.description}
          </p>
        </div>
      </div>

      {/* 4. Bottom CTA & Trigger Button */}
      <div className="mt-auto pt-3.5 border-t border-gray-100/80">
        <button
          onClick={() => setExpandedService(isExpanded ? null : category.id)}
          aria-expanded={isExpanded}
          className="flex items-center justify-between w-full text-brand-purple font-semibold text-xs md:text-sm hover:text-brand-text-purple transition-colors duration-300 focus:outline-none cursor-pointer group/btn"
        >
          <span className="flex items-center gap-1.5 group-hover/btn:translate-x-0.5 transition-transform duration-300">
            <span>{isExpanded ? 'Close Panel' : `View All ${category.services.length} Services`}</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
          </span>
          <ChevronDown
            size={15}
            className={`transition-transform duration-300 ${
              isExpanded ? 'rotate-180 text-brand-purple' : 'text-neutral-black/45'
            }`}
          />
        </button>
      </div>

      {/* 5. INDEPENDENT FLOATING OVERLAY POPOVER (position: absolute; z-index: 100; top: calc(100% + 12px)) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: CUBIC_EASE }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              zIndex: 100
            }}
            className={`w-[calc(100vw-2.5rem)] sm:w-[360px] ${
              isRightColumn
                ? 'right-0'
                : isCenterColumn
                ? 'left-1/2 -translate-x-1/2'
                : 'left-0'
            } p-5 bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-purple/20 shadow-[0_20px_60px_rgba(90,40,180,0.18)] flex flex-col gap-4 text-left pointer-events-auto select-text`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                  <Icon size={16} />
                </div>
                <h4 className="font-bold text-neutral-black text-sm">{category.title}</h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedService(null)
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-neutral-500 hover:text-neutral-black transition-colors duration-200 cursor-pointer"
                aria-label="Close services popup"
              >
                <X size={14} />
              </button>
            </div>

            {/* 2-Column Service List with Checkmarks */}
            <div className="max-h-[250px] overflow-y-auto pr-1 scrollbar-none">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
                {category.services.map((service, i) => (
                  <motion.li
                    key={i}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/80 hover:bg-brand-purple/5 border border-gray-100/80 transition-colors duration-200"
                  >
                    <CheckCircle2 size={13} className="text-brand-purple mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-black/90 font-medium leading-snug">{service}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Bottom Panel Action CTA */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-black/55">
                {category.services.length} Total Services Included
              </span>
              <button
                onClick={handleScrollToContact}
                className="px-3.5 py-2 bg-brand-gradient text-white rounded-lg text-xs font-semibold hover:shadow-[0_4px_15px_rgba(214,0,60,0.3)] transition-shadow duration-300 flex items-center gap-1.5 cursor-pointer btn-arrow"
              >
                <span>Book Free Audit</span>
                <ArrowRight size={12} className="arrow-icon" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="services" className="py-24 bg-transparent relative overflow-visible isolate">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <FadeInView className="mb-16 text-center">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Services We Provide
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto font-medium">
            Comprehensive marketing solutions designed to drive measurable business results.
          </p>
        </FadeInView>

        {/* Grid Container — items-stretch enforces identical height across all cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch overflow-visible">
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
    </section>
  )
}
