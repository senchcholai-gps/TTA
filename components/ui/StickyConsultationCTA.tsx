'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Calendar, X } from 'lucide-react'

export default function StickyConsultationCTA() {
  const shouldReduceMotion = useReducedMotion()
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false)
  const [inContactSection, setInContactSection] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed it in this session
    const isDismissed = sessionStorage.getItem('consultation_cta_dismissed')
    if (isDismissed === 'true') {
      setDismissed(true)
    }

    // 1. RAF-throttled scroll listener for initial depth threshold (> 600px)
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolledPastThreshold(window.scrollY > 600)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check

    // 2. IntersectionObserver to detect Contact / Free Marketing Audit section visibility (~25% threshold)
    let observer: IntersectionObserver | null = null
    const contactElement = document.getElementById('contact')

    if (contactElement) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Automatically hide CTA when 25%+ of Contact section enters viewport
            setInContactSection(entry.isIntersecting)
          })
        },
        { threshold: 0.25 }
      )
      observer.observe(contactElement)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (observer && contactElement) {
        observer.unobserve(contactElement)
      }
    }
  }, [])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent click triggering scroll
    setDismissed(true)
    sessionStorage.setItem('consultation_cta_dismissed', 'true')
  }

  const handleScrollToContact = () => {
    const contactSec = document.getElementById('contact')
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (dismissed) return null

  const isVisible = scrolledPastThreshold && !inContactSection

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
          className="fixed bottom-6 right-6 z-[9998] flex items-center pointer-events-auto"
        >
          {/* Main Trigger Button */}
          <button
            onClick={handleScrollToContact}
            aria-label="Book Free Consultation"
            className="flex items-center gap-2 bg-brand-gradient text-white px-5 py-3 rounded-full font-semibold text-xs md:text-sm shadow-xl hover:shadow-[0_8px_25px_rgba(214,0,60,0.35)] transition-all duration-300 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 relative pr-10 cursor-pointer"
          >
            <Calendar size={15} className="group-hover:rotate-3 transition-transform" />
            <span>Book Free Consultation</span>

            {/* Small X button on the inner right */}
            <span
              onClick={handleDismiss}
              role="button"
              aria-label="Dismiss consultation invite"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={12} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
