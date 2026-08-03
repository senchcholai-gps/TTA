'use client'

/**
 * PageBackgroundCanvas  (v4 — Focused Ambient Motion)
 *
 * Design philosophy (matching Framer Landin / Portfolite quality):
 *
 *  ✦ Every SVG illustration has FULL ambient life:
 *      float Y  (±8–18px),  slow drift X (±4–10px),
 *      gentle rotate (±2–4°), scale breath (0.98–1.03)
 *      — all on different durations (18–45 s) so nothing ever syncs
 *
 *  ✦ 4-depth spring parallax layers:
 *      L1 ~6px  |  L2 ~12px  |  L3 ~20px  |  L4 ~30px
 *      Spring: smoothly eases, gently returns when cursor is idle
 *
 *  ✦ Ambient gradient blobs (very few, very large, very soft) —
 *      they slowly morph position; 8–10% opacity
 *
 *  ✦ Subtle glass light streaks: 3 only, very long cycle (28–40 s)
 *
 *  ✦ Floating rings + sparkle dots — kept minimal
 *
 *  ✦ NO new large decorative objects added
 *
 * Performance:
 *  ─ GPU-only: transform, opacity, scale, rotate (no layout paint)
 *  ─ All blur() on position:absolute elements
 *  ─ hidden md:block (disabled on mobile)
 *  ─ Returns null when prefers-reduced-motion
 */

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// ─── 4 parallax depth layers ──────────────────────────────────────────────────
// Spring config: each layer eases smoothly and returns to rest
// Lower stiffness = slower/smoother = feels farther away
const L1 = { stiffness: 12, damping: 30, mass: 2.5 }  //  ~6 px max
const L2 = { stiffness: 25, damping: 32, mass: 1.8 }  // ~12 px max
const L3 = { stiffness: 45, damping: 36, mass: 1.2 }  // ~20 px max
const L4 = { stiffness: 70, damping: 42, mass: 0.9 }  // ~30 px max

// ─── Floating rings — minimal set, elegant ───────────────────────────────────
const RINGS = [
  { top: '6%',  left: '20%',  s: 100, dur: 23, delay: 0,   rot: 3,  c: '#3D00D6' },
  { top: '20%', right: '14%', s: 76,  dur: 31, delay: 4.2, rot: -4, c: '#8B0095' },
  { top: '42%', left: '5%',   s: 115, dur: 27, delay: 2.1, rot: 3,  c: '#3D00D6' },
  { top: '59%', right: '20%', s: 72,  dur: 37, delay: 6.8, rot: -3, c: '#D6003C' },
  { top: '75%', left: '36%',  s: 90,  dur: 19, delay: 1.5, rot: 4,  c: '#8B0095' },
  { top: '90%', right: '12%', s: 96,  dur: 43, delay: 5.3, rot: -3, c: '#3D00D6' },
] as const

// ─── Sparkle particles — scattered, varied timings ───────────────────────────
const DOTS = [
  { top: '4%',  left: '44%', sz: 3, dur: 11, delay: 0,   c: '#3D00D6' },
  { top: '11%', left: '71%', sz: 4, dur: 17, delay: 2.3, c: '#D6003C' },
  { top: '18%', left: '27%', sz: 2, dur: 13, delay: 5.1, c: '#8B0095' },
  { top: '26%', left: '84%', sz: 5, dur: 21, delay: 1.4, c: '#3D00D6' },
  { top: '33%', left: '12%', sz: 3, dur: 15, delay: 7.2, c: '#D6003C' },
  { top: '39%', left: '58%', sz: 4, dur: 19, delay: 3.8, c: '#8B0095' },
  { top: '47%', left: '77%', sz: 2, dur: 23, delay: 0.9, c: '#3D00D6' },
  { top: '54%', left: '32%', sz: 5, dur: 12, delay: 4.5, c: '#D6003C' },
  { top: '61%', left: '66%', sz: 3, dur: 18, delay: 2.7, c: '#8B0095' },
  { top: '68%', left: '48%', sz: 4, dur: 25, delay: 6.1, c: '#3D00D6' },
  { top: '76%', left: '11%', sz: 2, dur: 14, delay: 3.2, c: '#D6003C' },
  { top: '83%', left: '79%', sz: 5, dur: 20, delay: 1.8, c: '#8B0095' },
  { top: '89%', left: '38%', sz: 3, dur: 16, delay: 5.9, c: '#3D00D6' },
  { top: '95%', left: '62%', sz: 4, dur: 22, delay: 0.4, c: '#D6003C' },
] as const

// ─── Footer constellation ─────────────────────────────────────────────────────
const STARS = [
  {x:70,y:38},{x:155,y:18},{x:240,y:52},{x:325,y:28},{x:400,y:65},{x:480,y:22},
  {x:560,y:58},{x:640,y:18},{x:720,y:48},{x:800,y:35},{x:880,y:62},{x:960,y:25},
  {x:1040,y:52},{x:1120,y:18},{x:1200,y:48},{x:1280,y:32},{x:1360,y:58},{x:1400,y:14},
  {x:110,y:88},{x:210,y:108},{x:340,y:92},{x:460,y:112},{x:590,y:82},{x:710,y:102},
  {x:830,y:88},{x:955,y:108},{x:1085,y:78},{x:1210,y:98},{x:1340,y:88},{x:1420,y:104},
] as const
const CONST_LINES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],
  [18,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],[25,26],[26,27],[27,28],[28,29],
  [0,18],[2,19],[4,20],[6,21],[8,22],[10,23],[12,24],[14,25],[16,26],[17,29],
]

