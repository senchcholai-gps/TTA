'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, Transition } from 'framer-motion'
import {
  Users,
  TrendingUp,
  BarChart3,
  Rocket,
  Star,
  Award,
  Globe,
  Zap,
  Eye,
  Heart,
  LucideIcon,
} from 'lucide-react'
import { statistics, Statistic } from '@/lib/statistics'

/* ─────────────────────────────────────────────
   Icon registry — add new icons here as needed
───────────────────────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  TrendingUp,
  BarChart3,
  Rocket,
  Star,
  Award,
  Globe,
  Zap,
  Eye,
  Heart,
}

/* ─────────────────────────────────────────────
   useCountUp — animates 0 → target value
───────────────────────────────────────────── */

function useCountUp(target: number, duration = 1800, start = false): number {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    // Cancel any running animation
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    startTimeRef.current = null
    setCount(0)

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, start])

  return count
}

/* ─────────────────────────────────────────────
   StatCard — single metric card
───────────────────────────────────────────── */

interface StatCardProps {
  stat: Statistic
  index: number
  shouldTrigger: boolean
  shouldReduceMotion: boolean | null
}

const StatCard = memo(function StatCard({
  stat,
  index,
  shouldTrigger,
  shouldReduceMotion,
}: StatCardProps) {
  const Icon = ICON_MAP[stat.icon] ?? Rocket
  const count = useCountUp(
    stat.value,
    shouldReduceMotion ? 0 : 1600,
    shouldReduceMotion ? true : shouldTrigger,
  )

  const cardTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldTrigger || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
      transition={cardTransition}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.015, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number,number,number,number] } }}
      style={{ willChange: 'transform, opacity' }}
      aria-label={`${stat.title}: ${stat.value}${stat.suffix}`}
      className="
        relative group
        bg-white/80 backdrop-blur-xl
        rounded-2xl
        border border-white/60
        p-7
        shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)]
        hover:shadow-[0_16px_48px_-8px_rgba(61,0,214,0.16),0_4px_16px_rgba(214,0,60,0.08)]
        transition-shadow duration-300
        cursor-default
        overflow-hidden
      "
    >
      {/* Animated gradient border via pseudo-element simulation */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
          bg-gradient-to-br from-brand-red/10 via-brand-magenta/5 to-brand-purple/10
        "
      />

      {/* Glow blob */}
      <div
        aria-hidden="true"
        className="
          absolute -top-8 -right-8 w-32 h-32
          bg-gradient-to-br from-brand-red/20 to-brand-purple/20
          rounded-full blur-2xl
          opacity-0 group-hover:opacity-70
          transition-opacity duration-500
          pointer-events-none
        "
      />

      {/* Top row: icon + accent line */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <motion.div
          whileHover={shouldReduceMotion ? {} : { rotate: -8, scale: 1.12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="
            w-12 h-12 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-brand-red/10 to-brand-purple/15
            group-hover:from-brand-red/20 group-hover:to-brand-purple/25
            transition-colors duration-300
          "
          aria-hidden="true"
        >
          <Icon
            size={22}
            strokeWidth={1.75}
            className="text-brand-purple group-hover:text-brand-red transition-colors duration-300"
          />
        </motion.div>

        {/* Top-right gradient accent bar */}
        <div
          aria-hidden="true"
          className="w-10 h-1 rounded-full bg-brand-gradient opacity-30 group-hover:opacity-80 transition-opacity duration-300 mt-2"
        />
      </div>

      {/* Counter number */}
      <div className="relative z-10 mb-1">
        <span
          className="text-5xl font-black tracking-tight text-brand-gradient tabular-nums"
          aria-hidden="true"
        >
          {count}
          {stat.suffix}
        </span>
        {/* Screen-reader gets the static value */}
        <span className="sr-only">
          {stat.value}{stat.suffix}
        </span>
      </div>

      {/* Title */}
      <p className="relative z-10 text-sm font-bold text-neutral-black tracking-wide uppercase mt-3">
        {stat.title}
      </p>

      {/* Optional description */}
      {stat.description && (
        <p className="relative z-10 text-[11px] text-neutral-black/45 mt-1 font-normal">
          {stat.description}
        </p>
      )}
    </motion.article>
  )
})

/* ─────────────────────────────────────────────
   StatisticsSection — exported section
───────────────────────────────────────────── */

export const StatisticsSection = memo(function StatisticsSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Trigger once when the section enters the viewport
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' })

  const headingTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }

  return (
    <section
      ref={sectionRef}
      id="metrics"
      aria-label="Live metrics and statistics"
      className="relative py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand-red/6 to-brand-magenta/6 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-brand-purple/6 to-brand-magenta/6 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}}
          transition={headingTransition}
          className="mb-16 text-center"
        >
          <span className="inline-block text-[11px] font-bold tracking-widest text-brand-purple uppercase mb-3">
            By the Numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mb-4">
            Real Results, Real Growth
          </h2>
          <p className="text-lg text-neutral-black/60 max-w-xl mx-auto">
            Every number represents a brand we helped grow — measurably.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statistics.map((stat, index) => (
            <div key={stat.title} role="listitem">
              <StatCard
                stat={stat}
                index={index}
                shouldTrigger={isInView}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StatisticsSection
