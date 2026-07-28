'use client'

import React, { useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function FloatingWhatsApp() {
  const shouldReduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-[9998] flex items-center gap-3">
      {/* Target Link */}
      <a
        href="https://wa.me/918526462969"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
      >
        {/* Pulsing ring */}
        {!shouldReduceMotion && (
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        )}

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-white flex-shrink-0"
          aria-hidden="true"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M12.03 2c-5.52 0-10 4.48-10 10a9.96 9.96 0 001.39 5.08L2 22.03l5.13-1.33a9.94 9.94 0 004.9 1.3c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.96 14.18c-.27.76-1.34 1.4-1.85 1.5-.47.1-1.07.13-3.06-.69-2.54-1.05-4.17-3.63-4.3-3.8-.13-.17-1.04-1.38-1.04-2.63 0-1.25.65-1.86.88-2.1.23-.25.5-.3.67-.3.17 0 .34 0 .49.01.16.01.37-.06.58.45.22.53.76 1.85.83 1.99.07.14.12.3.02.49-.1.2-.15.32-.3.49-.15.17-.3.38-.45.5-.16.14-.33.3-.14.62.19.32.84 1.38 1.8 2.24.96.86 1.77 1.13 2.02 1.25.26.12.4.09.56-.08.15-.17.66-.77.84-1.03.18-.27.36-.22.61-.13.25.09 1.58.75 1.85.88.27.13.45.2.52.32.07.12.07.7-.2 1.46z" />
        </svg>
      </a>

      {/* Tooltip to the right */}
      {hovered && (
        <div
          role="tooltip"
          className="bg-neutral-black text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md border border-white/15 animate-fade-in pointer-events-none"
        >
          Chat with us
        </div>
      )}
    </div>
  )
}
