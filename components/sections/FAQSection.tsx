'use client'

import React, { useState, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs, FAQ } from '@/lib/faq-data'
import FadeInView from '@/components/ui/FadeInView'

const CUBIC_EASE = [0.22, 1, 0.36, 1] as const
const CUBIC_EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

interface FAQItemProps {
  faq: FAQ
  isOpen: boolean
  onClick: () => void
  shouldReduceMotion: boolean | null
}

const itemVariants: Variants = {
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

const FAQItem = memo(function FAQItem({
  faq,
  isOpen,
  onClick,
  shouldReduceMotion,
}: FAQItemProps) {
  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : itemVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -2, scale: 1.005, transition: { duration: 0.2, ease: CUBIC_EASE } }
      }
      className="border border-gray-100 rounded-2xl mb-3.5 bg-white/90 backdrop-blur-md shadow-sm overflow-hidden transition-colors duration-200 hover:border-brand-purple/25 hover:bg-slate-50/40 cursor-pointer"
    >
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-neutral-black hover:text-brand-purple transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 cursor-pointer"
      >
        <span className="text-sm md:text-base leading-snug">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: CUBIC_EASE_IN_OUT }
          }
          className="flex-shrink-0 text-neutral-black/45"
        >
          <ChevronDown
            size={18}
            className={isOpen ? 'text-brand-purple' : ''}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, height: 'auto' }
                : { height: 0, opacity: 0, y: -8 }
            }
            animate={{
              height: 'auto',
              opacity: 1,
              y: 0,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.45, ease: CUBIC_EASE_IN_OUT },
                    opacity: { duration: 0.45, ease: CUBIC_EASE_IN_OUT },
                    y: { duration: 0.45, ease: CUBIC_EASE_IN_OUT },
                  },
            }}
            exit={{
              height: 0,
              opacity: 0,
              y: -8,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.35, ease: CUBIC_EASE_IN_OUT },
                    opacity: { duration: 0.3, ease: CUBIC_EASE_IN_OUT },
                    y: { duration: 0.3, ease: CUBIC_EASE_IN_OUT },
                  },
            }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-neutral-black/70 leading-relaxed border-t border-gray-50/50 font-medium">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0) // Open first by default
  const shouldReduceMotion = useReducedMotion()

  const handleToggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx))
  }

  return (
    <section id="faq" className="py-24 bg-transparent overflow-hidden relative">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInView className="text-center mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            Everything you need to know about our AI-powered workflows, creative shoots, and setup timelines.
          </p>
        </FadeInView>

        <motion.div
          className="max-w-3xl mx-auto"
          role="tablist"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
        >
          {faqs.map((faq, idx) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIdx === idx}
              onClick={() => handleToggle(idx)}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
