'use client'

/**
 * FadeInView
 * ───────────
 * Reusable scroll-reveal wrapper.
 *
 * On scroll, wraps children in a motion.div that:
 * - Starts at opacity: 0, y: 20
 * - Animates to opacity: 1, y: 0
 * - Duration: 0.9s with easeOutExpo
 * - Triggers once when element enters viewport
 * - Automatically disabled when prefers-reduced-motion is set
 *
 * Usage:
 *   <FadeInView>
 *     <YourComponent />
 *   </FadeInView>
 *
 *   <FadeInView delay={0.2}>
 *     <YourComponent />
 *   </FadeInView>
 */

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface FadeInViewProps {
  children: React.ReactNode
  delay?: number
  className?: string
  /** Override the Y offset (default: 20) */
  yOffset?: number
}

export default function FadeInView({
  children,
  delay = 0,
  className,
  yOffset = 20,
}: FadeInViewProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const variants = delay > 0
    ? {
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            delay,
          },
        },
      }
    : {
        hidden: { opacity: 0, y: yOffset, scale: 0.98 as number },
        visible: {
          opacity: 1 as number,
          y: 0 as number,
          scale: 1 as number,
          transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          },
        },
      }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}
