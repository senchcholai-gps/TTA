'use client'

import React, { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('You are subscribed!')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed })
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setStatus('success')
        setSuccessMsg(data.message || 'You are subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-16 bg-brand-gradient rounded-3xl overflow-hidden relative shadow-lg my-16">
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(15,15,18,0.15)_100%]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Subscribe to TTA Growth Newsletter
        </h2>
        <p className="text-white/80 text-sm max-w-xl mx-auto leading-relaxed">
          Get weekly actionable growth frameworks, AI marketing blueprints, and design trends delivered directly to your inbox. No fluff, ever.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-white py-2"
            >
              <CheckCircle2 size={36} className="text-white animate-bounce" />
              <span className="text-base font-bold">{successMsg}</span>
              <span className="text-xs text-white/70">Welcome to the Amigos growth circle.</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  placeholder="Enter your work email"
                  className="flex-grow px-5 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-6 py-3.5 bg-white text-brand-purple rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-75 cursor-pointer flex-shrink-0"
                >
                  {status === 'submitting' ? (
                    <Loader2 size={16} className="animate-spin text-brand-purple" />
                  ) : (
                    <>
                      <span>Join Now</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-200 font-semibold mt-2 text-center">
                  {errorMsg}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
