'use client'

/**
 * CursorParticles
 *
 * A canvas-based 50-particle system that drifts, fades, and follows the cursor.
 * Uses 100% Canvas2D + requestAnimationFrame — zero React renders after mount.
 *
 * Design rules:
 *  - 50 particles distributed across the page
 *  - Each particle: small circle, brand colours, drifts upward, slightly
 *    attracts toward the cursor zone (very weakly)
 *  - Opacity 0 → 0.15 → 0, lifetime 4–12 s
 *  - GPU-accelerated canvas composite
 *  - Hidden on mobile via CSS (hidden md:block)
 *  - Disabled when prefers-reduced-motion
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const PARTICLE_COUNT = 50
const BRAND = [
  [214,  0,  60],   // #D6003C red
  [139,  0, 149],   // #8B0095 magenta
  [ 61,  0, 214],   // #3D00D6 purple
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: number[]
  alpha: number
  maxAlpha: number
  life: number      // 0..1
  speed: number
  lifeSpeed: number
}

function newParticle(w: number, h: number): Particle {
  const color = BRAND[Math.floor(Math.random() * BRAND.length)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(Math.random() * 0.5 + 0.15),
    radius: Math.random() * 2.5 + 1,
    color,
    alpha: 0,
    maxAlpha: Math.random() * 0.12 + 0.04,
    life: Math.random(),             // start at random phase
    speed: Math.random() * 0.6 + 0.4,
    lifeSpeed: 1 / (Math.random() * 300 + 180), // frames for full cycle
  }
}

export default function CursorParticles() {
  const shouldReduceMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -1000, y: -1000 })
  const rafId     = useRef<number | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = document.documentElement.scrollHeight

    const setSize = () => {
      w = window.innerWidth
      h = document.documentElement.scrollHeight
      canvas.width  = w
      canvas.height = h
    }
    setSize()
    window.addEventListener('resize', setSize, { passive: true })

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY + window.scrollY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Initialise all particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => newParticle(w, h))

    const CURSOR_RADIUS = 600   // px influence zone
    const ATTRACT_FORCE = 0.012 // very weak attraction

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        // Life cycle
        p.life += p.lifeSpeed * p.speed

        if (p.life < 0.5) {
          p.alpha = p.maxAlpha * (p.life / 0.5)
        } else if (p.life < 1) {
          p.alpha = p.maxAlpha * (1 - (p.life - 0.5) / 0.5)
        } else {
          // Respawn
          Object.assign(p, newParticle(w, h))
          p.life  = 0
          p.alpha = 0
          continue
        }

        // Weak cursor attraction
        const cx = mouse.current.x
        const cy = mouse.current.y
        const dx = cx - p.x
        const dy = cy - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * ATTRACT_FORCE
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Dampen to prevent runaway velocity
        p.vx *= 0.98
        p.vy *= 0.98

        // Move
        p.x += p.vx * p.speed
        p.y += p.vy * p.speed

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`
        ctx.fill()
      }

      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', setSize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute top-0 left-0 w-full pointer-events-none select-none hidden md:block"
      style={{ zIndex: 0 }}
    />
  )
}
