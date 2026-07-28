'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import ServicesMegaMenu, { MobileAccordion } from '@/components/ServicesMegaMenu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Track scroll depth to enhance backdrop-blur + shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-100"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(8px) saturate(140%)',
        boxShadow: scrolled
          ? '0 1px 24px 0 rgba(26,26,26,0.08)'
          : '0 1px 0 0 rgba(0,0,0,0.04)',
        transition: shouldReduceMotion
          ? 'none'
          : 'background-color 350ms cubic-bezier(0.25,1,0.5,1), backdrop-filter 350ms cubic-bezier(0.25,1,0.5,1), box-shadow 350ms cubic-bezier(0.25,1,0.5,1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/TTA_Logo_Landscape.png" alt="The Three Amigos" className="h-10 w-auto object-contain" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home',        id: 'home',        href: '/#home'        },
            { label: 'About Us',    id: 'about',       href: '/#about'       },
            { label: 'Portfolio',   id: 'portfolio',   href: '/#portfolio'   },
            { label: 'Case Studies',id: 'case-studies',href: '/#case-studies'},
            { label: 'Pricing',     id: 'pricing',     href: '/#pricing'     },
          ].map(({ label, id, href }) => (
            <a
              key={id}
              href={href}
              onClick={(e) => handleScroll(e, id)}
              className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300"
            >
              {label}
            </a>
          ))}
          <ServicesMegaMenu />
          <a href="/blog" className="text-sm font-medium text-neutral-black hover:text-brand-red transition-colors duration-300">
            Blog
          </a>
          <a
            href="/#contact"
            onClick={(e) => handleScroll(e, 'contact')}
            className="px-6 py-2 bg-brand-gradient text-white rounded-lg text-sm font-semibold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            style={{
              transition: shouldReduceMotion
                ? 'none'
                : 'transform 250ms cubic-bezier(0.25,1,0.5,1), box-shadow 250ms cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            Contact
          </a>
        </nav>

        <button
          className="md:hidden text-neutral-black focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer — fade + slide down */}
      {isMenuOpen && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
          className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pb-6 pt-4 space-y-3 max-h-[80vh] overflow-y-auto"
        >
          <a href="/#home"         onClick={(e) => handleScroll(e, 'home')}         className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">Home</a>
          <a href="/#about"        onClick={(e) => handleScroll(e, 'about')}        className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">About Us</a>
          <div className="border-b border-gray-50 pb-2">
            <MobileAccordion onClose={() => setIsMenuOpen(false)} />
          </div>
          <a href="/#portfolio"    onClick={(e) => handleScroll(e, 'portfolio')}    className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">Portfolio</a>
          <a href="/#case-studies" onClick={(e) => handleScroll(e, 'case-studies')} className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">Case Studies</a>
          <a href="/#pricing"      onClick={(e) => handleScroll(e, 'pricing')}      className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">Pricing</a>
          <a href="/blog"          onClick={() => setIsMenuOpen(false)}              className="block py-2 px-1 text-sm font-medium text-neutral-black hover:text-brand-red transition-colors border-b border-gray-50">Blog</a>
          <a
            href="/#contact"
            onClick={(e) => handleScroll(e, 'contact')}
            className="block w-full text-center mt-2 px-6 py-3 bg-brand-gradient text-white rounded-xl text-sm font-semibold hover:shadow-[0_4px_20px_rgba(214,0,60,0.35)] transition-all duration-300"
          >
            Contact
          </a>
        </motion.div>
      )}
    </header>
  )
}
