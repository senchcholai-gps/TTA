'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import ServicesMegaMenu from '@/components/ServicesMegaMenu'
import { serviceCategories } from '@/lib/services-data'

/* ─────────────────────────────────────────────────────────────
   Mobile Services Accordion
   A single collapsible row for "Services" that lists all
   service category names. Collapsed by default.
───────────────────────────────────────────────────────────── */

interface MobileServicesAccordionProps {
  onClose: () => void
}

function MobileServicesAccordion({ onClose }: MobileServicesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="border-b border-gray-50">
      {/* Services trigger row */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between min-h-[48px] px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors focus:outline-none cursor-pointer"
      >
        <span>Services</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-neutral-black/40 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-brand-red' : ''
          }`}
        />
      </button>

      {/* Smooth accordion panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { height: 'auto', opacity: 1 }
                : { height: 'auto', opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } }
            }
            exit={
              shouldReduceMotion
                ? { height: 0, opacity: 0 }
                : { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
            }
            style={{ overflow: 'hidden' }}
          >
            <ul className="pb-2 pl-3 pr-1 space-y-0.5 bg-slate-50/60 rounded-xl mb-1">
              {serviceCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <li key={cat.id}>
                    <a
                      href="#services"
                      onClick={onClose}
                      className="flex items-center gap-3 min-h-[44px] px-2 py-2 rounded-lg text-sm text-neutral-black/75 hover:text-brand-purple hover:bg-white/80 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={13} strokeWidth={2} className="text-neutral-black/50" />
                      </span>
                      <span className="text-[13px] font-medium">{cat.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Header
───────────────────────────────────────────────────────────── */

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()

  // Track scroll depth to enhance backdrop-blur + shadow on scroll
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isPast = window.scrollY > 24
          setScrolled((prev) => (prev !== isPast ? isPast : prev))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Lock body scrolling when mobile menu is open
  // Use position:fixed trick (iOS Safari safe) instead of overflow:hidden
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    } else {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      if (top) {
        window.scrollTo(0, -parseInt(top || '0', 10))
      }
    }
    return () => {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    closeMenu()
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.80)',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px) saturate(140%)',
        boxShadow: scrolled
          ? '0 1px 24px 0 rgba(26,26,26,0.08)'
          : '0 1px 0 0 rgba(0,0,0,0.04)',
        transition: shouldReduceMotion
          ? 'none'
          : 'background-color 250ms ease-out, backdrop-filter 250ms ease-out, box-shadow 250ms ease-out',
      }}
    >
      {/* ── Header bar ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/TTA_Logo_Landscape.png"
            alt="The Three Amigos"
            className="h-[54px] md:h-[63px] w-auto object-contain"
          />
        </a>

        {/* Desktop + Tablet nav (md: = 768px+) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 flex-1 justify-end">
          {[
            { label: 'Home',        id: 'home',         href: '/#home'         },
            { label: 'About Us',    id: 'about',        href: '/#about'        },
            { label: 'Portfolio',   id: 'portfolio',    href: '/#portfolio'    },
            { label: 'Case Studies',id: 'case-studies', href: '/#case-studies' },
            { label: 'Pricing',     id: 'pricing',      href: '/#pricing'      },
          ].map(({ label, id, href }) => (
            <a
              key={id}
              href={href}
              onClick={(e) => handleNavClick(e, id)}
              className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300 whitespace-nowrap hidden lg:block"
            >
              {label}
            </a>
          ))}

          {/* Tablet-only condensed links (768–1023px) */}
          <a
            href="/#portfolio"
            onClick={(e) => handleNavClick(e, 'portfolio')}
            className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300 whitespace-nowrap lg:hidden"
          >
            Portfolio
          </a>
          <a
            href="/#pricing"
            onClick={(e) => handleNavClick(e, 'pricing')}
            className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300 whitespace-nowrap lg:hidden"
          >
            Pricing
          </a>

          <ServicesMegaMenu />

          <a
            href="/blog"
            className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300 whitespace-nowrap"
          >
            Blog
          </a>

          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="px-5 py-2 bg-brand-gradient text-white rounded-lg text-sm font-semibold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center whitespace-nowrap flex-shrink-0"
            style={{
              transition: shouldReduceMotion
                ? 'none'
                : 'transform 250ms cubic-bezier(0.25,1,0.5,1), box-shadow 250ms cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            Contact
          </a>
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-neutral-black focus:outline-none w-12 h-12 flex items-center justify-center cursor-pointer flex-shrink-0"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

    </header>

      {/* ── Mobile Drawer — rendered OUTSIDE <header> to avoid sticky/fixed stacking context issues ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 z-40 bg-black/20 md:hidden"
              aria-hidden="true"
              onClick={closeMenu}
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0, y: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="fixed top-20 left-0 right-0 bottom-0 z-50 md:hidden bg-white border-t border-gray-100 overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="px-4 pt-2 pb-8">

                <a
                  href="/#home"
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Home
                </a>

                <a
                  href="/#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  About
                </a>

                <MobileServicesAccordion onClose={closeMenu} />

                <a
                  href="/#industries"
                  onClick={(e) => handleNavClick(e, 'industries')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Industries
                </a>

                <a
                  href="/#portfolio"
                  onClick={(e) => handleNavClick(e, 'portfolio')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Portfolio
                </a>

                <a
                  href="/#case-studies"
                  onClick={(e) => handleNavClick(e, 'case-studies')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Case Studies
                </a>

                <a
                  href="/#process"
                  onClick={(e) => handleNavClick(e, 'process')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Our Process
                </a>

                <a
                  href="/#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Pricing
                </a>

                <a
                  href="/blog"
                  onClick={closeMenu}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  Blog
                </a>

                <a
                  href="/#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="flex items-center min-h-[52px] px-2 text-[15px] font-semibold text-neutral-black hover:text-brand-red transition-colors border-b border-gray-100"
                >
                  FAQ
                </a>

                <div className="pt-4">
                  <a
                    href="/#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="flex items-center justify-center w-full min-h-[52px] px-6 py-3 bg-brand-gradient text-white rounded-xl text-[15px] font-semibold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] transition-all duration-300"
                  >
                    Get Free Audit
                  </a>
                </div>

              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
