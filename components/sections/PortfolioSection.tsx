'use client'

import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { portfolioItems } from '@/lib/portfolio-data'
import { InstagramReelCard } from '@/components/portfolio/PortfolioGrid'
import FadeInView from '@/components/ui/FadeInView'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
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

export default function PortfolioSection() {
  const shouldReduceMotion = useReducedMotion()

  // Select exactly 3 Instagram Reels for the homepage
  const featuredItems = useMemo(() => {
    return portfolioItems
      .filter((i) => i.category === 'Instagram Reels & Short-form Content')
      .slice(0, 3)
  }, [])

  return (
    <section
      id="portfolio"
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

          {/* Floating diamond shape — top-right */}
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -18, 0], rotate: [45, 55, 45], opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[8%] right-[12%] w-[90px] h-[90px] bg-gradient-to-br from-brand-red to-brand-magenta rounded-lg pointer-events-none -z-10"
            style={{ transform: 'rotate(45deg)' }}
          />

          {/* Floating circle — bottom-left */}
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, 14, 0], x: [0, -8, 0], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute bottom-[12%] left-[8%] w-[60px] h-[60px] bg-gradient-to-br from-brand-purple to-brand-magenta rounded-full blur-sm pointer-events-none -z-10"
          />

          {/* Thin gradient horizontal rule */}
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: [0.7, 1, 0.7], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px w-[60%] bg-gradient-to-r from-transparent via-brand-purple to-transparent pointer-events-none -z-10"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <FadeInView className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Selected Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Our Work Speaks
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            Explore a showcase of the real results, short-form content, and brand pages we actively manage.
          </p>
        </FadeInView>

        {/* Portfolio cards — stagger on scroll */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 items-stretch"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
        >
          {featuredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="col-span-1 h-auto flex flex-col"
            >
              <InstagramReelCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {/* View Complete Portfolio Button */}
        <FadeInView delay={0.15} className="text-center mt-12 md:mt-16">
          <motion.a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gradient text-white rounded-xl text-xs font-bold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] transition-shadow duration-300 cursor-pointer group"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.25, ease: CUBIC_EASE }}
          >
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">View Complete Portfolio</span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.a>
        </FadeInView>

      </div>
    </section>
  )
}