// ─────────────────────────────────────────────────────────────────────────────

export default function PageBackgroundCanvas() {
  const shouldReduceMotion = useReducedMotion()

  // 4 parallax raw values
  const rX1 = useMotionValue(0); const rY1 = useMotionValue(0)
  const rX2 = useMotionValue(0); const rY2 = useMotionValue(0)
  const rX3 = useMotionValue(0); const rY3 = useMotionValue(0)
  const rX4 = useMotionValue(0); const rY4 = useMotionValue(0)

  // Spring-smoothed output for each layer
  const x1 = useSpring(rX1, L1); const y1 = useSpring(rY1, L1)
  const x2 = useSpring(rX2, L2); const y2 = useSpring(rY2, L2)
  const x3 = useSpring(rX3, L3); const y3 = useSpring(rY3, L3)
  const x4 = useSpring(rX4, L4); const y4 = useSpring(rY4, L4)

  useEffect(() => {
    if (shouldReduceMotion) return

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth  - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      //  Scale factors chosen so at cursor edge (±0.5) each layer hits its target px
      rX1.set(nx * 12);  rY1.set(ny *  9)   // L1 ≈ 6px
      rX2.set(nx * 24);  rY2.set(ny * 18)   // L2 ≈ 12px
      rX3.set(nx * 40);  rY3.set(ny * 30)   // L3 ≈ 20px
      rX4.set(nx * 60);  rY4.set(ny * 46)   // L4 ≈ 30px
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [shouldReduceMotion, rX1, rY1, rX2, rY2, rX3, rY3, rX4, rY4])

  if (shouldReduceMotion) return null

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none hidden md:block"
      style={{ zIndex: 0, overflow: 'hidden' }}
    >

      {/* ═══════════════════════════════════════════════════════════
          AMBIENT GRADIENT BLOBS  (no parallax — deepest layer)
          Large, very soft, slowly drifting brand-colour pools.
          They set the "lighting atmosphere" behind all sections.
          ═══════════════════════════════════════════════════════════ */}

      {/* Top-left — purple */}
      <motion.div
        animate={{ x: [-20, 18, -20], y: [-12, 10, -12], scale: [1, 1.08, 1], opacity: [0.07, 0.10, 0.07] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        className="absolute rounded-full"
        style={{ top: '8%', left: '-8%', width: 580, height: 440,
          background: 'radial-gradient(ellipse at center, rgba(61,0,214,0.55) 0%, transparent 70%)',
          filter: 'blur(160px)' }}
      />
      {/* Top-right — red */}
      <motion.div
        animate={{ x: [16, -22, 16], y: [8, -14, 8], scale: [1, 1.10, 1], opacity: [0.065, 0.095, 0.065] }}
        transition={{ duration: 41, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
        className="absolute rounded-full"
        style={{ top: '6%', right: '-10%', width: 620, height: 480,
          background: 'radial-gradient(ellipse at center, rgba(214,0,60,0.5) 0%, transparent 70%)',
          filter: 'blur(175px)' }}
      />
      {/* Centre-left — magenta */}
      <motion.div
        animate={{ x: [-14, 20, -14], y: [10, -16, 10], scale: [1, 1.09, 1], opacity: [0.07, 0.10, 0.07] }}
        transition={{ duration: 37, repeat: Infinity, ease: 'easeInOut', delay: 18 }}
        className="absolute rounded-full"
        style={{ top: '38%', left: '-6%', width: 560, height: 420,
          background: 'radial-gradient(ellipse at center, rgba(139,0,149,0.5) 0%, transparent 70%)',
          filter: 'blur(165px)' }}
      />
      {/* Centre-right — purple/red */}
      <motion.div
        animate={{ x: [18, -16, 18], y: [-10, 14, -10], scale: [1, 1.11, 1], opacity: [0.065, 0.095, 0.065] }}
        transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute rounded-full"
        style={{ top: '44%', right: '-8%', width: 590, height: 450,
          background: 'radial-gradient(ellipse at 40% 60%, rgba(214,0,60,0.42) 0%, rgba(61,0,214,0.32) 55%, transparent 70%)',
          filter: 'blur(170px)' }}
      />
      {/* Lower-left — purple */}
      <motion.div
        animate={{ x: [-16, 22, -16], y: [-8, 12, -8], scale: [1, 1.07, 1], opacity: [0.07, 0.10, 0.07] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut', delay: 13 }}
        className="absolute rounded-full"
        style={{ top: '66%', left: '-7%', width: 540, height: 400,
          background: 'radial-gradient(ellipse at center, rgba(61,0,214,0.48) 0%, transparent 70%)',
          filter: 'blur(155px)' }}
      />
      {/* Lower-right — magenta/red */}
      <motion.div
        animate={{ x: [14, -20, 14], y: [12, -10, 12], scale: [1, 1.09, 1], opacity: [0.065, 0.095, 0.065] }}
        transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut', delay: 22 }}
        className="absolute rounded-full"
        style={{ top: '70%', right: '-9%', width: 570, height: 430,
          background: 'radial-gradient(ellipse at 55% 35%, rgba(139,0,149,0.48) 0%, rgba(214,0,60,0.32) 50%, transparent 70%)',
          filter: 'blur(162px)' }}
      />
      {/* Bottom centre — full spectrum */}
      <motion.div
        animate={{ x: [-10, 14, -10], y: [-6, 9, -6], scale: [1, 1.06, 1], opacity: [0.07, 0.10, 0.07] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        className="absolute rounded-full"
        style={{ top: '86%', left: '18%', width: 660, height: 360,
          background: 'radial-gradient(ellipse at center, rgba(214,0,60,0.38) 0%, rgba(139,0,149,0.28) 38%, rgba(61,0,214,0.28) 65%, transparent 75%)',
          filter: 'blur(148px)' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          GLASS LIGHT STREAKS  (3 only — very subtle, long cycles)
          ═══════════════════════════════════════════════════════════ */}

      <motion.div
        animate={{ opacity: [0, 0.055, 0], x: [-24, 24, -24] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        style={{ position:'absolute', top:'7%', left:'-4%', width:'62%', height:'3px',
          background:'linear-gradient(90deg, transparent, rgba(61,0,214,0.85) 40%, rgba(139,0,149,0.75) 70%, transparent)',
          transform:'rotate(-13deg)', filter:'blur(9px)', transformOrigin:'left center' }}
      />
      <motion.div
        animate={{ opacity: [0, 0.045, 0], x: [20, -20, 20] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
        style={{ position:'absolute', top:'50%', right:'-4%', width:'52%', height:'2.5px',
          background:'linear-gradient(270deg, transparent, rgba(214,0,60,0.8) 35%, rgba(139,0,149,0.65) 65%, transparent)',
          transform:'rotate(9deg)', filter:'blur(8px)', transformOrigin:'right center' }}
      />
      <motion.div
        animate={{ opacity: [0, 0.05, 0], x: [-16, 16, -16] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 26 }}
        style={{ position:'absolute', top:'82%', left:'8%', width:'56%', height:'2.5px',
          background:'linear-gradient(90deg, transparent, rgba(139,0,149,0.78) 32%, rgba(61,0,214,0.65) 65%, transparent)',
          transform:'rotate(-6deg)', filter:'blur(8px)', transformOrigin:'left center' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          LAYER 1  — deepest parallax (~6px)
          Large ambient illustration blobs on this layer.
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="absolute inset-0" style={{ x: x1, y: y1 }}>

        {/* Soft breathing glow pools (smaller than the main blobs) */}
        <motion.div
          animate={{ scale:[1,1.08,1], opacity:[0.045,0.075,0.045] }}
          transition={{ duration:28, repeat:Infinity, ease:'easeInOut' }}
          className="absolute rounded-full"
          style={{ top:'12%', left:'-5%', width:420, height:340,
            background:'radial-gradient(ellipse, rgba(61,0,214,0.6) 0%, transparent 70%)',
            filter:'blur(120px)' }}
        />
        <motion.div
          animate={{ scale:[1,1.10,1], opacity:[0.04,0.07,0.04] }}
          transition={{ duration:35, repeat:Infinity, ease:'easeInOut', delay:8 }}
          className="absolute rounded-full"
          style={{ top:'30%', right:'-6%', width:460, height:360,
            background:'radial-gradient(ellipse, rgba(214,0,60,0.55) 0%, transparent 70%)',
            filter:'blur(130px)' }}
        />
        <motion.div
          animate={{ scale:[1,1.09,1], opacity:[0.045,0.075,0.045] }}
          transition={{ duration:42, repeat:Infinity, ease:'easeInOut', delay:16 }}
          className="absolute rounded-full"
          style={{ top:'56%', left:'-4%', width:440, height:340,
            background:'radial-gradient(ellipse, rgba(139,0,149,0.55) 0%, transparent 70%)',
            filter:'blur(125px)' }}
        />
        <motion.div
          animate={{ scale:[1,1.07,1], opacity:[0.04,0.068,0.04] }}
          transition={{ duration:38, repeat:Infinity, ease:'easeInOut', delay:4 }}
          className="absolute rounded-full"
          style={{ top:'74%', right:'-7%', width:480, height:360,
            background:'radial-gradient(ellipse, rgba(61,0,214,0.5) 0%, transparent 70%)',
            filter:'blur(135px)' }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 2  — medium parallax (~12px)
          Section-specific SVG illustrations — every one has full
          ambient life: float + drift + rotate + scale breath.
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="absolute inset-0" style={{ x: x2, y: y2 }}>

        {/* ── ABOUT: AI Neural Network ──────────────────────────────
            Float: 14px  Drift: 6px  Rotate: ±3°  Scale: 0.98–1.02
            Duration: 23s  — never syncs with other 23/29/37/41/... */}
        <motion.svg
          animate={{
            y: [0, -14, 0],
            x: [0, 6, 0],
            rotate: [0, 2.5, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.065, 0.10, 0.065],
          }}
          transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
          viewBox="0 0 340 240" fill="none"
          className="absolute"
          style={{ top: '11%', left: '2%', width: 280, height: 197 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.1">
            <line x1="30"  y1="70"  x2="130" y2="30"  />
            <line x1="30"  y1="70"  x2="100" y2="160" />
            <line x1="130" y1="30"  x2="250" y2="95"  />
            <line x1="250" y1="95"  x2="320" y2="50"  />
            <line x1="250" y1="95"  x2="300" y2="200" />
            <line x1="100" y1="160" x2="250" y2="95"  />
            <line x1="100" y1="160" x2="185" y2="220" />
            <line x1="300" y1="200" x2="185" y2="220" />
            <line x1="30"  y1="70"  x2="300" y2="200" strokeOpacity="0.30" strokeDasharray="5 5" />
            <line x1="130" y1="30"  x2="185" y2="220" strokeOpacity="0.28" strokeDasharray="4 6" />
          </g>
          <g fill="#3D00D6">
            <circle cx="30"  cy="70"  r="5.5" />
            <circle cx="130" cy="30"  r="4.5" />
            <circle cx="250" cy="95"  r="8"   />
            <circle cx="320" cy="50"  r="4.5" />
            <circle cx="100" cy="160" r="5.5" />
            <circle cx="300" cy="200" r="4.5" />
            <circle cx="185" cy="220" r="5.5" />
          </g>
          {/* Breathing pulse on hub node */}
          <motion.circle cx="250" cy="95" r="14"
            stroke="#3D00D6" strokeWidth="0.8" fill="none"
            animate={{ r:[10,20,10], opacity:[0.35,0,0.35] }}
            transition={{ duration:3.2, repeat:Infinity, ease:'easeOut' }}
          />
        </motion.svg>

        {/* ── ABOUT: Concentric rings ────────────────────────────────
            Float: 9px  Drift: −5px  Rotate: ±4°  Scale: 0.97–1.03
            Duration: 31s */}
        <motion.svg
          animate={{
            y: [0, -9, 0],
            x: [0, -5, 0],
            rotate: [0, 4, 0],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.055, 0.088, 0.055],
          }}
          transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          viewBox="0 0 220 220" fill="none"
          className="absolute"
          style={{ top: '10%', right: '4%', width: 175, height: 175 }}
        >
          <circle cx="110" cy="110" r="100" stroke="#8B0095" strokeWidth="1.2" />
          <circle cx="110" cy="110" r="75"  stroke="#3D00D6" strokeWidth="0.9" strokeDasharray="6 4" />
          <circle cx="110" cy="110" r="50"  stroke="#8B0095" strokeWidth="1.1" />
          <circle cx="110" cy="110" r="28"  stroke="#3D00D6" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="110" cy="110" r="9"   stroke="#D6003C" strokeWidth="1" />
          <circle cx="110" cy="110" r="4"   fill="#3D00D6" />
        </motion.svg>

        {/* ── SERVICES: AI Circuit / Data Grid ──────────────────────
            Float: 11px  Drift: −7px  Rotate: ±2°  Scale: 0.98–1.02
            Duration: 29s */}
        <motion.svg
          animate={{
            y: [0, -11, 0],
            x: [0, -7, 0],
            rotate: [0, -2, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.06, 0.095, 0.06],
          }}
          transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          viewBox="0 0 400 270" fill="none"
          className="absolute"
          style={{ top: '25%', right: '2%', width: 320, height: 216 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.1">
            <line x1="30"  y1="65"  x2="370" y2="65"  />
            <line x1="30"  y1="135" x2="370" y2="135" />
            <line x1="30"  y1="205" x2="370" y2="205" />
            <line x1="90"  y1="65"  x2="90"  y2="135" />
            <line x1="175" y1="65"  x2="175" y2="205" />
            <line x1="260" y1="135" x2="260" y2="205" />
            <line x1="330" y1="65"  x2="330" y2="135" />
          </g>
          <g fill="#D6003C">
            <rect x="82"  y="57"  width="16" height="16" rx="3" />
            <rect x="167" y="57"  width="16" height="16" rx="3" />
            <rect x="252" y="127" width="16" height="16" rx="3" />
            <rect x="322" y="57"  width="16" height="16" rx="3" />
          </g>
          <g fill="#3D00D6">
            <circle cx="90"  cy="135" r="5.5" />
            <circle cx="175" cy="205" r="5.5" />
            <circle cx="260" cy="205" r="5.5" />
            <circle cx="330" cy="135" r="5.5" />
          </g>
        </motion.svg>

        {/* ── SERVICES: Dot grid ─────────────────────────────────────
            Float: 6px  Drift: 8px  Rotate: none  Scale: 0.99–1.01
            Duration: 37s */}
        <motion.svg
          animate={{
            y: [0, -6, 0],
            x: [0, 8, 0],
            scale: [0.99, 1.01, 0.99],
            opacity: [0.04, 0.065, 0.04],
          }}
          transition={{ duration: 37, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
          viewBox="0 0 230 230" fill="none"
          className="absolute"
          style={{ top: '28%', left: '1%', width: 190, height: 190 }}
        >
          <g stroke="#3D00D6" strokeWidth="0.65">
            {[0, 46, 92, 138, 184, 230].map(v => (
              <g key={v}>
                <line x1={v} y1="0"   x2={v}   y2="230" />
                <line x1="0" y1={v}   x2="230" y2={v} />
              </g>
            ))}
          </g>
          {[46, 92, 138, 184].flatMap(gx => [46, 92, 138, 184].map(gy =>
            <circle key={`${gx}${gy}`} cx={gx} cy={gy} r="2.5" fill="#3D00D6" />
          ))}
        </motion.svg>

        {/* ── PORTFOLIO: Media frame outlines ───────────────────────
            Float: 16px  Drift: 5px  Rotate: ±2.5°  Scale: 0.97–1.03
            Duration: 41s */}
        <motion.svg
          animate={{
            y: [0, -16, 0],
            x: [0, 5, 0],
            rotate: [0, 2.5, 0],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.055, 0.09, 0.055],
          }}
          transition={{ duration: 41, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          viewBox="0 0 360 250" fill="none"
          className="absolute"
          style={{ top: '43%', right: '3%', width: 290, height: 202 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.25" strokeLinejoin="round">
            <rect x="8"   y="15"  width="132" height="84"  rx="7" />
            <polygon points="38,42 38,70 74,56" fill="#3D00D6" fillOpacity="0.38" stroke="none" />
            <rect x="158" y="8"   width="172" height="108" rx="7" />
            <polygon points="198,32 198,68 240,50" fill="#D6003C" fillOpacity="0.32" stroke="none" />
            <rect x="20"  y="118" width="126" height="90"  rx="7" />
            <polygon points="55,138 55,164 90,151" fill="#3D00D6" fillOpacity="0.32" stroke="none" />
          </g>
          <g stroke="#8B0095" strokeWidth="0.8" strokeOpacity="0.55">
            <path d="M268,20 L288,20 L288,40" /><path d="M268,108 L288,108 L288,88" />
          </g>
        </motion.svg>

        {/* ── CASE STUDIES: Analytics chart ─────────────────────────
            Float: 10px  Drift: −6px  Rotate: ±1.5°  Scale: 0.98–1.02
            Duration: 27s */}
        <motion.svg
          animate={{
            y: [0, -10, 0],
            x: [0, -6, 0],
            rotate: [0, -1.5, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.055, 0.09, 0.055],
          }}
          transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
          viewBox="0 0 330 215" fill="none"
          className="absolute"
          style={{ top: '51%', left: '2%', width: 264, height: 172 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.1">
            <line x1="32" y1="185" x2="32" y2="18" />
            <line x1="32" y1="185" x2="310" y2="185" />
          </g>
          <g stroke="#3D00D6" strokeWidth="0.7" strokeDasharray="5 4" strokeOpacity="0.38">
            <line x1="32" y1="146" x2="310" y2="146" />
            <line x1="32" y1="106" x2="310" y2="106" />
            <line x1="32" y1="66"  x2="310" y2="66"  />
            <line x1="32" y1="30"  x2="310" y2="30"  />
          </g>
          {/* Primary trend line */}
          <path d="M32,172 C88,162 138,138 188,108 S262,58 310,36"
            stroke="#D6003C" strokeWidth="2.2" />
          {/* Secondary comparison line */}
          <path d="M32,180 C95,172 148,154 200,128 S270,96 310,80"
            stroke="#8B0095" strokeWidth="1.4" strokeDasharray="6 3" />
          <g fill="#3D00D6">
            <circle cx="32"  cy="172" r="4" /><circle cx="113" cy="142" r="4" />
            <circle cx="188" cy="108" r="4" /><circle cx="252" cy="70"  r="4" />
            <circle cx="310" cy="36"  r="4" />
          </g>
          <g stroke="#3D00D6" strokeWidth="1" fill="rgba(61,0,214,0.05)">
            <rect x="52"  y="154" width="20" height="31" />
            <rect x="95"  y="132" width="20" height="53" />
            <rect x="138" y="106" width="20" height="79" />
            <rect x="181" y="78"  width="20" height="107" />
            <rect x="224" y="52"  width="20" height="133" />
            <rect x="267" y="30"  width="20" height="155" />
          </g>
        </motion.svg>

        {/* ── INDUSTRIES: Hexagonal node map ────────────────────────
            Float: 12px  Drift: 4px  Rotate: ±3.5°  Scale: 0.97–1.03
            Duration: 43s */}
        <motion.svg
          animate={{
            y: [0, -12, 0],
            x: [0, 4, 0],
            rotate: [0, 3.5, 0],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.055, 0.09, 0.055],
          }}
          transition={{ duration: 43, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          viewBox="0 0 310 275" fill="none"
          className="absolute"
          style={{ top: '61%', right: '2%', width: 245, height: 218 }}
        >
          <g stroke="#3D00D6" strokeWidth="1">
            <line x1="155" y1="28"  x2="248" y2="86"  />
            <line x1="248" y1="86"  x2="248" y2="182" />
            <line x1="248" y1="182" x2="155" y2="244" />
            <line x1="155" y1="244" x2="62"  y2="182" />
            <line x1="62"  y1="182" x2="62"  y2="86"  />
            <line x1="62"  y1="86"  x2="155" y2="28"  />
            <line x1="155" y1="28"  x2="155" y2="244" />
            <line x1="62"  y1="86"  x2="248" y2="182" />
            <line x1="248" y1="86"  x2="62"  y2="182" />
            <line x1="155" y1="28"  x2="62"  y2="182" strokeOpacity="0.28" strokeDasharray="4 4" />
          </g>
          <g fill="#D6003C">
            <circle cx="155" cy="28"  r="7" />
            <circle cx="248" cy="86"  r="5.5" />
            <circle cx="248" cy="182" r="5.5" />
            <circle cx="155" cy="244" r="7" />
            <circle cx="62"  cy="182" r="5.5" />
            <circle cx="62"  cy="86"  r="5.5" />
          </g>
          <circle cx="155" cy="136" r="10" fill="#8B0095" />
          <motion.circle cx="155" cy="136" r="18" stroke="#8B0095" strokeWidth="0.7" fill="none"
            animate={{ r:[14,26,14], opacity:[0.32,0,0.32] }}
            transition={{ duration:3.5, repeat:Infinity, ease:'easeOut' }}
          />
        </motion.svg>

        {/* ── TESTIMONIALS: Quotation marks ─────────────────────────
            Float: 9px  Drift: 7px  Rotate: ±2°  Scale: 0.98–1.02
            Duration: 33s */}
        <motion.svg
          animate={{
            y: [0, -9, 0],
            x: [0, 7, 0],
            rotate: [0, -2, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.055, 0.088, 0.055],
          }}
          transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          viewBox="0 0 280 185" fill="#3D00D6"
          className="absolute"
          style={{ top: '64%', left: '3%', width: 224, height: 148 }}
        >
          <path d="M16,106 L16,52 Q16,24 44,24 L62,24 L62,48 Q46,48 46,62 L46,106 Z" />
          <path d="M84,106 L84,52 Q84,24 112,24 L130,24 L130,48 Q114,48 114,62 L114,106 Z" />
          <path d="M166,122 L166,82 Q166,60 188,60 L204,60 L204,78 Q191,78 191,90 L191,122 Z"
            fill="#D6003C" fillOpacity="0.72" />
          <path d="M212,122 L212,82 Q212,60 234,60 L250,60 L250,78 Q237,78 237,90 L237,122 Z"
            fill="#D6003C" fillOpacity="0.72" />
          <circle cx="62"  cy="140" r="16" fill="none" stroke="#8B0095" strokeWidth="0.9" />
          <circle cx="220" cy="28"  r="11" fill="none" stroke="#8B0095" strokeWidth="0.8" />
        </motion.svg>

        {/* ── CONTACT: Paper airplane 1 ──────────────────────────────
            Float: 18px  Drift: 12px  Rotate: ±8°  Scale: 0.97–1.03
            Duration: 19s — paper airplanes are the "fastest floaters" */}
        <motion.svg
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
            rotate: [0, -8, 0],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.06, 0.10, 0.06],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          viewBox="0 0 240 200" fill="none"
          className="absolute"
          style={{ top: '81%', left: '4%', width: 185, height: 155 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M13,98 L226,28 L146,184 L108,116 Z" />
            <line x1="13"  y1="98"  x2="146" y2="184" />
            <line x1="108" y1="116" x2="226" y2="28"  />
          </g>
          <path d="M7,112 Q-18,127 -40,116" stroke="#D6003C" strokeWidth="1" strokeDasharray="5 4" />
        </motion.svg>

        {/* ── CONTACT: Paper airplane 2 — different phase ────────────
            Float: 14px  Drift: −9px  Rotate: ±6°  Scale: 0.98–1.02
            Duration: 25s */}
        <motion.svg
          animate={{
            y: [0, -14, 0],
            x: [0, -9, 0],
            rotate: [0, 6, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.05, 0.085, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
          viewBox="0 0 240 200" fill="none"
          className="absolute"
          style={{ top: '78%', right: '5%', width: 135, height: 115 }}
        >
          <g stroke="#8B0095" strokeWidth="1.3" strokeLinejoin="round">
            <path d="M13,98 L226,28 L146,184 L108,116 Z" />
            <line x1="13"  y1="98"  x2="146" y2="184" />
            <line x1="108" y1="116" x2="226" y2="28"  />
          </g>
        </motion.svg>

        {/* ── CONTACT: Chat bubbles ──────────────────────────────────
            Float: 8px  Drift: −5px  Rotate: ±1.5°  Scale: 0.99–1.01
            Duration: 39s */}
        <motion.svg
          animate={{
            y: [0, -8, 0],
            x: [0, -5, 0],
            rotate: [0, 1.5, 0],
            scale: [0.99, 1.01, 0.99],
            opacity: [0.05, 0.082, 0.05],
          }}
          transition={{ duration: 39, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          viewBox="0 0 320 205" fill="none"
          className="absolute"
          style={{ top: '84%', right: '3%', width: 250, height: 160 }}
        >
          <g stroke="#3D00D6" strokeWidth="1.1">
            <path d="M20,20 Q20,9 31,9 L188,9 Q199,9 199,20 L199,92 Q199,103 188,103 L104,103 L74,130 L80,103 L31,103 Q20,103 20,92 Z" />
            <path d="M118,70 Q118,60 128,60 L275,60 Q285,60 285,70 L285,122 Q285,132 275,132 L228,132 L222,149 L226,132 L128,132 Q118,132 118,122 Z"
              strokeOpacity="0.52" />
          </g>
          <g fill="#D6003C" fillOpacity="0.52">
            <circle cx="70"  cy="56" r="7.5" />
            <circle cx="110" cy="56" r="7.5" />
            <circle cx="150" cy="56" r="7.5" />
          </g>
        </motion.svg>

        {/* ── FOOTER: Constellation ──────────────────────────────────
            Float: 7px  Drift: none  Rotate: none  Opacity breathe
            Duration: 45s — slowest, serene */}
        <motion.svg
          animate={{
            y: [0, -7, 0],
            scale: [0.995, 1.005, 0.995],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          viewBox="0 0 1440 145" fill="none"
          className="absolute"
          style={{ top: '94%', left: 0, width: '100%', height: 145 }}
          preserveAspectRatio="none"
        >
          <g stroke="#3D00D6" strokeWidth="0.7" strokeOpacity="0.62">
            {CONST_LINES.map(([a, b], i) => (
              <line key={i}
                x1={STARS[a].x} y1={STARS[a].y}
                x2={STARS[b].x} y2={STARS[b].y}
              />
            ))}
          </g>
          <g fill="#D6003C">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={i % 5 === 0 ? 2.8 : 1.6} />
            ))}
          </g>
        </motion.svg>

        {/* ── EXTRA: Marketing growth arrows ────────────────────────
            Float: 10px  Drift: 6px  Rotate: ±2°  Scale: 0.98–1.02
            Duration: 22s */}
        <motion.svg
          animate={{
            y: [0, -10, 0],
            x: [0, 6, 0],
            rotate: [0, 2, 0],
            scale: [0.98, 1.02, 0.98],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          viewBox="0 0 220 175" fill="none"
          className="absolute"
          style={{ top: '34%', left: '46%', width: 165, height: 132 }}
        >
          <g stroke="#D6003C" strokeWidth="1.4" strokeLinejoin="round">
            <polyline points="18,148 62,88 116,108 176,42" />
            <polygon points="172,32 186,38 177,53" fill="#D6003C" fillOpacity="0.52" stroke="none" />
          </g>
          <g stroke="#3D00D6" strokeWidth="0.9" strokeDasharray="4 3" strokeOpacity="0.52">
            <polyline points="18,160 72,112 128,130 188,74" />
          </g>
          <line x1="18" y1="160" x2="18" y2="20" stroke="#3D00D6" strokeWidth="0.8" />
          <line x1="18" y1="160" x2="200" y2="160" stroke="#3D00D6" strokeWidth="0.8" />
        </motion.svg>

        {/* ── EXTRA: Geometric cube wireframe ───────────────────────
            Float: 8px  Drift: −8px  Rotate: ±4°  Scale: 0.97–1.03
            Duration: 35s */}
        <motion.svg
          animate={{
            y: [0, -8, 0],
            x: [0, -8, 0],
            rotate: [0, 4, 0],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.045, 0.075, 0.045],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
          viewBox="0 0 200 200" fill="none"
          className="absolute"
          style={{ top: '57%', right: '46%', width: 140, height: 140 }}
        >
          <g stroke="#8B0095" strokeWidth="1">
            <rect x="44" y="64" width="90" height="90" />
            <rect x="64" y="44" width="90" height="90" />
            <line x1="44"  y1="64"  x2="64"  y2="44"  />
            <line x1="134" y1="64"  x2="154" y2="44"  />
            <line x1="134" y1="154" x2="154" y2="134" />
            <line x1="44"  y1="154" x2="64"  y2="134" />
          </g>
          <circle cx="109" cy="109" r="22" stroke="#3D00D6" strokeWidth="0.7" strokeDasharray="3 3" />
        </motion.svg>

        {/* ── EXTRA: Signal wave lines ───────────────────────────────
            Float: 6px  Drift: 5px  Rotate: ±1°  Scale: 0.99–1.01
            Duration: 18s */}
        <motion.svg
          animate={{
            y: [0, -6, 0],
            x: [0, 5, 0],
            rotate: [0, 1, 0],
            scale: [0.99, 1.01, 0.99],
            opacity: [0.04, 0.065, 0.04],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 15 }}
          viewBox="0 0 400 110" fill="none"
          className="absolute"
          style={{ top: '36%', right: '19%', width: 260, height: 72 }}
        >
          <path d="M0,55 C50,18 100,92 150,55 S250,18 300,55 S350,92 400,55"
            stroke="#3D00D6" strokeWidth="1.2" />
          <path d="M0,72 C55,38 108,105 158,72 S258,38 308,72 S358,105 400,72"
            stroke="#D6003C" strokeWidth="0.9" strokeDasharray="6 4" />
          <path d="M0,38 C45,5 98,72 148,38 S248,5 298,38 S348,72 400,38"
            stroke="#8B0095" strokeWidth="0.7" strokeDasharray="3 5" />
        </motion.svg>

      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 3  — medium-fast parallax (~20px)
          Floating rings — small translucent circles
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="absolute inset-0" style={{ x: x3, y: y3 }}>

        {/* Rings */}
        {RINGS.map((r, i) => (
          <motion.div
            key={`ring-${i}`}
            animate={{
              y:       [0, -(r.s * 0.12), 0],
              rotate:  [0, r.rot, 0],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{ duration: r.dur, repeat: Infinity, ease: 'easeInOut', delay: r.delay }}
            className="absolute rounded-full"
            style={{
              top:   r.top,
              left:  'left'  in r ? r.left  : undefined,
              right: 'right' in r ? r.right : undefined,
              width: r.s, height: r.s,
              border: `1.5px solid ${r.c}`,
            }}
          />
        ))}

        {/* Curved ambient accent lines — breathe continuously */}
        <motion.svg
          animate={{ opacity:[0.038,0.065,0.038], y:[0,-8,0], x:[0,5,0] }}
          transition={{ duration:26, repeat:Infinity, ease:'easeInOut', delay:3 }}
          viewBox="0 0 480 230" fill="none"
          className="absolute"
          style={{ top:'32%', right:'20%', width:290, height:140 }}
        >
          <path d="M8,210 Q120,28 240,125 T472,55"  stroke="#3D00D6" strokeWidth="1" />
          <path d="M8,190 Q135,48 255,145 T472,75"  stroke="#8B0095" strokeWidth="0.8" strokeDasharray="7 5" />
          <path d="M8,228 Q108,60 228,158 T472,98"  stroke="#D6003C" strokeWidth="0.6" strokeDasharray="4 6" />
        </motion.svg>

        <motion.svg
          animate={{ opacity:[0.032,0.055,0.032], y:[0,9,0], x:[0,-4,0] }}
          transition={{ duration:34, repeat:Infinity, ease:'easeInOut', delay:19 }}
          viewBox="0 0 480 230" fill="none"
          className="absolute"
          style={{ top:'65%', left:'20%', width:290, height:140 }}
        >
          <path d="M8,38 Q95,195 240,96 T472,188"  stroke="#D6003C" strokeWidth="1" />
          <path d="M8,58 Q110,215 255,116 T472,208" stroke="#3D00D6" strokeWidth="0.8" strokeDasharray="6 5" />
        </motion.svg>

        {/* Full-page flowing wave overlay */}
        <motion.svg
          animate={{ opacity:[0.025,0.045,0.025] }}
          transition={{ duration:32, repeat:Infinity, ease:'easeInOut', delay:11 }}
          viewBox="0 0 1440 900" fill="none"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path d="M0,190 C290,108 580,272 870,190 S1260,108 1440,190" stroke="#3D00D6" strokeWidth="1.1" />
          <path d="M0,400 C310,318 620,478 860,400 S1240,318 1440,400" stroke="#8B0095" strokeWidth="0.95" />
          <path d="M0,610 C280,528 560,688 840,610 S1220,528 1440,610" stroke="#D6003C" strokeWidth="0.85" />
          <path d="M0,820 C260,738 520,858 780,820 S1220,738 1440,820" stroke="#3D00D6" strokeWidth="0.95" />
        </motion.svg>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 4  — fastest parallax (~30px)
          Sparkle dots + small micro-blobs — most kinetic layer
          ═══════════════════════════════════════════════════════════ */}
      <motion.div className="absolute inset-0" style={{ x: x4, y: y4 }}>

        {/* Sparkle dots */}
        {DOTS.map((dot, i) => (
          <motion.div
            key={`dot-${i}`}
            animate={{
              y:       [0, -10, 0],
              scale:   [1, 1.6, 1],
              opacity: [0.08, 0.24, 0.08],
            }}
            transition={{ duration: dot.dur, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
            className="absolute rounded-full"
            style={{ top: dot.top, left: dot.left, width: dot.sz, height: dot.sz, background: dot.c }}
          />
        ))}

        {/* Micro floating blobs — small, fast, colour varied */}
        {[
          { top:'16%', left:'60%', c:'rgba(214,0,60,0.65)',  sz:80,  dur:17, d:2  },
          { top:'31%', left:'18%', c:'rgba(61,0,214,0.65)',  sz:70,  dur:23, d:7  },
          { top:'48%', left:'70%', c:'rgba(139,0,149,0.65)', sz:90,  dur:20, d:4  },
          { top:'62%', left:'32%', c:'rgba(214,0,60,0.60)',  sz:65,  dur:28, d:10 },
          { top:'79%', left:'65%', c:'rgba(61,0,214,0.60)',  sz:75,  dur:15, d:1  },
          { top:'90%', left:'24%', c:'rgba(139,0,149,0.60)', sz:85,  dur:24, d:6  },
        ].map((b, i) => (
          <motion.div
            key={`mblob-${i}`}
            animate={{
              y:       [0, -(b.sz * 0.20), 0],
              x:       [0, i % 2 === 0 ? 9 : -9, 0],
              scale:   [1, 1.11, 1],
              opacity: [0.048, 0.082, 0.048],
            }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
            className="absolute rounded-full"
            style={{ top: b.top, left: b.left, width: b.sz, height: b.sz,
              background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
              filter: 'blur(20px)' }}
          />
        ))}

      </motion.div>

    </div>
  )
}
