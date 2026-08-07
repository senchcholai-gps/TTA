'use client'

/**
 * CursorOrb
 *
 * Premium cursor experience inspired by Framer Landin template.
 *  - 480px diameter gradient orb following the cursor
 *  - Opacity 13–16% with brand gradient (#D6003C → #8B0095 → #3D00D6)
 *  - 120px blur — luxurious, never spotlight-like
 *  - Spring-based lerp interpolation (factor 0.055) — fluid trailing feel
 *  - 100% GPU-only: only transform changes, zero layout recalculation
 *  - Hidden on mobile / touch screens
 *  - Disabled when prefers-reduced-motion is set
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const ORB_SIZE   = 480   // px diameter
const HALF_ORB   = ORB_SIZE / 2
const LERP_FAST  = 0.055  // trailing factor — lower = more trailing
const LERP_SLOW  = 0.030  // secondary inner orb (even more trailing)

export default function CursorOrb() {
  const shouldReduceMotion = useReducedMotion()

  const orbRef   = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const current  = useRef({ x: -2000, y: -2000 })
  const current2 = useRef({ x: -2000, y: -2000 })
  const target   = useRef({ x: -2000, y: -2000 })
  const rafId    = useRef<number | null>(null)
  const started  = useRef(false)

  useEffect(() => {
    if (shouldReduceMotion) return

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      if (!started.current) {
        // Instantly snap to first position so there's no "slide-in from corner"
        current.current.x  = e.clientX
        current.current.y  = e.clientY
        current2.current.x = e.clientX
        current2.current.y = e.clientY
        started.current = true
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      current.current.x  = lerp(current.current.x,  target.current.x, LERP_FAST)
      current.current.y  = lerp(current.current.y,  target.current.y, LERP_FAST)
      current2.current.x = lerp(current2.current.x, target.current.x, LERP_SLOW)
      current2.current.y = lerp(current2.current.y, target.current.y, LERP_SLOW)

      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate3d(${current.current.x - HALF_ORB}px, ${current.current.y - HALF_ORB}px, 0)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate3d(${current2.current.x - HALF_ORB * 0.7}px, ${current2.current.y - HALF_ORB * 0.7}px, 0)`
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
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none select-none hidden md:block"
      style={{ zIndex: -5 }}
    >
      {/* Primary large orb — fast trail */}
      <div
        ref={orbRef}
        style={{
          position: 'absolute',
          width:  ORB_SIZE,
          height: ORB_SIZE,
          borderRadius: '50%',
          background: [
            'radial-gradient(circle at 40% 40%,',
            '  rgba(214,0,60,0.16) 0%,',
            '  rgba(139,0,149,0.14) 35%,',
            '  rgba(61,0,214,0.10) 65%,',
            '  transparent 75%)',
          ].join(''),
          filter: 'blur(120px)',
          willChange: 'transform',
          transform: 'translate3d(-2000px,-2000px,0)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Secondary smaller orb — slower trail for depth */}
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          width:  Math.round(ORB_SIZE * 0.7),
          height: Math.round(ORB_SIZE * 0.7),
          borderRadius: '50%',
          background: [
            'radial-gradient(circle at 55% 45%,',
            '  rgba(139,0,149,0.12) 0%,',
            '  rgba(61,0,214,0.09) 40%,',
            '  transparent 70%)',
          ].join(''),
          filter: 'blur(80px)',
          willChange: 'transform',
          transform: 'translate3d(-2000px,-2000px,0)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
