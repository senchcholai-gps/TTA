'use client'

/**
 * SmoothScrollProvider
 * ─────────────────────
 * Wraps the application with Lenis for premium inertia scrolling.
 * Integrates with framer-motion's global animation frame.
 *
 * Respects prefers-reduced-motion:
 * If the user has reduced motion enabled, Lenis is NOT initialized
 * so the browser's native scroll behavior is used instead.
 */

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Respect accessibility preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    // On mobile touch devices, native momentum scrolling is smoother, hardware-accelerated,
    // and eliminates JS touch-interception lag, jitter, and freezing.
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768)

    if (isTouchDevice && window.innerWidth < 768) {
      // Use 100% native smooth scrolling on mobile
      return
    }

    const lenis = new Lenis({
      duration: 1.2,         // scroll duration multiplier — 1.2 is premium-smooth
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 0,    // Do NOT intercept/block native touch momentum
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
