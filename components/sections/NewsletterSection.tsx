'use client'

import React, { useState, FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import FadeInView from '@/components/ui/FadeInView'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    
    // basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    
    // simulate network
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1000)
  }

  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-20 bg-gradient-to-r from-brand-red/5 via-brand-magenta/5 to-brand-purple/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <FadeInView className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-black tracking-tight">
            Stay in the Loop
          </h2>
          <p className="text-sm md:text-base text-neutral-black/70 leading-relaxed">
            Get weekly marketing insights, AI growth frameworks, and actionable social media strategies straight to your inbox.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl max-w-md mx-auto"
              >
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold">You're in! Check your inbox for updates.</span>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubscribe}
                className="w-full max-w-md mx-auto space-y-2"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your business email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === 'error') setStatus('idle')
                    }}
                    disabled={status === 'loading'}
                    required
                    className="flex-grow px-4 py-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple text-sm text-neutral-black transition-all"
                  />
                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                    className="px-6 py-3 rounded-xl bg-brand-gradient text-white text-sm font-semibold hover:shadow-[0_4px_15px_rgba(214,0,60,0.25)] transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-70 flex-shrink-0 cursor-pointer"
                  >
                    <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                    <Send size={14} />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 justify-center text-xs text-brand-red font-semibold mt-2"
                    >
                      <AlertCircle size={14} className="flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeInView>
      </div>
    </section>
  )
}
