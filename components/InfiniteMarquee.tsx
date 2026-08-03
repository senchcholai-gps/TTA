'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MarqueeItem {
  name: string
  logo: string
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[]
  isLogoMode?: boolean
  speed?: number
}

export default function InfiniteMarquee({ items, isLogoMode = false, speed = 30 }: InfiniteMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items]
  
  // Calculate total width for animation
  const itemWidth = isLogoMode ? 180 : 200
  const totalWidth = items.length * itemWidth
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Fade gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          x: prefersReducedMotion ? 0 : isHovered ? 0 : [-totalWidth, 0],
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : speed,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <motion.div
            key={`${item.name}-${idx}`}
            className={`flex-shrink-0 ${isLogoMode ? 'w-44' : 'w-48'}`}
            whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {isLogoMode ? (
              // Transparent logo display without cards
              <div className="h-16 flex items-center justify-center p-2 group transition">
                <motion.img
                  src={item.logo}
                  alt={item.name}
                  className="h-12 w-32 object-contain opacity-100 transition-all duration-300"
                  whileHover={!prefersReducedMotion ? { scale: 1.08 } : undefined}
                  transition={{ duration: 0.2 }}
                />
              </div>
            ) : (
              // Industry card with glass effect
              <div className="h-32 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl border border-white/30 border-opacity-40 p-6 flex flex-col items-center justify-center group hover:border-brand-purple/40 hover:shadow-lg hover:bg-white/90 transition-all">
                <motion.img
                  src={item.logo}
                  alt={item.name}
                  className="h-12 w-24 object-contain mb-2"
                  whileHover={!prefersReducedMotion ? { scale: 1.1 } : undefined}
                />
                <p className="text-xs text-center text-neutral-black/85 font-medium">{item.name}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
