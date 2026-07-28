'use client'

import React, { useRef, memo } from 'react'
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion'
import { Users, TrendingUp, BarChart3, Rocket } from 'lucide-react'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

interface Statistic {
  title: string
  displayValue: string
  icon: React.ReactNode
  description?: string
}

const statisticsData: Statistic[] = [
  {
    title: 'Clients Served',
    displayValue: '150+',
    icon: <Users size={18} />,
    description: 'Across 12+ industries'
  },
  {
    title: 'Views Generated',
    displayValue: '2M+',
    icon: <TrendingUp size={18} />,
    description: 'Organic + paid combined'
  },
  {
    title: 'Avg. Engagement Growth',
    displayValue: '40%',
    icon: <BarChart3 size={18} />,
    description: 'Month-over-month average'
  },
  {
    title: 'Campaigns Delivered',
    displayValue: '500+',
    icon: <Rocket size={18} />,
    description: 'On time & on budget'
  }
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: CUBIC_EASE,
      delay: i * 0.07, // 70ms stagger delay between metric cards
    },
  }),
}

// Static, zero-JS-counter metric card with Framer entrance reveal
const StatItem = memo(function StatItem({
  stat,
  index,
  shouldReduceMotion
}: {
  stat: Statistic
  index: number
  shouldReduceMotion: boolean | null
}) {
  return (
    <motion.div
      custom={index}
      variants={shouldReduceMotion ? undefined : cardVariants}
      className="flex flex-col items-center space-y-2 group select-none"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center text-brand-purple group-hover:scale-105 transition-transform duration-300">
        {stat.icon}
      </div>
      <div>
        <span className="text-3xl font-black text-brand-gradient tabular-nums">
          {stat.displayValue}
        </span>
      </div>
      <div className="text-center">
        <span className="block text-xs font-bold text-neutral-black uppercase tracking-wider">
          {stat.title}
        </span>
        {stat.description && (
          <span className="block text-[10px] text-neutral-black/45 mt-0.5 font-medium">
            {stat.description}
          </span>
        )}
      </div>
    </motion.div>
  )
})

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-20%' })
  const shouldReduceMotion = useReducedMotion()

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: CUBIC_EASE
      }
    }
  }

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 bg-transparent overflow-hidden"
    >
      {/* Gentle background gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-red/5 via-brand-magenta/5 to-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={shouldReduceMotion ? undefined : textContainerVariants}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate={shouldReduceMotion ? 'visible' : (isInView ? 'visible' : undefined)}
          className="space-y-8"
        >
          {/* Section Tag */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="text-xs font-bold text-brand-purple tracking-widest uppercase"
          >
            About Us
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-black leading-tight max-w-3xl mx-auto"
          >
            We Build High-Converting <span className="text-brand-gradient">Growth Systems</span>
          </motion.h2>

          {/* Core Content Statement */}
          <motion.p
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="text-lg md:text-xl text-neutral-black/85 leading-relaxed font-medium max-w-4xl mx-auto"
          >
            We help brands grow faster with AI-powered marketing, strategic social media management, in-house video production, influencer collaborations, and performance-driven digital campaigns. From AI content creation to camera production and editing — we build marketing systems that generate awareness, leads, and measurable business growth.
          </motion.p>

          {/* Metrics Grid — Static numbers with gentle Framer entrance animation */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 mt-12 border-t border-gray-100 max-w-4xl mx-auto"
          >
            {statisticsData.map((stat, idx) => (
              <StatItem
                key={idx}
                stat={stat}
                index={idx}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
