/**
 * Premium Motion System — TTA Website (Landin & Portfolite Inspired)
 * ─────────────────────────────────────────────────────────────────────
 * Unified animation language:
 * - Scroll Reveal: opacity 0->1, translateY 40px->0, scale 0.98->1
 * - Duration: 800ms with cubic-bezier(0.22, 1, 0.36, 1)
 * - Stagger: 120ms between child cards
 * - Hover: translateY(-10px), scale(1.015), 250ms easeOut
 */

import type { Variants, Transition } from 'framer-motion'

// ─── Easing Curves ────────────────────────────────────────────────────────────

/** Premium agency cubic-bezier standard: cubic-bezier(0.22, 1, 0.36, 1) */
export const CUBIC_EASE = [0.22, 1, 0.36, 1] as const
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

// ─── Duration Constants ───────────────────────────────────────────────────────

export const DURATION = {
  fast:    0.22,  // button press, micro-interactions
  hover:   0.25,  // hover transitions
  card:    0.25,  // card hover
  reveal:  0.80,  // scroll reveal
  slow:    1.10,  // hero-level elements
} as const

// ─── Shared Transitions ───────────────────────────────────────────────────────

export const revealTransition: Transition = {
  duration: DURATION.reveal,
  ease: CUBIC_EASE,
}

export const cardTransition: Transition = {
  duration: DURATION.card,
  ease: CUBIC_EASE,
}

export const hoverTransition: Transition = {
  duration: DURATION.hover,
  ease: CUBIC_EASE,
}

// ─── Scroll Reveal Variants ───────────────────────────────────────────────────

/**
 * Primary Landin scroll-reveal variant.
 * Opacity 0 → 1, translateY 40px → 0, scale 0.98 → 1.
 * Duration: 800ms with cubic-bezier(0.22, 1, 0.36, 1).
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
    willChange: 'transform, opacity',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: revealTransition,
  },
}

/**
 * Stagger container — 120ms between cards.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

/**
 * Individual staggered child item.
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
    willChange: 'transform, opacity',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: revealTransition,
  },
}

/**
 * Process steps container.
 */
export const processContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

/**
 * Fade-only reveal (no Y movement).
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: revealTransition,
  },
}

// ─── Hover Presets ────────────────────────────────────────────────────────────

/**
 * Premium Landin card hover: translateY(-10px), scale(1.015), 250ms duration.
 */
export const cardHover = {
  y: -10,
  scale: 1.015,
  transition: hoverTransition,
}

export const subtleCardHover = {
  y: -6,
  scale: 1.01,
  transition: hoverTransition,
}

export const buttonHover = {
  y: -2,
  transition: {
    duration: DURATION.fast,
    ease: EASE_OUT_QUART,
  },
}

export const buttonTap = {
  scale: 0.98,
  y: 0,
  transition: {
    duration: DURATION.fast,
    ease: EASE_OUT_QUART,
  },
}

// ─── Section Header Variants ──────────────────────────────────────────────────

export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: CUBIC_EASE,
    },
  },
}
