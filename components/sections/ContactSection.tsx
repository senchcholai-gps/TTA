'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import FadeInView from '@/components/ui/FadeInView'
import {
  Mail,
  Phone,
  Download,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { getSiteContentSection } from '@/lib/supabase/cms'

const defaultContactCTA = {
  heading: 'Free Marketing Audit',
  subheading: 'Fill out the form below to receive a comprehensive analysis of your growth opportunities.',
  contact_email: 'thethreeamigosdm@gmail.com',
  contact_phone: '+91 85264 62969',
  whatsapp_number: '+918526462969',
  office_address: 'Chennai, India',
}

export default function ContactSection() {
  const shouldReduceMotion = useReducedMotion()

  // CMS-driven contact info
  const [contactCTA, setContactCTA] = useState(defaultContactCTA)

  useEffect(() => {
    getSiteContentSection('contact_cta', defaultContactCTA).then((data) => {
      if (data) setContactCTA(data as typeof defaultContactCTA)
    })
  }, [])

  // Audit Form State
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    servicesInterested: '',
    budgetRange: ''
  })
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.phone.trim()) errors.phone = 'Phone / WhatsApp number is required'
    if (!formData.servicesInterested) errors.servicesInterested = 'Please select a service'
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const { [name]: _, ...rest } = prev
        return rest
      })
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setFormStatus('submitting')
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormStatus('success')
        setFormData({
          name: '',
          businessName: '',
          phone: '',
          servicesInterested: '',
          budgetRange: ''
        })
      } else {
        setFormStatus('error')
        console.error('Audit submission error:', data.error || 'Unknown error')
      }
    } catch (error) {
      setFormStatus('error')
      console.error('Network error during audit submission:', error)
    }
  }



  const servicesList = [
    'AI Marketing',
    'Social Media',
    'Video Production',
    'Performance Marketing',
    'Email Marketing',
    'Influencer Marketing'
  ]

  return (
    <section id="contact" className="py-14 sm:py-16 md:py-20 lg:py-24 bg-transparent overflow-hidden relative">

      {/* === ELEGANT CONTACT BACKGROUND GLOW === */}
      {!shouldReduceMotion && (
        <>
          {/* Central deep glow — behind the CTA */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.09, 0.05],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-brand-red/70 via-brand-magenta/60 to-brand-purple/70 rounded-full blur-[120px] pointer-events-none -z-10"
          />

          {/* Flanking orb — top-left */}
          <motion.div
            aria-hidden="true"
            animate={{ x: [-25, 25, -25], y: [-10, 10, -10], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-0 -left-[10%] w-[450px] h-[450px] bg-gradient-to-br from-brand-red to-transparent rounded-full blur-[100px] pointer-events-none -z-10"
          />

          {/* Flanking orb — bottom-right */}
          <motion.div
            aria-hidden="true"
            animate={{ x: [25, -25, 25], y: [10, -10, 10], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-0 -right-[10%] w-[450px] h-[450px] bg-gradient-to-tl from-brand-purple to-transparent rounded-full blur-[100px] pointer-events-none -z-10"
          />

          {/* Thin gradient top rule */}
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[12%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red to-transparent pointer-events-none -z-10"
          />

          {/* Thin gradient bottom rule */}
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: [1, 0.6, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            className="absolute bottom-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent pointer-events-none -z-10"
          />

          {/* Floating particles */}
          {[
            { x: '8%',  y: '25%', dur: 12, delay: 0,   size: 4 },
            { x: '92%', y: '20%', dur: 15, delay: 1.5, size: 3 },
            { x: '85%', y: '65%', dur: 10, delay: 3,   size: 5 },
            { x: '5%',  y: '72%', dur: 14, delay: 2,   size: 3 },
            { x: '48%', y: '88%', dur: 17, delay: 0.5, size: 4 },
            { x: '60%', y: '8%',  dur: 11, delay: 4,   size: 3 },
          ].map((p, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              animate={{ y: [0, -14, 0], opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              className="absolute rounded-full bg-brand-magenta pointer-events-none -z-10"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
              }}
            />
          ))}
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <FadeInView className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black mt-2 mb-4">
            {contactCTA.heading}
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            {contactCTA.subheading}
          </p>
        </FadeInView>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Profile Download */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-8 rounded-2xl border border-gray-150 bg-white/80 backdrop-blur-md shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-neutral-black">Let's Talk Growth</h3>
              <p className="text-sm text-neutral-black/70 leading-relaxed">
                Have questions or want to check alignment before filling out the audit? Reach out directly to our team.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-purple/10 text-brand-purple">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-black/45 tracking-wider">Email</span>
                    <a href={`mailto:${contactCTA.contact_email}`} className="text-sm font-semibold text-neutral-black hover:text-brand-purple transition-colors">
                      {contactCTA.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-purple/10 text-brand-purple">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-black/45 tracking-wider">Phone</span>
                    <a href={`https://wa.me/${contactCTA.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-neutral-black hover:text-brand-purple transition-colors">
                      {contactCTA.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-purple/10 text-brand-purple">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-black/45 tracking-wider">Office</span>
                    <span className="text-sm font-semibold text-neutral-black">
                      {contactCTA.office_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Profile Download Button — links to static pre-generated PDF */}
              <div className="pt-4 border-t border-gray-100">
                <motion.a
                  href="/documents/TTA_Company_Profile.pdf"
                  download="TTA_Company_Profile.pdf"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:border-brand-purple/35 text-xs font-bold text-brand-purple hover:text-brand-text-purple transition-shadow duration-300 focus:outline-none cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Company Profile (PDF)</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Audit Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl border border-gray-150 bg-white shadow-sm relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-12 text-center flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                      <CheckCircle2 size={36} className="animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-black">Audit Requested Successfully!</h3>
                    <p className="text-sm text-neutral-black/75 max-w-sm leading-relaxed">
                      Thank you for request! Our team will evaluate your brand profiles and reach out with a custom strategy within 24 hours.
                    </p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="mt-6 px-6 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-brand-purple/35 text-xs font-bold text-brand-purple hover:text-brand-text-purple transition"
                    >
                      Request Another Audit
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Row 1: Name + Business Name */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-black/70 mb-2 uppercase tracking-wide">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.name ? 'border-brand-red' : 'border-gray-250 focus:border-brand-purple'
                          } bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10`}
                          placeholder="Your full name"
                        />
                        {validationErrors.name && (
                          <span className="text-[10px] text-brand-red font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {validationErrors.name}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-black/70 mb-2 uppercase tracking-wide">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:border-brand-purple bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone/WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-black/70 mb-2 uppercase tracking-wide">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          validationErrors.phone ? 'border-brand-red' : 'border-gray-250 focus:border-brand-purple'
                        } bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {validationErrors.phone && (
                        <span className="text-[10px] text-brand-red font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {validationErrors.phone}
                        </span>
                      )}
                    </div>

                    {/* Row 3: Service Interested In + Budget Range */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-black/70 mb-2 uppercase tracking-wide">
                          Service Interested In *
                        </label>
                        <select
                          name="servicesInterested"
                          value={formData.servicesInterested}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.servicesInterested ? 'border-brand-red' : 'border-gray-250 focus:border-brand-purple'
                          } bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10`}
                        >
                          <option value="">Select a Service</option>
                          <option value="AI Marketing Solutions">AI Marketing Solutions</option>
                          <option value="Social Media Marketing">Social Media Marketing</option>
                          <option value="Content Production & Video Editing">Content Production & Video Editing</option>
                          <option value="Performance Marketing">Performance Marketing</option>
                          <option value="Email Marketing">Email Marketing</option>
                          <option value="Influencer Marketing">Influencer Marketing</option>
                        </select>
                        {validationErrors.servicesInterested && (
                          <span className="text-[10px] text-brand-red font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> {validationErrors.servicesInterested}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-black/70 mb-2 uppercase tracking-wide">
                          Budget Range <span className="text-neutral-black/40 normal-case">(optional)</span>
                        </label>
                        <select
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-250 focus:border-brand-purple bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10"
                        >
                          <option value="">Select Budget</option>
                          <option value="Under ₹25K">Under ₹25K</option>
                          <option value="₹25K - ₹50K">₹25K – ₹50K</option>
                          <option value="₹50K - ₹1L">₹50K – ₹1L</option>
                          <option value="₹1L - ₹3L">₹1L – ₹3L</option>
                          <option value="₹3L+">₹3L+</option>
                          <option value="Not Sure">Not Sure Yet</option>
                        </select>
                      </div>
                    </div>

                    {formStatus === 'error' && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-150 text-brand-red text-xs font-semibold flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>Failed to send audit request. Please try again or reach out directly to thethreeamigosdm@gmail.com</span>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      className="w-full py-4 rounded-xl bg-brand-gradient text-white font-semibold text-sm hover:shadow-[0_6px_25px_rgba(214,0,60,0.25)] transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-white" />
                          <span>Requesting Audit...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Audit Request</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

