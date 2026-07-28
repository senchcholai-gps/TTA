'use client'

import React, { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, Calendar, Camera, ClipboardCheck, TrendingUp } from 'lucide-react'
import FadeInView from '@/components/ui/FadeInView'
import { processContainer, staggerItem, subtleCardHover } from '@/lib/motion'

interface ProcessStepData {
  number: string
  title: string
  description: string
  icon: typeof Search
}

const stepsData: ProcessStepData[] = [
  {
    number: '01',
    title: 'Discovery & Audit',
    description: 'We start with a deep dive into your brand, audience, and existing content or social presence to identify gaps and opportunities.',
    icon: Search
  },
  {
    number: '02',
    title: 'Strategy & Content Calendar',
    description: 'We build a structured content calendar mapped to your goals, audience language, and platform best practices.',
    icon: Calendar
  },
  {
    number: '03',
    title: 'Production',
    description: 'In-house camera shoots, AI-assisted content creation, scripting, and editing — no outsourcing delays.',
    icon: Camera
  },
  {
    number: '04',
    title: 'Review & Approval',
    description: 'Drafts, scripts, and creatives are shared for feedback before anything goes live.',
    icon: ClipboardCheck
  },
  {
    number: '05',
    title: 'Publish, Track & Report',
    description: 'Content goes live on schedule. We monitor performance, provide transparent reports, and continuously refine the strategy based on results.',
    icon: TrendingUp
  }
]

interface StepCardProps {
  step: ProcessStepData
  shouldReduceMotion: boolean | null
}

const StepCard = memo(function StepCard({
  step,
  shouldReduceMotion
}: StepCardProps) {
  const Icon = step.icon

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : staggerItem}
      whileHover={shouldReduceMotion ? undefined : subtleCardHover}
      transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
      className="relative p-7 bg-white rounded-[20px] border border-gray-150 shadow-sm hover:shadow-xl hover:border-brand-purple/20 transition-shadow duration-300 flex flex-col justify-between h-full overflow-hidden group z-10"
    >
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-gradient" />

      {/* Large step numbers in low opacity */}
      <div className="absolute bottom-4 right-6 text-6xl font-black text-neutral-black/[0.03] group-hover:text-brand-purple/8 select-none transition-colors duration-500 font-mono">
        {step.number}
      </div>

      <div>
        {/* Icon Wrapper */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-gradient text-white mb-6 shadow-[0_4px_15px_rgba(214,0,60,0.15)] group-hover:scale-110 transition-transform duration-300 relative z-10">
          <Icon size={20} className="stroke-[2.5]" />
        </div>

        <h3 className="text-lg font-bold text-neutral-black mb-3">
          {step.title}
        </h3>

        <p className="text-sm text-neutral-black/70 leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  )
})

export default function OurProcessSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="process"
      className="py-24 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header — fade in on scroll */}
        <FadeInView className="text-center mb-20">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            How We Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Our Process
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            A streamlined system designed to turn strategy into consistent growth, high-quality content, and measurable results.
          </p>
        </FadeInView>

        {/* Steps Grid — progressive reveal with 120ms stagger */}
        <div className="relative">
          {/* Connector Line (Desktop only) — animated */}
          <motion.div
            className="hidden lg:block absolute top-[52px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-brand-red/20 via-brand-magenta/20 to-brand-purple/20 z-0 pointer-events-none origin-left"
            initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
            whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 items-stretch"
            variants={shouldReduceMotion ? undefined : processContainer}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-60px' }}
          >
            {stepsData.map((step) => (
              <div key={step.number} className="h-full">
                <StepCard
                  step={step}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
