'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ClientLogoProps {
  logo?: string
  name?: string
  mode: 'marquee' | 'avatar' | 'testimonial' | 'card'
  className?: string
  imgPaddingClass?: string
  // Individual optical normalization props
  maxWidth?: string
  maxHeight?: string
  scale?: number
  opacity?: number
  brightness?: number
  contrast?: number
  grayscale?: boolean
}

// Optical balancing helper to identify square or circle shapes
export function isSquareOrCircle(name: string, url: string): boolean {
  const lowerName = name.toLowerCase()
  const lowerUrl = url.toLowerCase()
  return (
    lowerName.includes('chicken') ||
    lowerName.includes('aara') ||
    lowerName.includes('bhakthi') ||
    lowerName.includes('infinity') ||
    lowerName.includes('jashmi') ||
    lowerName.includes('investment') ||
    lowerName.includes('yellow') ||
    lowerName.includes('owl') ||
    lowerUrl.includes('logo%20alone') ||
    lowerUrl.includes('logo_alone') ||
    lowerUrl.includes('bhakthi') ||
    lowerUrl.includes('jashmi') ||
    lowerUrl.includes('chicken') ||
    lowerUrl.includes('yellow')
  )
}

export default function ClientLogo({
  logo,
  name,
  mode,
  className = '',
  imgPaddingClass = '',
  maxWidth,
  maxHeight,
  scale,
  opacity,
  brightness,
  contrast,
  grayscale = false
}: ClientLogoProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'FD'

  // Standardize the check for intentionally unavailable logos (e.g. Finance with DSM)
  const isUnavailable = !logo || logo === 'DSM' || logo.includes('finance_dsm_logo')

  if (isUnavailable) {
    const shapeClass = (mode === 'marquee' || mode === 'card') ? 'rounded-xl' : 'rounded-full'
    const sizeClasses = className || (mode === 'testimonial' ? 'w-11 h-11 text-xs' : 'w-12 h-12 text-[11px]')
    return (
      <div className={`${sizeClasses} ${shapeClass} bg-gradient-to-br from-brand-purple to-blue-500 flex items-center justify-center flex-shrink-0 text-white font-black select-none border border-gray-200/80 shadow-xs`}>
        {initials}
      </div>
    )
  }

  // Detect logo geometry for optical balancing
  const isSquare = (name && logo) ? isSquareOrCircle(name, logo) : false

  // 1. Hero Marquee Mode
  if (mode === 'marquee') {
    const itemOpacity = opacity ?? 0.95
    const itemScale = scale ?? 1.0
    const itemContrast = contrast ?? 1.0
    const itemBrightness = brightness ?? 1.0
    const itemMaxHeight = maxHeight ?? (isSquare ? '44px' : '36px')
    const itemMaxWidth = maxWidth ?? (isSquare ? '140px' : '160px')
    const filterStyle = grayscale
      ? `grayscale(100%) contrast(${itemContrast}) brightness(${itemBrightness})`
      : `contrast(${itemContrast}) brightness(${itemBrightness})`

    // Calculate optical scale expansion/inset offset so visual edge-to-edge gap is mathematically identical
    const numMaxWidth = parseFloat(itemMaxWidth) || 140
    const scaleOffsetPx = Math.round(((itemScale - 1) * numMaxWidth) / 2)

    return (
      <div
        className="flex-shrink-0 flex items-center justify-center h-14 sm:h-16 md:h-18 select-none group"
        style={{
          paddingLeft: `calc(var(--marquee-gap-half, 1.5rem) + ${scaleOffsetPx}px)`,
          paddingRight: `calc(var(--marquee-gap-half, 1.5rem) + ${scaleOffsetPx}px)`,
        }}
      >
        <div
          className="flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            transform: `scale(${itemScale})`,
          }}
        >
          <img
            src={logo}
            alt={name || 'Client logo'}
            className="w-auto object-contain object-center group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300 ease-out"
            style={{
              maxHeight: itemMaxHeight,
              maxWidth: itemMaxWidth,
              opacity: itemOpacity,
              filter: filterStyle,
            }}
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  // 2. Glass Card Mode
  if (mode === 'card') {
    const padding = isSquare ? 'p-3' : 'p-1'
    return (
      <div className="h-32 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl border border-white/30 border-opacity-40 p-6 flex flex-col items-center justify-center group hover:border-brand-purple/40 hover:shadow-lg hover:bg-white/90 transition-all">
        <div className="h-12 w-24 flex items-center justify-center">
          <motion.img
            src={logo}
            alt={name}
            className={`w-full h-full object-contain object-center ${padding}`}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.2 }}
            loading="lazy"
          />
        </div>
        <p className="text-xs text-center text-neutral-black/85 font-medium mt-2">{name}</p>
      </div>
    )
  }

  // 3. Testimonial Row Mode
  if (mode === 'testimonial') {
    const size = className || 'w-11 h-11'
    const padding = imgPaddingClass || (isSquare ? 'p-2.5' : 'p-1.5')
    return (
      <div className={`${size} rounded-full overflow-hidden border border-gray-200/80 bg-white shadow-xs flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <img
          src={logo}
          alt={name}
          className={`w-full h-full object-contain ${padding} object-center`}
          loading="lazy"
        />
      </div>
    )
  }

  // 4. Avatar Mode (Portfolio, Grids, Detail Pages)
  const size = className || 'w-12 h-12 text-[11px]'
  const padding = imgPaddingClass || (isSquare ? 'p-3.5' : 'p-2')
  return (
    <div className={`${size} rounded-full border border-gray-200 bg-white flex items-center justify-center ${padding} flex-shrink-0 transition-all duration-300 hover:scale-105 shadow-xs`}>
      <img
        src={logo}
        alt={name}
        className="w-full h-full object-contain object-center"
        loading="lazy"
      />
    </div>
  )
}
