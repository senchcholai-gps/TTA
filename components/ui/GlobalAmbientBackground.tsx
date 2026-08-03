'use client'

/**
 * GlobalAmbientBackground (v6 — Framer Portfolite & Landin Quality)
 *
 * Design guidelines applied:
 *  ─ 100% Global application rendered from root layout.
 *  ─ Large cursor orb (480px) following the cursor with 12% - 18% opacity, blurred 120px, spring trailing.
 *  ─ 5 depth layers of mouse parallax (4px | 10px | 18px | 28px | 40px) which return to rest.
 *  ─ Document scroll parallax: combining scroll position with spring mouse values.
 *  ─ Premium morphing gradient mesh (7 blobs, 8% - 12% opacity, 25-40s loop).
 *  ─ Dozens of floating graphics (AI nodes, connections, charts, airplanes, wireframes, grids).
 *  ─ Canvas-based 50 particles reactive to the cursor (trailing, organic drift, repelling & attracting).
 *  ─ Ambient glass lighting streaks and volumetric bloom.
 *  ─ Timings staggered (12s | 18s | 26s | 35s | 45s) for organic rhythm.
 *  ─ Layout aligned precisely to sections from top to bottom.
 *  ─ z-index: -10 ensures all elements remain strictly behind page content.
 */

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// ─── Cursor orb constants ─────────────────────────────────────────────────────
const ORB = 480
const HALF = ORB / 2

// ─── Parallax spring configs — 5 layers ──────────────────────────────────────
const L1 = { stiffness: 10, damping: 26, mass: 2.6 }  // Far (Blobs/mesh): ~4px
const L2 = { stiffness: 20, damping: 28, mass: 1.9 }  // Far-Mid (Lines/grid): ~10px
const L3 = { stiffness: 35, damping: 32, mass: 1.3 }  // Mid (Illustrations): ~18px
const L4 = { stiffness: 55, damping: 36, mass: 1.0 }  // Near (Rings/cards): ~28px
const L5 = { stiffness: 75, damping: 40, mass: 0.8 }  // Fore (Canvas/dots): ~40px

// ─── Floating rings ───────────────────────────────────────────────────────────
const RINGS = [
  { top: '15%', right: '12%', s: 80,  dur: 24, delay: 3.5, rot: -4, c: '#8B0095' },
  { top: '29%', left: '42%',  s: 95,  dur: 30, delay: 1.2, rot:  3, c: '#3D00D6' },
  { top: '41%', left: '4%',   s: 118, dur: 26, delay: 2.2, rot:  3, c: '#3D00D6' },
  { top: '58%', right: '19%', s: 75,  dur: 36, delay: 7.1, rot: -3, c: '#D6003C' },
  { top: '74%', left: '37%',  s: 92,  dur: 18, delay: 1.6, rot:  4, c: '#8B0095' },
  { top: '82%', right: '18%', s: 74,  dur: 19, delay: 4.7, rot: -3, c: '#3D00D6' },
  { top: '90%', right: '11%', s: 98,  dur: 42, delay: 5.5, rot: -3, c: '#3D00D6' },
] as const

// ─── Sparkle dots ─────────────────────────────────────────────────────────────
const DOTS = [
  { top:'3%',  left:'38%', sz:3, dur:12, d:0,   c:'#3D00D6' },
  { top:'8%',  left:'69%', sz:4, dur:18, d:1.5, c:'#D6003C' },
  { top:'13%', left:'22%', sz:2, dur:26, d:3.2, c:'#8B0095' },
  { top:'19%', left:'81%', sz:5, dur:35, d:0.7, c:'#3D00D6' },
  { top:'24%', left:'55%', sz:3, dur:18, d:4.1, c:'#D6003C' },
  { top:'29%', left:'14%', sz:4, dur:26, d:2.3, c:'#8B0095' },
  { top:'35%', left:'90%', sz:2, dur:12, d:0.4, c:'#3D00D6' },
  { top:'41%', left:'47%', sz:5, dur:35, d:5.8, c:'#D6003C' },
  { top:'47%', left:'28%', sz:3, dur:18, d:1.9, c:'#8B0095' },
  { top:'52%', left:'74%', sz:4, dur:26, d:3.5, c:'#3D00D6' },
  { top:'58%', left:'6%',  sz:2, dur:12, d:2.7, c:'#D6003C' },
  { top:'63%', left:'61%', sz:5, dur:45, d:0.2, c:'#8B0095' },
  { top:'69%', left:'33%', sz:3, dur:18, d:4.6, c:'#3D00D6' },
  { top:'74%', left:'86%', sz:4, dur:26, d:1.1, c:'#D6003C' },
  { top:'80%', left:'17%', sz:2, dur:35, d:3.8, c:'#8B0095' },
  { top:'85%', left:'52%', sz:5, dur:18, d:0.9, c:'#3D00D6' },
  { top:'91%', left:'72%', sz:3, dur:26, d:2.4, c:'#D6003C' },
  { top:'96%', left:'40%', sz:4, dur:12, d:5.1, c:'#8B0095' },
] as const

// ─── Footer constellation ─────────────────────────────────────────────────────
const STARS = [
  {x:70,y:38},{x:155,y:18},{x:240,y:52},{x:325,y:28},{x:400,y:65},{x:480,y:22},
  {x:560,y:58},{x:640,y:18},{x:720,y:48},{x:800,y:35},{x:880,y:62},{x:960,y:25},
  {x:1040,y:52},{x:1120,y:18},{x:1200,y:48},{x:1280,y:32},{x:1360,y:58},{x:1400,y:14},
  {x:110,y:88},{x:210,y:108},{x:340,y:92},{x:460,y:112},{x:590,y:82},{x:710,y:102},
  {x:830,y:88},{x:955,y:108},{x:1085,y:78},{x:1210,y:98},{x:1340,y:88},{x:1420,y:104},
] as const
const CONST_LINES: [number,number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],
  [18,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],[25,26],[26,27],[27,28],[28,29],
  [0,18],[2,19],[4,20],[6,21],[8,22],[10,23],[12,24],[14,25],[16,26],[17,29],
]

// ─── Brand colors for particles ─────────────────────────────────────────────
const BRAND_RGB = [
  [61, 0, 214],   // Purple
  [139, 0, 149],  // Magenta
  [214, 0, 60],   // Pink / Red
  [59, 130, 246]  // Blue
] as const

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number // radius
  color: readonly number[]
  alpha: number
  maxAlpha: number
  scale: number
  scaleSpeed: number
  angle: number
  angularVelocity: number
  life: number
  speed: number
  lifeSpeed: number
}

