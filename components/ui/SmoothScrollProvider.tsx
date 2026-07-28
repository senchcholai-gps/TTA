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

    const lenis = new Lenis({
      duration: 1.2,         // scroll duration multiplier — 1.2 is premium-smooth
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      touchMultiplier: 1.8,  // slightly accelerated touch for mobile premium feel
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
