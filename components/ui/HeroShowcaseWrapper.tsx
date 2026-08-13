'use client'

/**
 * HeroShowcaseWrapper
 * -------------------
 * Wraps the 800×450 HeroBrowserShowcase so it scales perfectly to any
 * viewport width without ever cropping a single pixel of the animation.
 *
 * Strategy
 * --------
 * 1. The outer div takes 100% of its parent column width and preserves a
 *    16:9-ish aspect ratio (800/450 = 16/9) so it always has the right height.
 * 2. A ResizeObserver tracks the outer div's pixel width in real time.
 * 3. We compute  scale = containerWidth / 800  and apply it as a CSS
 *    transform on the inner 800×450 div, anchored at top-left, so the
 *    showcase always fills the container exactly without cropping.
 * 4. At ≥1280 px (desktop) the container reaches its natural width and
 *    scale ≈ 1, so the desktop view is pixel-identical to the original.
 */

import { useRef, useEffect, useState, memo } from 'react'
import HeroBrowserShowcase from '@/components/ui/HeroBrowserShowcase'

const DESIGN_W = 800
const DESIGN_H = 430

const HeroShowcaseWrapper = memo(function HeroShowcaseWrapper() {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!outerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          setScale(w / DESIGN_W)
        }
      }
    })

    observer.observe(outerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    /* Outer shell: matches the aspect ratio of the design canvas so the
       column height is always correct; no overflow visible here. */
    <div
      ref={outerRef}
      className="w-full relative rounded-3xl border-0 shadow-2xl bg-white/5 backdrop-blur-md overflow-hidden"
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
    >
      {/* Inner canvas: always 800×450, scaled down from top-left to fill outer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${DESIGN_W}px`,
          height: '450px',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        <HeroBrowserShowcase />
      </div>
    </div>
  )
})

export default HeroShowcaseWrapper
