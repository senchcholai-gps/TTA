'use client'

import React, { memo, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion, Variants, useSpring, useMotionValue } from 'framer-motion'
import {
  Rocket,
  ShoppingBag,
  GraduationCap,
  UtensilsCrossed,
  TrendingUp,
  Building2,
  Mic,
  User,
  Briefcase,
  ArrowRight,
  LucideIcon
} from 'lucide-react'
import { industries, Industry } from '@/lib/industries-data'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  ShoppingBag,
  GraduationCap,
  UtensilsCrossed,
  TrendingUp,
  Building2,
  Mic,
  User,
  Briefcase
}

// Float configurations for each of the 9 cards (unique durations & distances for organic, unsynchronized feel)
const FLOAT_CONFIGS = [
  { y: [0, -6, 0], duration: 7.5, delay: 0 },
  { y: [0, 4, 0], duration: 9.2, delay: 0.5 },
  { y: [0, -5, 0], duration: 8.1, delay: 1.0 },
  { y: [0, 7, 0], duration: 10.4, delay: 0.3 },
  { y: [0, -4, 0], duration: 8.8, delay: 0.8 },
  { y: [0, 5, 0], duration: 9.6, delay: 1.2 },
  { y: [0, -6, 0], duration: 7.8, delay: 0.4 },
  { y: [0, 4, 0], duration: 10.8, delay: 0.9 },
  { y: [0, -5, 0], duration: 8.4, delay: 0.6 }
]

interface IndustryCardProps {
  industry: Industry
  index: number
  shouldReduceMotion: boolean | null
  mouseX: number
  mouseY: number
}

// Progressive Cascading Wave Scroll Reveal (0.7s, 60ms delay per card, blur 10px -> 0)
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
    scale: 0.96
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.7,
      ease: CUBIC_EASE,
      delay: i * 0.06, // 60ms stagger wave per card
    },
  }),
}

const IndustryCard = memo(function IndustryCard({
  industry,
  index,
  shouldReduceMotion,
  mouseX,
  mouseY
}: IndustryCardProps) {
  const Icon = ICON_MAP[industry.icon] ?? Briefcase
  const float = FLOAT_CONFIGS[index % FLOAT_CONFIGS.length]

  // Subtle Mouse Parallax translation & rotation
  const parallaxX = shouldReduceMotion ? 0 : mouseX * (index % 2 === 0 ? 5 : -5)
  const parallaxY = shouldReduceMotion ? 0 : mouseY * (index % 3 === 0 ? 5 : -5)
  const parallaxRotate = shouldReduceMotion ? 0 : mouseX * (index % 2 === 0 ? 0.6 : -0.6)

  return (
    <motion.div
      custom={index}
      variants={shouldReduceMotion ? undefined : cardVariants}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              x: parallaxX,
              y: parallaxY,
              rotate: parallaxRotate,
              transition: { duration: 0.6, ease: CUBIC_EASE }
            }
      }
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -12,
              scale: 1.02,
              transition: { duration: 0.45, ease: CUBIC_EASE },
            }
      }
      className="relative group p-8 rounded-3xl border border-gray-150 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-450 hover:shadow-2xl hover:border-brand-purple/40 flex flex-col h-full overflow-hidden select-none min-w-[280px] sm:min-w-0"
    >
      {/* Light Sweep on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Thin Top Accent Line */}
      <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Independent Floating & Pulsing Icon */}
      <div className="mb-6">
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : { y: float.y }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: float.duration, delay: float.delay, repeat: Infinity, ease: 'easeInOut' }
          }
          className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${industry.accent} group-hover:bg-brand-gradient group-hover:scale-105 shadow-xs transition-all duration-300`}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.04, 1] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            className="group-hover:rotate-5 transition-transform duration-300 flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-brand-purple group-hover:text-white transition-colors duration-300" />
          </motion.div>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-neutral-black mb-3 group-hover:text-brand-purple transition-colors duration-300">
        {industry.name}
      </h3>
      <p className="text-sm text-neutral-black/70 leading-relaxed flex-grow font-medium">
        {industry.description}
      </p>
    </motion.div>
  )
})

export default function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  // Mouse Parallax & Spotlight state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normX = (x / rect.width - 0.5) * 2
    const normY = (y / rect.height - 0.5) * 2
    setMousePos({ x, y, normX, normY })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="industries"
      aria-label="Industries we serve"
      onMouseMove={handleMouseMove}
      className="relative py-24 bg-transparent overflow-hidden"
    >
      {/* Ambient Drifting Background Glows (Purple 3% blur 240px & Pink 2% blur 300px) */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ x: [-30, 30, -30], y: [-15, 15, -15], opacity: [0.025, 0.035, 0.025] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-brand-purple rounded-full blur-[240px] pointer-events-none -z-10"
          />
          <motion.div
            animate={{ x: [30, -30, 30], y: [15, -15, 15], opacity: [0.015, 0.025, 0.015] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-magenta rounded-full blur-[300px] pointer-events-none -z-10"
          />

          {/* Cursor Spotlight (w-280px blur-120px 4% opacity) */}
          <div
            className="absolute pointer-events-none w-[280px] h-[280px] rounded-full bg-brand-purple/4 blur-[120px] transition-transform duration-200 ease-out -z-10"
            style={{
              transform: `translate3d(${mousePos.x - 140}px, ${mousePos.y - 140}px, 0)`
            }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header — Blur & Fade Entrance */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30, filter: 'blur(18px)' }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: CUBIC_EASE }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Industries We Serve
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Tailored Marketing Solutions
          </h2>
          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: CUBIC_EASE, delay: 0.12 }}
            className="text-lg text-neutral-black/75 max-w-2xl mx-auto font-medium"
          >
            We adapt our marketing systems to fit the unique requirements and growth channels of your industry.
          </motion.p>
        </motion.div>

        {/* Responsive layout: Carousel on mobile, Cascading Wave Grid on desktop */}
        <div className="relative">
          {/* Mobile carousel */}
          <div className="flex md:hidden overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
            {industries.map((ind, index) => (
              <IndustryCard
                key={ind.id}
                industry={ind}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
                mouseX={mousePos.normX}
                mouseY={mousePos.normY}
              />
            ))}
          </div>

          {/* Desktop grid — Progressive Wave Reveal (0->8) with Parallax & Floating */}
          <motion.div
            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            initial={shouldReduceMotion ? undefined : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.15 }}
          >
            {industries.map((ind, index) => (
              <IndustryCard
                key={ind.id}
                industry={ind}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
                mouseX={mousePos.normX}
                mouseY={mousePos.normY}
              />
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: CUBIC_EASE, delay: 0.2 }}
          className="text-center mt-14"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-brand-purple font-semibold hover:text-brand-text-purple transition-colors duration-300 group text-sm cursor-pointer"
          >
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">See how we help businesses grow</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
