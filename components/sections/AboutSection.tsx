'use client'

import React, { useRef, memo, useState, useEffect, useCallback } from 'react'
import { motion, useInView, useReducedMotion, Variants, useMotionValue, useTransform, animate } from 'framer-motion'
import { Users, TrendingUp, BarChart3, Rocket } from 'lucide-react'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

interface Statistic {
  title: string
  targetValue: number
  startValue: number
  suffix: string
  icon: React.ReactNode
  description?: string
  duration: number
}

const statisticsData: Statistic[] = [
  {
    title: 'Clients Served',
    targetValue: 150,
    startValue: 130,
    suffix: '+',
    icon: <Users size={18} />,
    description: 'Across 12+ industries',
    duration: 500
  },
  {
    title: 'Views Generated',
    targetValue: 20,
    startValue: 18,
    suffix: 'M+',
    icon: <TrendingUp size={18} />,
    description: 'Organic + paid combined',
    duration: 500
  },
  {
    title: 'Avg. Engagement Growth',
    targetValue: 40,
    startValue: 34,
    suffix: '%',
    icon: <BarChart3 size={18} />,
    description: 'Month-over-month average',
    duration: 500
  },
  {
    title: 'Campaigns Delivered',
    targetValue: 150,
    startValue: 130,
    suffix: '+',
    icon: <Rocket size={18} />,
    description: 'On time & on budget',
    duration: 500
  }
]

// ─── Stat Metric Card ──────────────────────────────────────────────────────────
const StatItem = memo(function StatItem({
  stat,
  index,
  isInView,
  shouldReduceMotion
}: {
  stat: Statistic
  index: number
  isInView: boolean
  shouldReduceMotion: boolean | null
}) {
  const [pulseTrigger, setPulseTrigger] = useState(false)

  // Motion Value configuration to drive direct DOM updates without React re-renders
  const countMotion = useMotionValue(stat.startValue)
  const formattedCount = useTransform(countMotion, (latest) => {
    return Math.floor(latest).toString() + stat.suffix
  })

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return

    // Setup pure Framer Motion animate loop synchronized with card reveal
    const controls = animate(countMotion, stat.targetValue, {
      duration: stat.duration / 1000, // 500ms
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      delay: index * 0.08, // Stagger delay matching container delay exactly
      onComplete: () => {
        setPulseTrigger(true)
      }
    })

    return () => controls.stop()
  }, [isInView, shouldReduceMotion, stat.targetValue, stat.duration, index])

  // Card entrance variants: scale: 0.97 -> 1, opacity: 0 -> 1, y: 25 -> 0
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: i * 0.08 // Stagger delay matching counter delay exactly
      },
    }),
  }

  return (
    <motion.div
      custom={index}
      variants={shouldReduceMotion ? undefined : cardVariants}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate={shouldReduceMotion ? 'visible' : (isInView ? 'visible' : 'hidden')}
      className="flex flex-col items-center space-y-2 group select-none"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center text-brand-purple group-hover:scale-105 transition-transform duration-300">
        {stat.icon}
      </div>
      
      {/* Numerical count with high-performance scale pulse upon completion */}
      <motion.div
        animate={pulseTrigger ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={{ duration: 0.12, ease: 'easeInOut' }}
        className="flex items-center justify-center font-black text-brand-gradient text-3xl md:text-4xl"
      >
        {shouldReduceMotion ? (
          <span className="tabular-nums">
            {stat.targetValue}{stat.suffix}
          </span>
        ) : (
          <motion.span className="tabular-nums">
            {formattedCount}
          </motion.span>
        )}
      </motion.div>

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
  
  // Section text trigger (remains fully unchanged)
  const isInView = useInView(containerRef, { once: true, margin: '-20%' })
  
  // Dedicated trigger for the statistics row (35% row visibility trigger)
  const statsContainerRef = useRef<HTMLDivElement>(null)
  const isStatsInView = useInView(statsContainerRef, { once: true, amount: 0.35 })

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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    setMousePos({ x, y })
  }, [])

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-16 sm:py-20 md:py-24 bg-transparent overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* === BACKGROUND LAYER === */}

      {/* Subtle SVG dot-grid watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.018]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Primary breathing gradient orb */}
      {!shouldReduceMotion ? (
        <motion.div
          aria-hidden="true"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.06, 0.1, 0.06],
            x: mousePos.x,
            y: mousePos.y,
          }}
          transition={{
            scale: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 0.8, ease: 'easeOut' },
            y: { duration: 0.8, ease: 'easeOut' },
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-red/60 via-brand-magenta/40 to-brand-purple/60 rounded-full blur-[100px] pointer-events-none -z-10"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-red/5 via-brand-magenta/5 to-brand-purple/5 rounded-full blur-[100px] pointer-events-none -z-10"
        />
      )}

      {/* Floating ring — top-left */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -14, 0], x: [0, 8, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -left-16 w-[280px] h-[280px] rounded-full border border-brand-purple/8 pointer-events-none -z-10"
        />
      )}

      {/* Floating ring — bottom-right */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 16, 0], x: [0, -10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full border border-brand-magenta/8 pointer-events-none -z-10"
        />
      )}

      {/* Small accent orb — top-right */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-12 right-[10%] w-[180px] h-[180px] bg-brand-red/70 rounded-full blur-[60px] pointer-events-none -z-10"
        />
      )}

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
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-black leading-tight max-w-3xl mx-auto"
          >
            We Build High-Converting <span className="text-brand-gradient">Growth Systems</span>
          </motion.h2>

          {/* Core Content Statement */}
          <motion.p
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="text-base md:text-lg xl:text-xl text-neutral-black/85 leading-relaxed font-medium max-w-4xl mx-auto"
          >
            We help brands grow faster with AI-powered marketing, strategic social media management, in-house video production, influencer collaborations, and performance-driven digital campaigns. From AI content creation to camera production and editing — we build marketing systems that generate awareness, leads, and measurable business growth.
          </motion.p>

          {/* Metrics Grid — Modified only statistics row container */}
          <div
            ref={statsContainerRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-8 pt-10 mt-4 border-t border-gray-100 max-w-4xl mx-auto"
          >
            {statisticsData.map((stat, idx) => (
              <StatItem
                key={idx}
                stat={stat}
                index={idx}
                isInView={isStatsInView}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}
