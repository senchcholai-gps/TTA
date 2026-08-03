'use client'

import React from 'react'
import ClientLogo from '@/components/ui/ClientLogo'

export interface MarqueeItem {
  name: string
  logo: string
  maxWidth?: string
  maxHeight?: string
  scale?: number
  opacity?: number
  brightness?: number
  contrast?: number
  grayscale?: boolean
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[]
  isLogoMode?: boolean
  speed?: number
}

export default function InfiniteMarquee({ items, isLogoMode = false, speed = 40 }: InfiniteMarqueeProps) {
  if (!items || items.length === 0) return null

  // Duplicate items array 4x (2 identical pairs of full sets) to guarantee sub-pixel seamless infinite loop
  // across all screens (mobile, tablet, desktop, 4K) with translateX(0%) -> translateX(-50%)
  const quadItems = [...items, ...items, ...items, ...items]

  // Calculate dynamic duration in 35-45s range based on items count if default speed is provided
  const dynamicDuration = speed || Math.max(35, Math.min(45, Math.round(items.length * 3.5)))

  return (
    <div
      className="relative w-full overflow-hidden py-4 select-none bg-transparent"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max will-change-transform"
        style={{
          animation: `hero-marquee-loop ${dynamicDuration}s linear infinite`,
        }}
      >
        {quadItems.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="flex-shrink-0">
            {isLogoMode ? (
              <ClientLogo
                logo={item.logo}
                name={item.name}
                mode="marquee"
                maxWidth={item.maxWidth}
                maxHeight={item.maxHeight}
                scale={item.scale}
                opacity={item.opacity}
                brightness={item.brightness}
                contrast={item.contrast}
                grayscale={item.grayscale}
              />
            ) : (
              <div className="px-3">
                <ClientLogo logo={item.logo} name={item.name} mode="card" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
