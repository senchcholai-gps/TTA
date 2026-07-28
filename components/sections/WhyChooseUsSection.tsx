'use client'

import React, { memo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Sparkles,
  Globe,
  BarChart3,
  Video,
  Layers,
  FileText,
  Target,
  Zap,
  ArrowRight,
  LucideIcon
} from 'lucide-react'
import { advantages, Advantage } from '@/lib/why-choose-us-data'
import FadeInView from '@/components/ui/FadeInView'

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Globe,
  BarChart3,
  Video,
  Layers,
  FileText,
  Target,
  Zap
}

interface AdvantageCardProps {
  advantage: Advantage
  index: number
  isInView: boolean
  shouldReduceMotion: boolean | null
}

const AdvantageCard = memo(function AdvantageCard({
  advantage,
  index,
  isInView,
  shouldReduceMotion
}: AdvantageCardProps) {
  const Icon = ICON_MAP[advantage.icon] ?? Sparkles

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : (isInView ? 'visible' : undefined)}
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.015, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } }}
      className="relative group p-5 rounded-xl border border-gray-150 bg-white/70 backdrop-blur-md shadow-sm transition-shadow duration-300 hover:shadow-md hover:border-brand-purple/20 flex items-start gap-4 overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-brand-red/3 via-transparent to-brand-purple/3 -m-[1px]" />
      
      {/* Subtle indicator bar */}
      <div className="absolute top-0 left-0 w-[3px] h-0 bg-brand-gradient group-hover:h-full transition-all duration-300" />

      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple/15 group-hover:text-brand-red transition-all duration-300 flex-shrink-0">
        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-bold text-neutral-black mb-1 group-hover:text-brand-text-purple transition-colors duration-200">
          {advantage.title}
        </h4>
        <p className="text-xs text-neutral-black/60 leading-relaxed">
          {advantage.description}
        </p>
      </div>
    </motion.div>
  )
})

export default function WhyChooseUsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={containerRef}
      id="why-us"
      className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* Left Sticky Column */}
          <FadeInView className="md:col-span-5 md:sticky md:top-32 space-y-6">
            <div>
              <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4 leading-tight">
                Designed for Compound Growth
              </h2>
              <p className="text-neutral-black/75 leading-relaxed">
                We combine creative on-location camera production with data-driven AI systems. Our process is transparent, performance-focused, and designed to generate measurable business outcomes.
              </p>
            </div>
            
            <div className="pt-2">
              <motion.a
                href="#contact"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] transition-shadow duration-300 btn-arrow cursor-pointer"
              >
                <span>Schedule Free Audit</span>
                <ArrowRight className="ml-2 w-4 h-4 arrow-icon" />
              </motion.a>
            </div>
          </FadeInView>

          {/* Right Cards Column */}
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            {advantages.map((adv, idx) => (
              <AdvantageCard
                key={adv.title}
                advantage={adv}
                index={idx}
                isInView={isInView}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
