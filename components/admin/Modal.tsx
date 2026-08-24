'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = target
    const delta = e.deltaY

    const isScrollingDown = delta > 0
    const isScrollingUp = delta < 0

    const canScrollDown = isScrollingDown && scrollTop + clientHeight < scrollHeight - 1
    const canScrollUp = isScrollingUp && scrollTop > 0

    if (canScrollDown || canScrollUp) {
      e.stopPropagation()
      target.scrollTop += delta
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            className={`relative z-10 bg-white rounded-3xl border border-gray-200 shadow-2xl w-full ${maxWidth} max-h-[85vh] flex flex-col overflow-hidden text-neutral-black`}
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-gray-150 flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-lg font-black text-neutral-black">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-black/40 hover:text-neutral-black p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Content Container */}
            <div
              ref={contentRef}
              onWheel={handleWheel}
              className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4 min-h-0 text-xs pointer-events-auto touch-pan-y"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
