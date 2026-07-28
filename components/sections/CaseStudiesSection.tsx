'use client'

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import FadeInView from '@/components/ui/FadeInView'
import { staggerContainer, staggerItem, subtleCardHover } from '@/lib/motion'

interface CaseStudyCardProps {
  index: number
  shouldReduceMotion: boolean | null
}

const CaseStudyCard = memo(function CaseStudyCard({
  index,
  shouldReduceMotion
}: CaseStudyCardProps) {
  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : staggerItem}
      whileHover={shouldReduceMotion ? undefined : subtleCardHover}
      transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
      className="bg-white rounded-[20px] border border-gray-150 overflow-hidden hover:shadow-xl hover:border-brand-magenta/30 transition-shadow duration-300 flex flex-col h-full relative group"
    >
      {/* Placeholder image area with shimmer */}
      <div className="h-48 bg-gradient-to-br from-brand-red/5 via-brand-magenta/5 to-brand-purple/5 relative overflow-hidden border-b border-gray-100 flex-shrink-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(139,0,149,0.06)_0%,transparent_70%] animate-pulse" />
        <div
          className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-brand-red/10 blur-2xl animate-pulse pointer-events-none"
          style={{ animationDuration: '7s' }}
        />
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-brand-purple/10 blur-2xl animate-pulse pointer-events-none"
          style={{ animationDuration: '9s' }}
        />
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        <span className="text-[10px] font-extrabold uppercase px-3 py-1 bg-white/95 backdrop-blur-xs border border-gray-200/60 rounded-full tracking-wider text-brand-purple z-10 shadow-xs">
          Coming Soon
        </span>
      </div>

      {/* Copy and CTA block */}
      <div className="p-7 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-purple">
            Campaign Profile 0{index + 1}
          </span>

          <h3 className="text-lg font-semibold text-neutral-black leading-snug">
            {index === 0 && "Short-Form Production Strategy"}
            {index === 1 && "AI Lead Generation Campaign"}
            {index === 2 && "Devotional Channel Branding"}
          </h3>

          <p className="text-[15px] text-neutral-black/60 leading-relaxed">
            We&apos;re preparing detailed breakdowns of our client campaigns, strategy, creative process, and measurable business outcomes. These case studies will be published soon.
          </p>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 flex-shrink-0">
          <button
            disabled
            className="w-full py-3 px-4 bg-slate-50 text-neutral-black/35 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none border border-gray-200/30"
          >
            <span>Available Soon</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
})

export default function CaseStudiesSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="case-studies"
      className="py-24 bg-transparent overflow-hidden"
    >
      {/* Shimmer keyframe */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <FadeInView className="text-center mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Case Studies
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Proven Growth Stories
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            How we scale metrics, leads, and brand engagement. Detailed campaign breakdowns are coming soon.
          </p>
        </FadeInView>

        {/* Cards — stagger reveal */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
        >
          {[0, 1, 2].map((idx) => (
            <CaseStudyCard
              key={idx}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
