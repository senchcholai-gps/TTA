'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Video, Search, Mail, Award, Check } from 'lucide-react'

/* ── Instagram SVG icon ──────────────────────────────────────── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

/* ── Glowing traveling particle ───────────────────────────────── */
function PathParticle({ pathId, delay, color }: { pathId: string; delay: number; color: string }) {
  return (
    <motion.circle
      r="4"
      fill={color}
      filter="url(#particleGlow)"
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 3.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: 'easeInOut' as const,
      }}
      style={{ offsetPath: `path("${pathId}")`, offsetRotate: '0deg' }}
    />
  )
}

/* ── Cycling status text ──────────────────────────────────────── */
const workflowSteps = [
  '✓ Strategy Powered by AI',
  '✓ Content That Converts',
  '✓ Campaigns That Perform',
  '✓ Analytics That Drive Growth',
  '✓ Automation That Scales',
]

function CyclingStatus() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % workflowSteps.length), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="h-6 relative overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="absolute text-[9.5px] font-extrabold text-brand-purple tracking-wide text-center whitespace-nowrap"
        >
          {workflowSteps[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

interface ServiceCard {
  title: string
  items: string[]
  icon: React.ReactNode
  bgColor: string
}

const services: ServiceCard[] = [
  {
    title: 'AI Marketing\nSolutions',
    items: ['AI Strategy', 'AI Automation', 'Lead Generation'],
    icon: <Sparkles size={14} className="text-white" />,
    bgColor: 'bg-brand-purple',
  },
  {
    title: 'Social Media\nMarketing',
    items: ['Instagram', 'Facebook', 'YouTube'],
    icon: <InstagramIcon />,
    bgColor: 'bg-pink-500',
  },
  {
    title: 'Performance\nMarketing',
    items: ['Google Ads', 'Meta Ads', 'YouTube Ads'],
    icon: <Search size={14} className="text-white" />,
    bgColor: 'bg-brand-red',
  },
  {
    title: 'Content\nProduction',
    items: ['Camera Shoots', 'Reels', 'Video Editing'],
    icon: <Video size={14} className="text-white" />,
    bgColor: 'bg-indigo-500',
  },
  {
    title: 'Email\nMarketing',
    items: ['Email Campaigns', 'Automation', 'Lead Nurturing'],
    icon: <Mail size={14} className="text-white" />,
    bgColor: 'bg-emerald-500',
  },
  {
    title: 'Influencer\nMarketing',
    items: ['Creator Outreach', 'UGC Content', 'Brand Collaborations'],
    icon: <Award size={14} className="text-white" />,
    bgColor: 'bg-blue-600',
  },
]

// Card positions calculated for 450px container height
// Vertical: 3 rows with 20px gaps, ~120px card height → rows at ~4%, ~31%, ~58%
// Horizontal: 52px gap from center card edges
const positions = [
  { left: '3%',   top: '4%'   },  // Top Left
  { right: '3%',  top: '4%'   },  // Top Right
  { left: '3%',   top: '34%'  },  // Middle Left
  { right: '3%',  top: '34%'  },  // Middle Right
  { left: '3%',   top: '64%'  },  // Bottom Left
  { right: '3%',  top: '64%'  },  // Bottom Right
]

// SVG connection paths (viewBox 800x450)
const connectionPaths = [
  'M 200,65 Q 250,120 290,148',    // TL
  'M 600,65 Q 550,120 510,148',    // TR
  'M 200,200 L 290,225',           // ML
  'M 600,200 L 510,225',           // MR
  'M 200,340 Q 250,310 290,295',   // BL
  'M 600,340 Q 550,310 510,295',   // BR
]

const particleColors = [
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#D6003C', // red
  '#6366F1', // indigo
  '#10B981', // emerald
  '#2563EB', // blue
]

const slideDirections = [
  { x: -15, y: -10 },
  { x: 15,  y: -10 },
  { x: -20, y: 0   },
  { x: 20,  y: 0   },
  { x: -15, y: 10  },
  { x: 15,  y: 10  },
]

export default function HeroBrowserShowcase() {
  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden select-none font-inter text-neutral-black">

      {/* ── Subtle dot pattern ─────────────────────────────── */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* ── Subtle Floating Glow Particles ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {[
          { color: 'bg-brand-purple/20', top: '20%', left: '15%', size: 'w-2 h-2', delay: 0 },
          { color: 'bg-brand-magenta/20', top: '75%', left: '22%', size: 'w-2 h-2', delay: 1.5 },
          { color: 'bg-blue-500/20', top: '30%', right: '20%', size: 'w-2 h-2', delay: 0.8 },
          { color: 'bg-brand-purple/20', top: '80%', right: '15%', size: 'w-2 h-2', delay: 2.2 },
        ].map((pt, i) => (
          <motion.div
            key={i}
            className={`absolute ${pt.size} rounded-full ${pt.color} blur-[1px]`}
            style={{ top: pt.top, left: (pt as any).left, right: (pt as any).right }}
            animate={{
              y: [0, -12, 0],
              x: [0, 8, -8, 0],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: pt.delay
            }}
          />
        ))}
      </div>

      {/* ── SVG Connections (Solid Gradient Lines) ─────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D6003C" stopOpacity="0.55" />
          </linearGradient>
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connectionPaths.map((d, i) => (
          <motion.path
            key={`conn-${i}`}
            d={d}
            fill="none"
            stroke="url(#connGrad)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 + i * 0.12, ease: 'easeOut' as const }}
          />
        ))}
      </svg>

      {/* ── Traveling Glow Particles ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
          {connectionPaths.map((d, i) => (
            <PathParticle key={`particle-${i}`} pathId={d} delay={3.0 + i * 0.5} color={particleColors[i]} />
          ))}
        </svg>
      </div>

      {/* ── Center AI Marketing Engine Card ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' as const }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] w-[220px]"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-5">
          {/* Logo & Spacing */}
          <div className="flex flex-col items-center mb-3.5">
            <img src="/TTA_Logo_Landscape.png" alt="The Three Amigos" className="h-9 object-contain" />
            <span className="text-[7.5px] font-black text-brand-purple uppercase tracking-[0.22em] mt-2">
              AI Marketing Engine
            </span>
          </div>

          <div className="w-full h-[1px] bg-gray-100/80 mb-3.5" />

          {/* High Contrast Checklist */}
          <div className="space-y-2 mb-3.5">
            {[
              'Strategy Powered by AI',
              'Content That Converts',
              'Campaigns That Perform',
              'Analytics That Drive Growth',
              'Automation That Scales',
            ].map((txt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.08, duration: 0.4, ease: 'easeOut' as const }}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-brand-purple/15 flex items-center justify-center flex-shrink-0">
                  <Check size={9} strokeWidth={3} className="text-brand-purple" />
                </div>
                <span className="text-[8.5px] font-bold text-neutral-black whitespace-nowrap">{txt}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-full h-[1px] bg-gray-100/80 mb-3.5" />

          {/* Status Display */}
          <CyclingStatus />
        </div>

        {/* Ambient Glow ring behind Center Card */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute -inset-4 rounded-3xl bg-brand-purple/10 -z-10 blur-md pointer-events-none"
        />
      </motion.div>

      {/* ── Floating Service Cards ──────────────────────────── */}
      {services.map((svc, i) => {
        const pos = positions[i]
        const slide = slideDirections[i]
        const entranceDelay = 1.2 + i * 0.15

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: entranceDelay, ease: 'easeOut' as const }}
            className="absolute z-[4] w-[175px]"
            style={{
              left: pos.left,
              right: (pos as any).right,
              top: pos.top,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/40 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:bg-white/95 transition-colors duration-300">
                {/* Icon + Title */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className={`w-7 h-7 rounded-lg ${svc.bgColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {svc.icon}
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-neutral-black leading-tight whitespace-pre-line">
                    {svc.title}
                  </span>
                </div>
                {/* Bullet items */}
                <ul className="space-y-1 pl-1">
                  {svc.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-[8.5px] text-neutral-black/75 font-semibold whitespace-nowrap">
                      <span className="w-1 h-1 rounded-full bg-neutral-black/30 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Soft glow pulse behind service card */}
              <motion.div
                animate={{ opacity: [0, 0.12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' as const }}
                className={`absolute -inset-2 rounded-2xl ${svc.bgColor}/10 -z-10 blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