function mkParticle(w: number, h: number): Particle {
  const color = BRAND_RGB[Math.floor(Math.random() * BRAND_RGB.length)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    r: Math.random() * 2.8 + 1.2,
    color,
    alpha: 0,
    maxAlpha: Math.random() * 0.08 + 0.02,
    scale: Math.random() * 0.2 + 0.9,
    scaleSpeed: (Math.random() - 0.5) * 0.01,
    angle: Math.random() * Math.PI * 2,
    angularVelocity: (Math.random() - 0.5) * 0.02,
    life: Math.random(),
    speed: Math.random() * 0.5 + 0.5,
    lifeSpeed: 1 / (Math.random() * 320 + 200),
  }
}

export default function GlobalAmbientBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // ── Cursor orb refs (RAF-driven, zero React re-renders) ───────────────────
  const orbRef   = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const orbCurr  = useRef({ x: -2000, y: -2000 })
  const orbCurr2 = useRef({ x: -2000, y: -2000 })
  const orbTgt   = useRef({ x: -2000, y: -2000 })
  const orbInit  = useRef(false)
  const orbRaf   = useRef<number | null>(null)

  // ── Particle canvas refs (50 particles count) ────────────────────────────
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const mousePt     = useRef({ x: -1000, y: -1000 })
  const particleRaf = useRef<number | null>(null)

  // ── Parallax motion values (5 depth layers: 4px | 10px | 18px | 28px | 40px) ──
  const rX1 = useMotionValue(0); const rY1 = useMotionValue(0)
  const rX2 = useMotionValue(0); const rY2 = useMotionValue(0)
  const rX3 = useMotionValue(0); const rY3 = useMotionValue(0)
  const rX4 = useMotionValue(0); const rY4 = useMotionValue(0)
  const rX5 = useMotionValue(0); const rY5 = useMotionValue(0)

  const x1 = useSpring(rX1, L1); const y1 = useSpring(rY1, L1)
  const x2 = useSpring(rX2, L2); const y2 = useSpring(rY2, L2)
  const x3 = useSpring(rX3, L3); const y3 = useSpring(rY3, L3)
  const x4 = useSpring(rX4, L4); const y4 = useSpring(rY4, L4)
  const x5 = useSpring(rX5, L5); const y5 = useSpring(rY5, L5)

  // ── Combined Mouse Parallax and Scroll Parallax values ───────────────────
  const yScroll1 = useTransform(scrollY, y => y * 0.03) // Layer 1 (Far): moves slower
  const yScroll2 = useTransform(scrollY, y => y * 0.07) // Layer 2 (Far-Mid)
  const yScroll3 = useTransform(scrollY, y => y * 0.12) // Layer 3 (Mid)
  const yScroll4 = useTransform(scrollY, y => y * 0.18) // Layer 4 (Near)
  const yScroll5 = useTransform(scrollY, y => y * 0.25) // Layer 5 (Fore)

  const yLayer1 = useTransform([y1, yScroll1], ([ly, ls]) => (ly as number) + (ls as number))
  const yLayer2 = useTransform([y2, yScroll2], ([ly, ls]) => (ly as number) + (ls as number))
  const yLayer3 = useTransform([y3, yScroll3], ([ly, ls]) => (ly as number) + (ls as number))
  const yLayer4 = useTransform([y4, yScroll4], ([ly, ls]) => (ly as number) + (ls as number))
  const yLayer5 = useTransform([y5, yScroll5], ([ly, ls]) => (ly as number) + (ls as number))

  useEffect(() => {
    if (shouldReduceMotion) return

    // ── Shared mouse listener ────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5

      // Parallax mouse multipliers
      rX1.set(nx * 8);   rY1.set(ny * 8)   // Layer 1: ~4px
      rX2.set(nx * 20);  rY2.set(ny * 20)  // Layer 2: ~10px
      rX3.set(nx * 36);  rY3.set(ny * 36)  // Layer 3: ~18px
      rX4.set(nx * 56);  rY4.set(ny * 56)  // Layer 4: ~28px
      rX5.set(nx * 80);  rY5.set(ny * 80)  // Layer 5: ~40px

      // Cursor orb target
      orbTgt.current.x = e.clientX
      orbTgt.current.y = e.clientY
      if (!orbInit.current) {
        orbCurr.current.x = e.clientX; orbCurr.current.y = e.clientY
        orbCurr2.current.x = e.clientX; orbCurr2.current.y = e.clientY
        orbInit.current = true
      }

      // Particle mouse position
      mousePt.current.x = e.clientX
      mousePt.current.y = e.clientY + window.scrollY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // ── Cursor orb RAF loop ───────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const orbTick = () => {
      orbCurr.current.x = lerp(orbCurr.current.x, orbTgt.current.x, 0.055)
      orbCurr.current.y = lerp(orbCurr.current.y, orbTgt.current.y, 0.055)
      orbCurr2.current.x = lerp(orbCurr2.current.x, orbTgt.current.x, 0.030)
      orbCurr2.current.y = lerp(orbCurr2.current.y, orbTgt.current.y, 0.030)
      if (orbRef.current)
        orbRef.current.style.transform = `translate3d(${orbCurr.current.x - HALF}px,${orbCurr.current.y - HALF}px,0)`
      if (innerRef.current)
        innerRef.current.style.transform = `translate3d(${orbCurr2.current.x - HALF * 0.7}px,${orbCurr2.current.y - HALF * 0.7}px,0)`
      orbRaf.current = requestAnimationFrame(orbTick)
    }
    orbRaf.current = requestAnimationFrame(orbTick)

    // ── Particle canvas (50 particles count) ──────────────────────────────
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      let w = window.innerWidth
      let h = document.documentElement.scrollHeight
      const resize = () => {
        w = window.innerWidth
        h = document.documentElement.scrollHeight
        canvas.width = w
        canvas.height = h
      }
      resize()
      window.addEventListener('resize', resize, { passive: true })
      
      const particleCount = window.innerWidth < 768 ? 15 : (window.innerWidth < 1024 ? 35 : 50)
      const pts: Particle[] = Array.from({ length: particleCount }, () => mkParticle(w, h))
      const ATTRACT_ZONE = 500
      const REPEL_ZONE = 100
      const FORCE = 0.015

      const ptTick = () => {
        ctx.clearRect(0, 0, w, h)
        for (const p of pts) {
          // Increment life phases
          p.life += p.lifeSpeed * p.speed
          if (p.life < 0.5)      p.alpha = p.maxAlpha * (p.life / 0.5)
          else if (p.life < 1)   p.alpha = p.maxAlpha * (1 - (p.life - 0.5) / 0.5)
          else {
            Object.assign(p, mkParticle(w, h))
            p.life = 0
            p.alpha = 0
            continue
          }

          // Angle/scale/velocity updates
          p.angle += p.angularVelocity
          p.scale += p.scaleSpeed
          if (p.scale > 1.05 || p.scale < 0.95) p.scaleSpeed = -p.scaleSpeed

          // Interaction with cursor (Subtle attraction and repulsion)
          const dx = mousePt.current.x - p.x
          const dy = mousePt.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < ATTRACT_ZONE && dist > 0) {
            if (dist < REPEL_ZONE) {
              const rf = (1 - dist / REPEL_ZONE) * FORCE * 1.5
              p.vx -= (dx / dist) * rf
              p.vy -= (dy / dist) * rf
            } else {
              const af = (1 - dist / ATTRACT_ZONE) * FORCE * 0.4
              p.vx += (dx / dist) * af
              p.vy += (dy / dist) * af
            }
          }

          p.vx *= 0.98
          p.vy *= 0.98
          p.x += p.vx * p.speed
          p.y += p.vy * p.speed

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.scale(p.scale, p.scale)

          // Shape variance: crosses and dots
          if (p.r > 2.8) {
            ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(-p.r, 0); ctx.lineTo(p.r, 0)
            ctx.moveTo(0, -p.r); ctx.lineTo(0, p.r)
            ctx.stroke()
          } else {
            ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`
            ctx.beginPath()
            ctx.arc(0, 0, p.r, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
        particleRaf.current = requestAnimationFrame(ptTick)
      }
      particleRaf.current = requestAnimationFrame(ptTick)
      return () => { window.removeEventListener('resize', resize) }
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (orbRaf.current) cancelAnimationFrame(orbRaf.current)
      if (particleRaf.current) cancelAnimationFrame(particleRaf.current)
    }
  }, [shouldReduceMotion, rX1, rY1, rX2, rY2, rX3, rY3, rX4, rY4, rX5, rY5])

  if (shouldReduceMotion) return null

  return (
    <>
      {/* ── Cursor orb — fixed view, follows viewport ─────────────────────────── */}
      <div aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none select-none hidden md:block"
        style={{ zIndex: 1 }}>
        <div ref={orbRef} style={{
          position: 'absolute', width: ORB, height: ORB, borderRadius: '50%',
          background: 'radial-gradient(circle at 45% 45%, rgba(214,0,60,0.18) 0%, rgba(139,0,149,0.16) 40%, rgba(61,0,214,0.12) 75%, transparent 100%)',
          filter: 'blur(120px)', willChange: 'transform',
          transform: 'translate3d(-2000px,-2000px,0)', mixBlendMode: 'multiply'
        }}/>
        <div ref={innerRef} style={{
          position: 'absolute', width: Math.round(ORB * 0.7), height: Math.round(ORB * 0.7), borderRadius: '50%',
          background: 'radial-gradient(circle at 55% 45%, rgba(139,0,149,0.10) 0%, rgba(61,0,214,0.07) 40%, transparent 70%)',
          filter: 'blur(80px)', willChange: 'transform',
          transform: 'translate3d(-2000px,-2000px,0)', mixBlendMode: 'multiply'
        }}/>
      </div>

      {/* ── Main parallax layers container ──────────────────────────────── */}
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none"
        style={{ zIndex: -10, overflow: 'hidden' }}>

        {/* ══ LAYER 1 — Far Parallax Layer (~4px range) ══════════════════════
            Renders animated mesh gradients, color glows and streaks */}
        <motion.div className="absolute inset-0" style={{ x: x1, y: yLayer1 }}>
          
          {/* Morphing mesh blobs system — Strictly 8% - 12% opacity */}
          <motion.div
            animate={{ x: [-22, 20, -22], y: [-14, 12, -14], scale: [1, 1.09, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            className="absolute rounded-full"
            style={{ top: '7%', left: '-8%', width: 620, height: 460,
              background: 'radial-gradient(ellipse at center, rgba(61,0,214,0.3) 0%, transparent 70%)',
              filter: 'blur(160px)' }}
          />
          <motion.div
            animate={{ x: [18, -24, 18], y: [10, -16, 10], scale: [1, 1.11, 1], opacity: [0.08, 0.11, 0.08] }}
            transition={{ duration: 41, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
            className="absolute rounded-full"
            style={{ top: '5%', right: '-10%', width: 660, height: 500,
              background: 'radial-gradient(ellipse at center, rgba(214,0,60,0.3) 0%, transparent 70%)',
              filter: 'blur(175px)' }}
          />
          <motion.div
            animate={{ x: [-16, 22, -16], y: [12, -18, 12], scale: [1, 1.10, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 37, repeat: Infinity, ease: 'easeInOut', delay: 18 }}
            className="absolute rounded-full"
            style={{ top: '37%', left: '-6%', width: 600, height: 460,
              background: 'radial-gradient(ellipse at center, rgba(139,0,149,0.3) 0%, transparent 70%)',
              filter: 'blur(168px)' }}
          />
          <motion.div
            animate={{ x: [20, -18, 20], y: [-12, 16, -12], scale: [1, 1.12, 1], opacity: [0.08, 0.11, 0.08] }}
            transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute rounded-full"
            style={{ top: '43%', right: '-8%', width: 640, height: 480,
              background: 'radial-gradient(ellipse at 40% 60%, rgba(214,0,60,0.25) 0%, rgba(61,0,214,0.2) 55%, transparent 70%)',
              filter: 'blur(172px)' }}
          />
          <motion.div
            animate={{ x: [-18, 24, -18], y: [-10, 14, -10], scale: [1, 1.08, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut', delay: 13 }}
            className="absolute rounded-full"
            style={{ top: '66%', left: '-7%', width: 580, height: 440,
              background: 'radial-gradient(ellipse at center, rgba(61,0,214,0.25) 0%, transparent 70%)',
              filter: 'blur(158px)' }}
          />
          <motion.div
            animate={{ x: [16, -22, 16], y: [14, -12, 14], scale: [1, 1.10, 1], opacity: [0.08, 0.11, 0.08] }}
            transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut', delay: 22 }}
            className="absolute rounded-full"
            style={{ top: '70%', right: '-9%', width: 620, height: 460,
              background: 'radial-gradient(ellipse at 55% 35%, rgba(139,0,149,0.25) 0%, rgba(214,0,60,0.2) 50%, transparent 70%)',
              filter: 'blur(164px)' }}
          />
          <motion.div
            animate={{ x: [-12, 16, -12], y: [-8, 10, -8], scale: [1, 1.07, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
            className="absolute rounded-full"
            style={{ top: '86%', left: '16%', width: 700, height: 380,
              background: 'radial-gradient(ellipse at center, rgba(214,0,60,0.22) 0%, rgba(139,0,149,0.18) 38%, rgba(61,0,214,0.18) 65%, transparent 75%)',
              filter: 'blur(150px)' }}
          />

          {/* Premium Glass Light Streaks — 5 total */}
          <motion.div
            animate={{ opacity: [0.08, 0.12, 0.08], x: [-28, 28, -28] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            style={{ position: 'absolute', top: '7%', left: '-4%', width: '62%', height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(61,0,214,0.9) 40%, rgba(139,0,149,0.78) 70%, transparent)',
              transform: 'rotate(-13deg)', filter: 'blur(9px)', transformOrigin: 'left center' }}
          />
          <motion.div
            animate={{ opacity: [0.06, 0.11, 0.06], x: [22, -22, 22] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
            style={{ position: 'absolute', top: '50%', right: '-4%', width: '54%', height: '2.5px',
              background: 'linear-gradient(270deg, transparent, rgba(214,0,60,0.85) 35%, rgba(139,0,149,0.7) 65%, transparent)',
              transform: 'rotate(9deg)', filter: 'blur(8px)', transformOrigin: 'right center' }}
          />
          <motion.div
            animate={{ opacity: [0.07, 0.12, 0.07], x: [-18, 18, -18] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 26 }}
            style={{ position: 'absolute', top: '82%', left: '8%', width: '56%', height: '2.5px',
              background: 'linear-gradient(90deg, transparent, rgba(139,0,149,0.82) 32%, rgba(61,0,214,0.68) 65%, transparent)',
              transform: 'rotate(-6deg)', filter: 'blur(8px)', transformOrigin: 'left center' }}
          />
          <motion.div
            animate={{ opacity: [0.06, 0.10, 0.06], x: [16, -16, 16] }}
            transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut', delay: 13 }}
            style={{ position: 'absolute', top: '31%', right: '8%', width: '50%', height: '2px',
              background: 'linear-gradient(270deg, transparent, rgba(214,0,60,0.78) 40%, rgba(61,0,214,0.62) 70%, transparent)',
              transform: 'rotate(6deg)', filter: 'blur(7px)', transformOrigin: 'right center' }}
          />
          <motion.div
            animate={{ opacity: [0.07, 0.11, 0.07], x: [-14, 14, -14] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 20 }}
            style={{ position: 'absolute', top: '65%', left: '12%', width: '58%', height: '2.5px',
              background: 'linear-gradient(90deg, transparent, rgba(139,0,149,0.80) 35%, rgba(214,0,60,0.65) 65%, transparent)',
              transform: 'rotate(-5deg)', filter: 'blur(8px)', transformOrigin: 'left center' }}
          />
        </motion.div>

        {/* ══ LAYER 2 — Far-Mid Parallax Layer (~10px range) ══════════════════
            Renders grids, secondary line connections and depth watermarks */}
        <motion.div className="absolute inset-0" style={{ x: x2, y: yLayer2 }}>
          
          {/* Subtle SVG dot-grids watermark inside layout */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage: 'radial-gradient(circle, #7c3aed 1.2px, transparent 1.2px)',
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Accent lighting color pools */}
          <motion.div
            animate={{ scale: [1, 1.09, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{ top: '13%', left: '-5%', width: 440, height: 360,
              background: 'radial-gradient(ellipse, rgba(61,0,214,0.6) 0%, transparent 70%)',
              filter: 'blur(120px)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.11, 1], opacity: [0.045, 0.075, 0.045] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
            className="absolute rounded-full"
            style={{ top: '31%', right: '-6%', width: 480, height: 380,
              background: 'radial-gradient(ellipse, rgba(214,0,60,0.55) 0%, transparent 70%)',
              filter: 'blur(130px)' }}
          />
        </motion.div>

        {/* ══ LAYER 3 — Mid Parallax Layer (~18px range) ═════════════════════
            Renders the core SVG Illustrations, nodes & wireframes */}
        <motion.div className="absolute inset-0" style={{ x: x3, y: yLayer3 }}>

          {/* HERO ── AI network connection rings (slow rotation, 35s) */}
          <motion.svg
            animate={{ y: [0, -22, 0], x: [0, -10, 0], rotate: [0, 360], scale: [0.98, 1.02, 0.98], opacity: [0.08, 0.12, 0.08] }}
            transition={{
              rotate: { duration: 35, repeat: Infinity, ease: 'linear' },
              y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 26, repeat: Infinity, ease: 'easeInOut' }
            }}
            viewBox="0 0 220 220" fill="none" className="absolute"
            style={{ top: '4%', right: '4%', width: 180, height: 180 }}>
            <circle cx="110" cy="110" r="100" stroke="#8B0095" strokeWidth="1.3"/>
            <circle cx="110" cy="110" r="75"  stroke="#3D00D6" strokeWidth="1" strokeDasharray="6 4"/>
            <circle cx="110" cy="110" r="50"  stroke="#8B0095" strokeWidth="1.2"/>
            <circle cx="110" cy="110" r="28"  stroke="#3D00D6" strokeWidth="0.9" strokeDasharray="3 3"/>
            <circle cx="110" cy="110" r="9"   stroke="#D6003C" strokeWidth="1.1"/>
            <circle cx="110" cy="110" r="4"   fill="#3D00D6"/>
          </motion.svg>

          {/* HERO ── Floating Card shape with marketing up-arrow (float 26s) */}
          <motion.svg
            animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [0.99, 1.01, 0.99], opacity: [0.08, 0.11, 0.08] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            viewBox="0 0 160 120" fill="none" className="absolute"
            style={{ top: '3%', left: '8%', width: 140, height: 105 }}>
            <rect x="5" y="5" width="150" height="110" rx="10" stroke="#3D00D6" strokeWidth="1.2"/>
            <polyline points="30,85 70,45 100,75 130,35" stroke="#D6003C" strokeWidth="1.8" strokeLinecap="round"/>
            <polygon points="120,35 130,35 130,45" fill="#D6003C" stroke="none"/>
            <circle cx="30" cy="85" r="4.5" fill="#3D00D6"/>
            <circle cx="70" cy="45" r="4.5" fill="#3D00D6"/>
            <circle cx="100" cy="75" r="4.5" fill="#3D00D6"/>
            <circle cx="130" cy="35" r="4.5" fill="#3D00D6"/>
          </motion.svg>

          {/* ABOUT ── Neural network node mapping (float 21s) */}
          <motion.svg
            animate={{ y: [0, -26, 0], x: [0, 12, 0], rotate: [0, 3, 0], scale: [0.97, 1.03, 0.97], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 340 240" fill="none" className="absolute"
            style={{ top: '11%', left: '2%', width: 290, height: 205 }}>
            <g stroke="#3D00D6" strokeWidth="1.2">
              <line x1="30"  y1="70"  x2="130" y2="30"  /><line x1="30"  y1="70"  x2="100" y2="160" />
              <line x1="130" y1="30"  x2="250" y2="95"  /><line x1="250" y1="95"  x2="320" y2="50"  />
              <line x1="250" y1="95"  x2="300" y2="205" /><line x1="100" y1="160" x2="250" y2="95"  />
              <line x1="100" y1="160" x2="185" y2="225" /><line x1="300" y1="205" x2="185" y2="225" />
              <line x1="30"  y1="70"  x2="300" y2="205" strokeOpacity="0.32" strokeDasharray="5 5" />
            </g>
            <g fill="#3D00D6">
              <circle cx="30"  cy="70"  r="6"  /><circle cx="130" cy="30"  r="5" />
              <circle cx="250" cy="95"  r="9"  /><circle cx="320" cy="50"  r="5" />
              <circle cx="100" cy="160" r="6"  /><circle cx="300" cy="205" r="5" />
              <circle cx="185" cy="225" r="6"  />
            </g>
            <motion.circle cx="250" cy="95" r="14" stroke="#3D00D6" strokeWidth="0.9" fill="none"
              animate={{ r: [10, 22, 10], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}/>
          </motion.svg>

          {/* ABOUT ── DNA Helix illustration (vertical float 22s) */}
          <motion.svg
            animate={{ y: [0, -30, 0], scale: [0.99, 1.01, 0.99], opacity: [0.08, 0.11, 0.08] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 120 360" fill="none" className="absolute"
            style={{ top: '15%', left: '48%', width: 80, height: 240 }}>
            <path d="M20,0 Q60,45 100,90 Q60,135 20,180 Q60,225 100,270 Q60,315 20,360" stroke="#3D00D6" strokeWidth="1.2"/>
            <path d="M100,0 Q60,45 20,90 Q60,135 100,180 Q60,225 20,270 Q60,315 100,360" stroke="#8B0095" strokeWidth="1.2"/>
            {[45, 90, 135, 180, 225, 270, 315].map(y => (
              <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="#D6003C" strokeWidth="0.65" strokeOpacity="0.55"/>
            ))}
          </motion.svg>

          {/* ABOUT ── Growth graph arrow (float 20s) */}
          <motion.svg
            animate={{ y: [0, -22, 0], x: [0, 12, 0], rotate: [0, 2, 0], scale: [0.98, 1.02, 0.98], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 220 175" fill="none" className="absolute"
            style={{ top: '18%', left: '12%', width: 172, height: 137 }}>
            <g stroke="#D6003C" strokeWidth="1.5" strokeLinejoin="round">
              <polyline points="18,148 62,88 116,108 176,42"/>
              <polygon points="172,32 186,38 177,53" fill="#D6003C" fillOpacity="0.55" stroke="none"/>
            </g>
            <g stroke="#3D00D6" strokeWidth="0.95" strokeDasharray="4 3" strokeOpacity="0.55">
              <polyline points="18,160 72,112 128,130 188,74"/>
            </g>
            <line x1="18" y1="160" x2="18"  y2="20"  stroke="#3D00D6" strokeWidth="0.9"/>
            <line x1="18" y1="160" x2="200" y2="160" stroke="#3D00D6" strokeWidth="0.9"/>
          </motion.svg>

          {/* SERVICES ── Circuit grid (float 25s) */}
          <motion.svg
            animate={{ y: [0, -24, 0], x: [0, -15, 0], rotate: [0, -2, 0], scale: [0.98, 1.02, 0.98], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 400 270" fill="none" className="absolute"
            style={{ top: '25%', right: '2%', width: 330, height: 222 }}>
            <g stroke="#3D00D6" strokeWidth="1.2">
              <line x1="30"  y1="65"  x2="370" y2="65"  /><line x1="30"  y1="135" x2="370" y2="135"/>
              <line x1="30"  y1="205" x2="370" y2="205" /><line x1="90"  y1="65"  x2="90"  y2="135"/>
              <line x1="175" y1="65"  x2="175" y2="205" /><line x1="260" y1="135" x2="260" y2="205"/>
            </g>
            <g fill="#D6003C">
              <rect x="82"  y="57"  width="17" height="17" rx="3"/>
              <rect x="167" y="57"  width="17" height="17" rx="3"/>
              <rect x="252" y="127" width="17" height="17" rx="3"/>
            </g>
            <g fill="#3D00D6">
              <circle cx="90"  cy="135" r="6"/><circle cx="175" cy="205" r="6"/>
              <circle cx="260" cy="205" r="6"/>
            </g>
          </motion.svg>

          {/* SERVICES ── Dot Grid background (float 33s) */}
          <motion.svg
            animate={{ y: [0, -16, 0], x: [0, 12, 0], scale: [0.99, 1.01, 0.99], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 230 230" fill="none" className="absolute"
            style={{ top: '28%', left: '1%', width: 200, height: 200 }}>
            <g stroke="#3D00D6" strokeWidth="0.7">
              {[0, 46, 92, 138, 184, 230].map(v => (
                <g key={v}><line x1={v} y1="0" x2={v} y2="230"/><line x1="0" y1={v} x2="230" y2={v}/></g>
              ))}
            </g>
            {[46, 92, 138, 184].flatMap(gx => [46, 92, 138, 184].map(gy =>
              <circle key={`${gx}${gy}`} cx={gx} cy={gy} r="2.5" fill="#3D00D6"/>
            ))}
          </motion.svg>

          {/* SERVICES ── Abstract gear outlining floating icon (float 18s) */}
          <motion.svg
            animate={{ y: [0, -14, 0], x: [0, 8, 0], rotate: [0, 360], opacity: [0.07, 0.10, 0.07] }}
            transition={{
              rotate: { duration: 26, repeat: Infinity, ease: 'linear' },
              y: { duration: 18, repeat: Infinity, ease: 'easeInOut' }
            }}
            viewBox="0 0 100 100" fill="none" className="absolute"
            style={{ top: '26%', left: '46%', width: 90, height: 90 }}>
            <circle cx="50" cy="50" r="30" stroke="#8B0095" strokeWidth="1.2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <line key={deg} x1="50" y1="10" x2="50" y2="20" stroke="#8B0095" strokeWidth="1.5"
                transform={`rotate(${deg} 50 50)`}/>
            ))}
            <circle cx="50" cy="50" r="14" stroke="#3D00D6" strokeWidth="1"/>
          </motion.svg>

          {/* PORTFOLIO ── Media Frame/Browser Windows (float 18s) */}
          <motion.svg
            animate={{ y: [0, -35, 0], x: [0, 16, 0], rotate: [0, 2.5, 0], scale: [0.97, 1.03, 0.97], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 360 250" fill="none" className="absolute"
            style={{ top: '43%', right: '3%', width: 300, height: 208 }}>
            <g stroke="#3D00D6" strokeWidth="1.3" strokeLinejoin="round">
              <rect x="8"   y="15"  width="135" height="86"  rx="7"/>
              <polygon points="38,42 38,70 74,56" fill="#3D00D6" fillOpacity="0.4" stroke="none"/>
              <rect x="158" y="8"   width="175" height="110" rx="7"/>
              <polygon points="198,32 198,68 240,50" fill="#D6003C" fillOpacity="0.35" stroke="none"/>
              <rect x="20"  y="118" width="130" height="92"  rx="7"/>
            </g>
          </motion.svg>

          {/* PORTFOLIO ── Binary text data stream (breathing, 28s) */}
          <motion.svg
            animate={{ opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 300 180" fill="none" className="absolute"
            style={{ top: '46%', right: '44%', width: 220, height: 132 }}>
            {[0, 1, 2, 3, 4].map(row => (
              <g key={row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => {
                  const txt = (row * 10 + col) % 2 === 0 ? '1' : '0'
                  return (
                    <text key={col} x={col * 30 + 8} y={row * 36 + 22}
                      fill="#3D00D6" fontSize="14" fontFamily="monospace" opacity="0.8">{txt}</text>
                  )
                })}
              </g>
            ))}
          </motion.svg>

          {/* INDUSTRIES ── Hex node map (float 27s) */}
          <motion.svg
            animate={{ y: [0, -30, 0], x: [0, 18, 0], rotate: [0, 3, 0], scale: [0.97, 1.03, 0.97], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 310 275" fill="none" className="absolute"
            style={{ top: '52%', right: '2%', width: 256, height: 228 }}>
            <g stroke="#3D00D6" strokeWidth="1.1">
              <line x1="155" y1="28"  x2="248" y2="86" /><line x1="248" y1="86"  x2="248" y2="182"/>
              <line x1="248" y1="182" x2="155" y2="244"/><line x1="155" y1="244" x2="62"  y2="182"/>
              <line x1="62"  y1="182" x2="62"  y2="86" /><line x1="62"  y1="86"  x2="155" y2="28" />
              <line x1="155" y1="28"  x2="155" y2="244"/>
            </g>
            <g fill="#D6003C">
              <circle cx="155" cy="28"  r="7.5"/><circle cx="248" cy="86"  r="6"/>
              <circle cx="248" cy="182" r="6"  /><circle cx="155" cy="244" r="7.5"/>
            </g>
            <circle cx="155" cy="136" r="11" fill="#8B0095"/>
            <motion.circle cx="155" cy="136" r="18" stroke="#8B0095" strokeWidth="0.8" fill="none"
              animate={{ r: [14, 28, 14], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut' }}/>
          </motion.svg>

          {/* INDUSTRIES ── Cube wireframe outline (float 30s) */}
          <motion.svg
            animate={{ y: [0, -20, 0], x: [0, -14, 0], rotate: [0, 4, 0], scale: [0.97, 1.03, 0.97], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 200 200" fill="none" className="absolute"
            style={{ top: '57%', right: '46%', width: 148, height: 148 }}>
            <g stroke="#8B0095" strokeWidth="1.1">
              <rect x="44" y="64" width="90" height="90"/>
              <rect x="64" y="44" width="90" height="90"/>
              <line x1="44"  y1="64"  x2="64"  y2="44" />
              <line x1="134" y1="64"  x2="154" y2="44" />
              <line x1="134" y1="154" x2="155" y2="134"/>
              <line x1="44"  y1="154" x2="64"  y2="134"/>
            </g>
            <circle cx="109" cy="109" r="22" stroke="#3D00D6" strokeWidth="0.8" strokeDasharray="3 3"/>
          </motion.svg>



          {/* TESTIMONIALS ── Rotating radar scan rings (spinning 48s) */}
          <motion.svg
            animate={{ rotate: [0, 360], opacity: [0.05, 0.09, 0.05] }}
            transition={{
              rotate: { duration: 48, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 24, repeat: Infinity, ease: 'easeInOut' }
            }}
            viewBox="0 0 200 200" fill="none" className="absolute"
            style={{ top: '72%', left: '44%', width: 145, height: 145 }}>
            <circle cx="100" cy="100" r="90" stroke="#3D00D6" strokeWidth="0.75" strokeDasharray="8 6"/>
            <circle cx="100" cy="100" r="65" stroke="#8B0095" strokeWidth="0.65" strokeDasharray="5 5"/>
            <circle cx="100" cy="100" r="40" stroke="#D6003C" strokeWidth="0.85"/>
            <circle cx="100" cy="100" r="15" stroke="#3D00D6" strokeWidth="0.75"/>
            <circle cx="100" cy="100" r="5"  fill="#8B0095"/>
            <line x1="100" y1="10" x2="100" y2="100" stroke="#3D00D6" strokeWidth="0.85"/>
          </motion.svg>

          {/* FAQ ── Accordion lines / waves (float 12s) */}
          <motion.svg
            animate={{ y: [0, -14, 0], x: [0, 10, 0], rotate: [0, 1, 0], scale: [0.99, 1.01, 0.99], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 400 110" fill="none" className="absolute"
            style={{ top: '75%', right: '19%', width: 270, height: 75 }}>
            <path d="M0,55 C50,18 100,92 150,55 S250,18 300,55 S350,92 400,55" stroke="#3D00D6" strokeWidth="1.3"/>
            <path d="M0,72 C55,38 108,105 158,72 S258,38 308,72 S358,105 400,72" stroke="#D6003C" strokeWidth="1"   strokeDasharray="6 4"/>
            <path d="M0,38 C45,5  98,72  148,38 S248,5  298,38 S348,72  400,38" stroke="#8B0095" strokeWidth="0.8" strokeDasharray="3 5"/>
          </motion.svg>

          {/* CONTACT ── Paper Airplane 1 (circular path, float 14s) */}
          <motion.svg
            animate={{
              y: [0, -25, 0, 10, 0],
              x: [0, 15, 0, -15, 0],
              rotate: [0, -4, 0, 4, 0],
              scale: [0.98, 1.02, 0.98],
              opacity: [0.08, 0.12, 0.08]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 240 200" fill="none" className="absolute"
            style={{ top: '81%', left: '4%', width: 192, height: 160 }}>
            <g stroke="#3D00D6" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M13,98 L226,28 L146,184 L108,116 Z"/>
              <line x1="13"  y1="98"  x2="146" y2="184"/>
              <line x1="108" y1="116" x2="226" y2="28"/>
            </g>
            <path d="M7,112 Q-18,127 -40,116" stroke="#D6003C" strokeWidth="1.1" strokeDasharray="5 4"/>
          </motion.svg>

          {/* CONTACT ── Paper Airplane 2 (circular path offset, float 17s) */}
          <motion.svg
            animate={{
              y: [10, -20, 10, 20, 10],
              x: [-10, 10, -10, -20, -10],
              rotate: [4, -3, 4, 8, 4],
              scale: [0.98, 1.02, 0.98],
              opacity: [0.08, 0.11, 0.08]
            }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 240 200" fill="none" className="absolute"
            style={{ top: '78%', right: '5%', width: 142, height: 120 }}>
            <g stroke="#8B0095" strokeWidth="1.4" strokeLinejoin="round">
              <path d="M13,98 L226,28 L146,184 L108,116 Z"/>
              <line x1="13"  y1="98"  x2="146" y2="184"/>
              <line x1="108" y1="116" x2="226" y2="28"/>
            </g>
          </motion.svg>

          {/* CONTACT ── Chat bubbles (float 31s) */}
          <motion.svg
            animate={{ y: [0, -18, 0], x: [0, -10, 0], rotate: [0, 2, 0], scale: [0.99, 1.01, 0.99], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 320 205" fill="none" className="absolute"
            style={{ top: '84%', right: '3%', width: 258, height: 165 }}>
            <g stroke="#3D00D6" strokeWidth="1.2">
              <path d="M20,20 Q20,9 31,9 L188,9 Q199,9 199,20 L199,92 Q199,103 188,103 L104,103 L74,130 L80,103 L31,103 Q20,103 20,92 Z"/>
              <path d="M118,70 Q118,60 128,60 L275,60 Q285,60 285,70 L285,122 Q285,132 275,132 L228,132 L222,149 L226,132 L128,132 Q118,132 118,122 Z" strokeOpacity="0.54"/>
            </g>
            <g fill="#D6003C" fillOpacity="0.55">
              <circle cx="70"  cy="56" r="8"/><circle cx="110" cy="56" r="8"/><circle cx="150" cy="56" r="8"/>
            </g>
          </motion.svg>

          {/* FOOTER ── Constellation constellation nodes (float 42s) */}
          <motion.svg
            animate={{ y: [0, -12, 0], scale: [0.998, 1.002, 0.998], opacity: [0.06, 0.10, 0.06] }}
            transition={{ duration: 42, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 1440 145" fill="none" className="absolute"
            style={{ top: '94%', left: 0, width: '100%', height: 145 }}
            preserveAspectRatio="none">
            <g stroke="#3D00D6" strokeWidth="0.75" strokeOpacity="0.68">
              {CONST_LINES.map(([a, b], i) => (
                <line key={i} x1={STARS[a].x} y1={STARS[a].y} x2={STARS[b].x} y2={STARS[b].y}/>
              ))}
            </g>
            <g fill="#D6003C">
              {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={i % 5 === 0 ? 3 : 1.8}/>)}
            </g>
          </motion.svg>

          {/* EXTRA ── DNA / double helix (float 22s) */}
          <motion.svg
            animate={{ y: [0, -10, 0], x: [0, -6, 0], scale: [0.99, 1.01, 0.99], opacity: [0.06, 0.10, 0.06] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
            viewBox="0 0 120 360" fill="none" className="absolute"
            style={{ top: '18%', left: '48%', width: 80, height: 240 }}>
            <path d="M20,0 Q60,45 100,90 Q60,135 20,180 Q60,225 100,270 Q60,315 20,360" stroke="#3D00D6" strokeWidth="1.2"/>
            <path d="M100,0 Q60,45 20,90 Q60,135 100,180 Q60,225 20,270 Q60,315 100,360" stroke="#8B0095" strokeWidth="1.2"/>
            {[45, 90, 135, 180, 225, 270, 315].map(y => (
              <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="#D6003C" strokeWidth="0.65" strokeOpacity="0.55"/>
            ))}
          </motion.svg>

          {/* EXTRA ── Radar / scan rings (spinning 48s) */}
          <motion.svg
            animate={{ rotate: [0, 360], opacity: [0.05, 0.09, 0.05] }}
            transition={{
              rotate: { duration: 48, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 6 }
            }}
            viewBox="0 0 200 200" fill="none" className="absolute"
            style={{ top: '72%', left: '44%', width: 145, height: 145 }}>
            <circle cx="100" cy="100" r="90" stroke="#3D00D6" strokeWidth="0.75" strokeDasharray="8 6"/>
            <circle cx="100" cy="100" r="65" stroke="#8B0095" strokeWidth="0.65" strokeDasharray="5 5"/>
            <circle cx="100" cy="100" r="40" stroke="#D6003C" strokeWidth="0.85"/>
            <circle cx="100" cy="100" r="15" stroke="#3D00D6" strokeWidth="0.75"/>
            <circle cx="100" cy="100" r="5"  fill="#8B0095"/>
            <line x1="100" y1="10" x2="100" y2="100" stroke="#3D00D6" strokeWidth="0.85"/>
          </motion.svg>

          {/* EXTRA ── Binary / data stream (breath 28s) */}
          <motion.svg
            animate={{ opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
            viewBox="0 0 300 180" fill="none" className="absolute"
            style={{ top: '46%', right: '44%', width: 220, height: 132 }}>
            {[0, 1, 2, 3, 4].map(row => (
              <g key={row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => {
                  const txt = (row * 10 + col) % 2 === 0 ? '1' : '0'
                  return (
                    <text key={col} x={col * 30 + 8} y={row * 36 + 22}
                      fill="#3D00D6" fontSize="14" fontFamily="monospace" opacity="0.8">{txt}</text>
                  )
                })}
              </g>
            ))}
          </motion.svg>

          {/* EXTRA ── Signal waves (float 12s) */}
          <motion.svg
            animate={{ y: [0, -14, 0], x: [0, 10, 0], rotate: [0, 1, 0], scale: [0.99, 1.01, 0.99], opacity: [0.07, 0.10, 0.07] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 15 }}
            viewBox="0 0 400 110" fill="none" className="absolute"
            style={{ top: '36%', right: '19%', width: 270, height: 75 }}>
            <path d="M0,55 C50,18 100,92 150,55 S250,18 300,55 S350,92 400,55" stroke="#3D00D6" strokeWidth="1.3"/>
            <path d="M0,72 C55,38 108,105 158,72 S258,38 308,72 S358,105 400,72" stroke="#D6003C" strokeWidth="1"   strokeDasharray="6 4"/>
            <path d="M0,38 C45,5  98,72  148,38 S248,5  298,38 S348,72  400,38" stroke="#8B0095" strokeWidth="0.8" strokeDasharray="3 5"/>
          </motion.svg>

        </motion.div>

        {/* ══ LAYER 4 — Near Parallax Layer (~28px range) ════════════════════
            Renders floating concentric rings, accent lines and design overlays */}
        <motion.div className="absolute inset-0" style={{ x: x4, y: yLayer4 }}>

          {/* Floating rings */}
          {RINGS.map((r, i) => (
            <motion.div key={`ring-${i}`}
              animate={{ y: [0, -(r.s * 0.14), 0], rotate: [0, 360], opacity: [0.08, 0.14, 0.08] }}
              transition={{
                rotate: { duration: r.dur * 1.5, repeat: Infinity, ease: 'linear' },
                y: { duration: r.dur, repeat: Infinity, ease: 'easeInOut', delay: r.delay }
              }}
              className="absolute rounded-full"
              style={{
                top: r.top,
                left: 'left' in r ? r.left : undefined,
                right: 'right' in r ? r.right : undefined,
                width: r.s, height: r.s, border: `1.5px solid ${r.c}`,
              }}
            />
          ))}

          {/* Curved accent lines */}
          <motion.svg
            animate={{ opacity: [0.05, 0.085, 0.05], y: [0, -10, 0], x: [0, 15, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            viewBox="0 0 480 230" fill="none" className="absolute"
            style={{ top: '32%', right: '20%', width: 300, height: 144 }}>
            <path d="M8,210 Q120,28 240,125 T472,55"  stroke="#3D00D6" strokeWidth="1.1"/>
            <path d="M8,190 Q135,48 255,145 T472,75"  stroke="#8B0095" strokeWidth="0.9" strokeDasharray="7 5"/>
            <path d="M8,228 Q108,60 228,158 T472,98"  stroke="#D6003C" strokeWidth="0.7" strokeDasharray="4 6"/>
          </motion.svg>
          <motion.svg
            animate={{ opacity: [0.042, 0.072, 0.042], y: [0, 11, 0], x: [0, -15, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 19 }}
            viewBox="0 0 480 230" fill="none" className="absolute"
            style={{ top: '65%', left: '20%', width: 300, height: 144 }}>
            <path d="M8,38 Q95,195 240,96 T472,188"  stroke="#D6003C" strokeWidth="1.1"/>
            <path d="M8,58 Q110,215 255,116 T472,208" stroke="#3D00D6" strokeWidth="0.9" strokeDasharray="6 5"/>
          </motion.svg>

          {/* Full-page wave overlay */}
          <motion.svg
            animate={{ opacity: [0.03, 0.055, 0.03] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
            viewBox="0 0 1440 900" fill="none"
            className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,190 C290,108 580,272 870,190 S1260,108 1440,190" stroke="#3D00D6" strokeWidth="1.2"/>
            <path d="M0,400 C310,318 620,478 860,400 S1240,318 1440,400" stroke="#8B0095" strokeWidth="1"/>
            <path d="M0,610 C280,528 560,688 840,610 S1220,528 1440,610" stroke="#D6003C" strokeWidth="0.9"/>
          </motion.svg>
        </motion.div>

        {/* ══ LAYER 5 — Fore Parallax Layer (~40px range) ════════════════════
            Renders canvas particles, sparkle dots, and high-frequency sparks */}
        <motion.div className="absolute inset-0" style={{ x: x5, y: yLayer5 }}>
          
          {/* Particle canvas embedded in parallax to shift with depth */}
          <canvas ref={canvasRef} aria-hidden="true"
            className="absolute top-0 left-0 w-full pointer-events-none select-none"
          />

          {/* Standard sparkle dots — 18 total */}
          {DOTS.map((dot, i) => (
            <motion.div key={`dot-${i}`}
              animate={{ y: [0, -12, 0], scale: [1, 1.8, 1], opacity: [0.12, 0.32, 0.12] }}
              transition={{ duration: dot.dur, repeat: Infinity, ease: 'easeInOut', delay: dot.d }}
              className="absolute rounded-full"
              style={{ top: dot.top, left: dot.left, width: dot.sz, height: dot.sz, background: dot.c }}
            />
          ))}

          {/* Micro-blobs — 6 small colour pools */}
          {[
            { top: '16%', left: '60%', c: 'rgba(214,0,60,0.7)',  sz: 90, dur: 16, d: 2 },
            { top: '31%', left: '18%', c: 'rgba(61,0,214,0.7)',  sz: 75, dur: 22, d: 7 },
            { top: '48%', left: '70%', c: 'rgba(139,0,149,0.7)', sz: 95, dur: 19, d: 4 },
            { top: '62%', left: '32%', c: 'rgba(214,0,60,0.65)', sz: 70, dur: 27, d: 10 },
            { top: '79%', left: '65%', c: 'rgba(61,0,214,0.65)', sz: 80, dur: 15, d: 1 },
            { top: '90%', left: '24%', c: 'rgba(139,0,149,0.65)', sz: 88, dur: 23, d: 6 },
          ].map((b, i) => (
            <motion.div key={`mblob-${i}`}
              animate={{ y: [0, -(b.sz * 0.22), 0], x: [0, i % 2 === 0 ? 10 : -10, 0], scale: [1, 1.12, 1], opacity: [0.06, 0.10, 0.06] }}
              transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
              className="absolute rounded-full"
              style={{ top: b.top, left: b.left, width: b.sz, height: b.sz,
                background: `radial-gradient(circle,${b.c} 0%,transparent 70%)`,
                filter: 'blur(22px)' }}
            />
          ))}

          {/* High-frequency fast-blink sparkle dots — 8 extra foreground sparks */}
          {[
            { top: '9%',  left: '55%', sz: 3, dur: 7,  d: 0   },
            { top: '18%', left: '30%', sz: 2, dur: 9,  d: 2.2 },
            { top: '27%', left: '78%', sz: 4, dur: 12, d: 0.8 },
            { top: '42%', left: '42%', sz: 2, dur: 8,  d: 3.5 },
            { top: '56%', left: '88%', sz: 3, dur: 10, d: 1.4 },
            { top: '70%', left: '15%', sz: 4, dur: 11, d: 4.1 },
            { top: '83%', left: '58%', sz: 2, dur: 7,  d: 2.7 },
            { top: '92%', left: '36%', sz: 3, dur: 9,  d: 0.5 },
          ].map((p, i) => (
            <motion.div key={`spark-${i}`}
              animate={{ y: [0, -8, 0], scale: [1, 2, 1], opacity: [0.14, 0.38, 0.14] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
              className="absolute rounded-full"
              style={{ top: p.top, left: p.left, width: p.sz, height: p.sz,
                background: i % 2 === 0 ? '#D6003C' : '#3D00D6' }}
            />
          ))}
        </motion.div>

      </div>
    </>
  )
}
