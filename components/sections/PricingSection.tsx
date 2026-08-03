'use client'

import React, { memo } from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import FadeInView from '@/components/ui/FadeInView'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

interface PricingPlanData {
  name: string
  description: string
}

const pricingPlansData: PricingPlanData[] = [
  {
    name: 'Starter',
    description: 'For businesses beginning their content and digital growth journey.'
  },
  {
    name: 'Growth',
    description: 'For brands looking to build consistency and scale their online presence.'
  },
  {
    name: 'Premium',
    description: 'For businesses ready to accelerate growth with higher production and deeper strategy.'
  },
  {
    name: 'Enterprise',
    description: 'For established brands requiring fully customized campaigns and long-term partnerships.'
  }
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: CUBIC_EASE,
    },
  },
}

interface PricingCardProps {
  plan: PricingPlanData
  shouldReduceMotion: boolean | null
}

const PricingCard = memo(function PricingCard({
  plan,
  shouldReduceMotion
}: PricingCardProps) {
  return (
    <motion.div
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
      className="bg-white/90 backdrop-blur-md border border-gray-150 rounded-3xl shadow-sm hover:shadow-2xl hover:border-brand-purple/35 transition-all duration-300 flex flex-col justify-between h-full p-5 sm:p-8 relative overflow-hidden group text-center"
    >
      {/* Moving Light Sweep on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Top Thin Animated Gradient Accent */}
      <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div className="space-y-6 relative z-10 flex-grow flex flex-col justify-between">
        <div className="space-y-4 pt-2">
          {/* Custom Proposal Badge */}
          <div className="mx-auto w-fit px-3 py-1 bg-brand-purple/5 text-brand-purple border border-brand-purple/10 rounded-full text-[9px] font-extrabold uppercase tracking-wider group-hover:bg-brand-purple/10 transition-colors duration-300">
            Custom Proposal
          </div>

          {/* Tier Name */}
          <h3 className="text-2xl font-black text-neutral-black group-hover:text-brand-purple transition-colors duration-300">
            {plan.name}
          </h3>

          {/* Description */}
          <p className="text-[15px] text-neutral-black/65 leading-relaxed max-w-xs mx-auto font-medium">
            {plan.description}
          </p>
        </div>

        {/* Action block */}
        <div className="space-y-4 mt-8 pt-6 border-t border-gray-100">
          {/* Primary CTA: Enquire Now */}
          <motion.a
            href="#contact"
            className="w-full py-3.5 bg-brand-gradient text-white rounded-xl text-xs font-bold hover:shadow-[0_8px_30px_rgba(214,0,60,0.35)] transition-all duration-300 flex items-center justify-center cursor-pointer group/btn"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          >
            <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">Enquire Now</span>
          </motion.a>

          {/* Secondary CTA Links */}
          <div className="flex flex-col gap-2.5 text-xs">
            <a
              href="https://wa.me/918526462969"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-gray-200/50 hover:border-brand-purple/20 text-neutral-black/75 hover:text-brand-purple rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer group/wa"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.023-5.116-2.887-6.98C16.584 1.895 14.11 .87 11.47.868 6.035.868 1.61 5.291 1.606 10.733c-.001 1.682.449 3.32 1.302 4.773L1.93 20.17l4.717-1.016z" />
              </svg>
              <span className="group-hover/wa:translate-x-0.5 transition-transform duration-300">Chat on WhatsApp</span>
            </a>
            <a
              href="mailto:thethreeamigosdm@gmail.com"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-gray-200/50 hover:border-brand-purple/20 text-neutral-black/75 hover:text-brand-purple rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer group/mail"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="group-hover/mail:translate-x-0.5 transition-transform duration-300">Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function PricingSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="pricing"
      className="py-14 sm:py-16 md:py-20 lg:py-24 bg-transparent overflow-hidden relative"
    >
      {/* Decorative Drifting Background Radial Blobs (3-6% opacity, 20-30s loop) */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ x: [-35, 35, -35], y: [-15, 15, -15], opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-brand-red via-brand-magenta to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          />
          <motion.div
            animate={{ x: [35, -35, 35], y: [15, -15, 15], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-brand-purple via-brand-magenta to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <FadeInView className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Flexible Engagement Models
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Pricing Packages
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            Every brand has different goals. Choose the engagement level that best fits your stage, and we'll tailor the strategy around your requirements.
          </p>
        </FadeInView>

        {/* Pricing Cards — stagger reveal */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 items-stretch"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
        >
          {pricingPlansData.map((plan) => (
            <div key={plan.name} className="h-full">
              <PricingCard
                plan={plan}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

