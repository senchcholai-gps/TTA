'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function BlogHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-radial-[circle_at_center,var(--color-neutral-white)_0%,#fafafa_100%]" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-brand-red/5 to-brand-magenta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-brand-purple/5 to-brand-magenta/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold text-brand-purple tracking-widest uppercase mb-3 block"
        >
          TTA Insights
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-black mb-6 leading-tight"
        >
          Marketing <span className="text-brand-gradient">Insights</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-neutral-black/70 max-w-2xl mx-auto leading-relaxed"
        >
          Actionable strategies, AI marketing guides, branding ideas, case studies and growth tips from The Three Amigos.
        </motion.p>
      </div>
    </section>
  )
}
