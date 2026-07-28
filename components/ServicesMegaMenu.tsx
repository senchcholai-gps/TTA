'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  useId,
} from 'react'
import { motion, AnimatePresence, useReducedMotion, Transition } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { serviceCategories, ServiceCategory } from '@/lib/services-data'

/* ─────────────────────────────────────────────
   Desktop Mega Menu — Categories only
   (no right-panel service list)
───────────────────────────────────────────── */

function DesktopMegaMenu() {
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(serviceCategories[0])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const menuId = useId()

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }, [])

  const scheduleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 120)
  }, [])

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  const handleTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  const menuTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: 'easeOut' }

  const itemTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: 'easeOut' }

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
    >
      {/* Trigger button */}
      <button
        id={triggerId}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onKeyDown={handleTriggerKey}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-200 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 focus-visible:rounded-md"
      >
        Services
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-300 will-change-transform ${
            isOpen ? 'rotate-180 text-brand-red' : 'text-neutral-black/50'
          }`}
        />
      </button>

      {/* Dropdown Panel — Categories only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="region"
            aria-label="Services menu"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: menuTransition }}
            exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: shouldReduceMotion ? 0 : 0.15, ease: 'easeIn' } }}
            style={{ willChange: 'transform, opacity' }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[520px] z-[9999] rounded-2xl overflow-hidden
              shadow-[0_20px_50px_-8px_rgba(0,0,0,0.15),0_6px_20px_-4px_rgba(61,0,214,0.08)]
              border border-white/60
              backdrop-blur-2xl
              bg-white/95"
          >
            {/* Header label */}
            <div className="px-5 pt-4 pb-2">
              <span className="text-[10px] font-bold tracking-widest text-neutral-black/35 uppercase select-none">
                What we do
              </span>
            </div>

            {/* Category grid — 2 columns */}
            <nav
              aria-label="Service categories"
              className="grid grid-cols-2 gap-1.5 px-3 pb-3"
            >
              {serviceCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory.id === cat.id
                return (
                  <motion.a
                    key={cat.id}
                    href="#services"
                    onMouseEnter={() => setActiveCategory(cat)}
                    onClick={() => setIsOpen(false)}
                    whileHover={shouldReduceMotion ? {} : { x: 2 }}
                    transition={itemTransition}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 group
                      ${isActive
                        ? 'bg-gradient-to-r from-brand-red/6 to-brand-purple/6 border border-brand-purple/15'
                        : 'border border-transparent hover:bg-slate-50/80 hover:border-gray-100'
                      }`}
                  >
                    {/* Icon bubble */}
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-br from-brand-red/15 to-brand-purple/20 text-brand-purple shadow-sm'
                          : 'bg-gray-100/80 text-neutral-black/45 group-hover:bg-brand-purple/10 group-hover:text-brand-purple'
                      }`}
                      aria-hidden="true"
                    >
                      <Icon size={16} strokeWidth={2} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[12px] font-semibold leading-tight transition-colors ${
                          isActive
                            ? 'text-brand-purple'
                            : 'text-neutral-black group-hover:text-brand-purple'
                        }`}
                      >
                        {cat.title}
                      </div>
                      <div className="text-[10px] text-neutral-black/45 mt-0.5 leading-snug font-normal line-clamp-1">
                        {cat.description.split(',')[0]}
                      </div>
                    </div>

                    {/* Active accent dot */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gradient flex-shrink-0 mt-1.5" aria-hidden="true" />
                    )}
                  </motion.a>
                )
              })}
            </nav>

            {/* Footer CTA */}
            <div className="px-5 py-3 border-t border-gray-100/80 bg-slate-50/50 flex items-center justify-between">
              <p className="text-[10px] text-neutral-black/40">
                {serviceCategories.length} specialised service areas
              </p>
              <a
                href="#pricing"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-purple hover:text-brand-red transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 focus-visible:rounded-md"
              >
                View Plans
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Mobile Accordion Services Menu
───────────────────────────────────────────── */

interface MobileAccordionProps {
  onClose: () => void
}

function MobileAccordion({ onClose }: MobileAccordionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggle = (id: string) =>
    setOpenCategory((prev) => (prev === id ? null : id))

  const accordionTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: 'easeOut' }

  return (
    <div className="mt-1">
      <span className="block mb-2 text-[10px] font-bold tracking-widest text-neutral-black/35 uppercase px-1">
        Services
      </span>
      <div className="space-y-1">
        {serviceCategories.map((cat) => {
          const Icon = cat.icon
          const isOpen = openCategory === cat.id
          return (
            <div key={cat.id} className="rounded-xl overflow-hidden border border-gray-100">
              <button
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen ? 'bg-brand-purple/10 text-brand-purple' : 'bg-gray-100 text-neutral-black/50'
                }`}>
                  <Icon size={15} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className={`text-[13px] font-semibold flex-1 ${isOpen ? 'text-brand-purple' : 'text-neutral-black'}`}>
                  {cat.title}
                </span>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`text-neutral-black/40 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-purple' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transition: accordionTransition }}
                    exit={{ height: 0, opacity: 0, transition: { duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeIn' } }}
                    style={{ overflow: 'hidden', willChange: 'height, opacity' }}
                  >
                    <ul className="px-4 pb-3 pt-1 space-y-1 bg-slate-50/60" role="list">
                      {cat.services.map((service, i) => (
                        <li key={i}>
                          <a
                            href="#services"
                            onClick={onClose}
                            className="flex items-start gap-2 py-1.5 px-1 rounded-lg hover:text-brand-purple transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 group"
                          >
                            <span
                              className="mt-[5px] w-[4px] h-[4px] rounded-full bg-brand-gradient flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-[12px] text-neutral-black/70 group-hover:text-brand-purple transition-colors">
                              {service}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Exports
───────────────────────────────────────────── */

export { DesktopMegaMenu, MobileAccordion }

/**
 * Default export: the desktop-only trigger.
 * Used in the header's hidden md:flex nav.
 */
export default DesktopMegaMenu
