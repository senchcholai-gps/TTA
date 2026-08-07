'use client'

/**
 * CursorGlow
 *
 * A soft, radial glow that tracks the cursor with spring-based interpolation.
 * Design rules:
 *  - Radius: 300px, opacity: 4–6%
 *  - GPU-only: transform + opacity
 *  - Brand gradient colours only
 *  - Never behaves like a spotlight — far too subtle for that
 *  - Hidden on mobile (touch devices don't have cursors)
 *  - Returns null when prefers-reduced-motion is enabled
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function CursorGlow() {
  const shouldReduceMotion = useReducedMotion()
  const glowRef = useRef<HTMLDivElement>(null)
  // Interpolation state — kept in refs to avoid React renders
  const current = useRef({ x: -1000, y: -1000 })
  const target  = useRef({ x: -1000, y: -1000 })
  const rafId   = useRef<number | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) return

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      const factor = 0.075 // spring-like interpolation factor
      current.current.x = lerp(current.current.x, target.current.x, factor)
      current.current.y = lerp(current.current.y, target.current.y, factor)

      if (glowRef.current) {
        // Offset by half the element size (300px / 2 = 150) to centre on cursor
        glowRef.current.style.transform =
          `translate3d(${current.current.x - 150}px, ${current.current.y - 150}px, 0)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    // Fixed: follows the viewport, not the document flow
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none select-none hidden md:block"
      style={{ zIndex: -5, isolation: 'isolate' }}
    >
      <div
        ref={glowRef}
        style={{
          width:  300,
          height: 300,
          borderRadius: '50%',
          // Brand gradient radial glow
          background: 'radial-gradient(circle, rgba(139,0,149,0.05) 0%, rgba(214,0,60,0.04) 40%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
          // Start off-screen
          transform: 'translate3d(-1000px, -1000px, 0)',
        }}
      />
    </div>
  )
}
