'use client'

import React, { useState, useRef, memo, useEffect } from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { Quote, Star, User } from 'lucide-react'
import FadeInView from '@/components/ui/FadeInView'
import { getTestimonials, Testimonial } from '@/lib/supabase/cms'

const cubicEaseOut = [0.33, 1, 0.68, 1] as const

interface TestimonialData {
  id: number
  name: string
  company: string
  text: string
  logo?: string
  logoFit?: 'contain' | 'cover'
  rating: number
  tag: string
}

const testimonialsData: TestimonialData[] = [
  {
    id: 1,
    name: 'Finance with DSM',
    company: 'Individual Creator',
    text: 'The Three Amigos completely reshaped how we tell our story on Instagram. Our finance content finally feels simple and relatable to a Tamil-speaking audience — SIPs and Demat accounts explained in a way people actually stop and watch.',
    logo: '/finance_dsm_logo.jpg',
    logoFit: 'contain',
    rating: 5,
    tag: 'Verified Client'
  },
  {
    id: 2,
    name: 'Maven Consulting Services',
    company: 'Consulting Services',
    text: "Our YouTube videos used to get views but not results. After The Three Amigos restructured our scripts and CTAs, we're seeing real consultation inquiries — and our commission-free model finally comes through clearly in every video.",
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png',
    logoFit: 'contain',
    rating: 5,
    tag: 'Verified Client'
  },
  {
    id: 3,
    name: 'Mathangee Thiagarajan',
    company: 'Her Finance Stories',
    text: "Working with The Three Amigos brought structure and consistency to my content that I couldn't manage on my own. They understand finance content and know how to make it feel personal, not preachy.",
    rating: 5,
    tag: 'Verified Client'
  },
  {
    id: 4,
    name: 'Bakthi Infinity',
    company: 'Devotional Brand',
    text: 'From content planning to the final edit, The Three Amigos handled everything in-house. Our page finally has a consistent identity across Facebook and Instagram.',
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
    logoFit: 'contain',
    rating: 5,
    tag: 'Verified Client'
  }
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: cubicEaseOut,
    },
  },
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  shouldReduceMotion
}: {
  testimonial: TestimonialData
  shouldReduceMotion: boolean | null
}) {
  const [imgError, setImgError] = useState(false)
  const hasAvatar = Boolean(testimonial.logo && !imgError)

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -10,
              transition: { duration: 0.25, ease: cubicEaseOut },
            }
      }
      className="group relative p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-150 shadow-sm hover:shadow-2xl hover:border-brand-purple/35 transition-all duration-300 flex flex-col justify-between h-full select-none"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Quote Icon & Badge */}
        <div className="flex justify-between items-start mb-6 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/5 flex items-center justify-center group-hover:bg-brand-purple/10 transition-colors duration-300">
            <Quote className="text-brand-purple/40 group-hover:text-brand-purple transition-colors duration-300 w-6 h-6 flex-shrink-0" />
          </div>
          
          <span className="text-[10px] font-extrabold uppercase px-3 py-1 bg-slate-50 group-hover:bg-brand-purple/10 text-neutral-black/50 group-hover:text-brand-purple border border-gray-150 group-hover:border-brand-purple/20 rounded-full tracking-wider transition-all duration-300">
            {testimonial.tag}
          </span>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4 text-amber-400">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={15} fill="currentColor" />
          ))}
        </div>

        {/* Testimonial Quote */}
        <p className="text-neutral-black/85 leading-relaxed text-sm md:text-[15px] italic mb-8 font-medium">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </div>

      {/* Author Info — Production Avatar Rules */}
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-200/80 bg-white shadow-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
          {hasAvatar ? (
            <img
              src={testimonial.logo}
              alt={testimonial.name}
              className={`w-full h-full ${
                testimonial.logoFit === 'cover' ? 'object-cover' : 'object-contain p-1.5'
              } object-center`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-neutral-400">
              <User size={18} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-grow">
          <p className="font-bold text-neutral-black text-sm truncate group-hover:text-brand-purple transition-colors duration-300">
            {testimonial.name}
          </p>
          <p className="text-xs text-neutral-black/55 font-medium truncate">
            {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion()
  const [items, setItems] = useState<TestimonialData[]>(testimonialsData)

  useEffect(() => {
    getTestimonials().then((data) => {
      if (data && data.length > 0) {
        const mapped: TestimonialData[] = data.map((t, idx) => {
          const avatar = t.avatar_url || (t as any).avatar || undefined
          const isPhoto = Boolean(
            avatar &&
              (avatar.includes('avatar') ||
                avatar.includes('user') ||
                avatar.includes('profile') ||
                avatar.includes('headshot'))
          )
          return {
            id: idx + 1,
            name: t.name,
            company: t.company || t.role || 'Client Partner',
            text: t.text,
            logo: avatar,
            logoFit: isPhoto ? 'cover' : 'contain',
            rating: t.rating || 5,
            tag: 'Verified Client',
          }
        })
        setItems(mapped)
      }
    })
  }, [])

  return (
    <section
      id="testimonials"
      className="py-24 bg-transparent overflow-hidden relative"
    >
      {/* Ambient background decorations */}
      {!shouldReduceMotion && (
        <>
          {/* Primary drifting glow */}
          <motion.div
            animate={{ x: [-30, 30, -30], opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-brand-red/60 via-brand-magenta/50 to-brand-purple/60 rounded-full blur-[90px] pointer-events-none -z-10"
          />

          {/* Secondary orb — top-left */}
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -20, 0], opacity: [0.025, 0.05, 0.025] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-0 left-[5%] w-[300px] h-[300px] bg-gradient-to-br from-brand-red to-transparent rounded-full blur-[80px] pointer-events-none -z-10"
          />

          {/* Secondary orb — bottom-right */}
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, 18, 0], opacity: [0.025, 0.045, 0.025] }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-0 right-[5%] w-[350px] h-[350px] bg-gradient-to-tl from-brand-purple to-transparent rounded-full blur-[90px] pointer-events-none -z-10"
          />

          {/* Drifting particle dots */}
          {[
            { x: '15%', y: '20%', size: 4, dur: 14, delay: 0 },
            { x: '80%', y: '15%', size: 3, dur: 18, delay: 1 },
            { x: '70%', y: '75%', size: 5, dur: 16, delay: 3 },
            { x: '25%', y: '80%', size: 3, dur: 21, delay: 2 },
          ].map((p, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              animate={{ y: [0, -12, 0], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              className="absolute rounded-full bg-brand-purple pointer-events-none -z-10"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
              }}
            />
          ))}

          {/* Thin gradient shimmer line */}
          <motion.div
            aria-hidden="true"
            animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[45%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-magenta to-transparent pointer-events-none -z-10"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <FadeInView className="text-left">
            <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
              Client Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-black mt-2 mb-4">
              Real Results, Real Partners
            </h2>
            <p className="text-lg text-neutral-black/75 max-w-xl">
              Read quotes directly from business owners who partnered with us to scale their digital marketing.
            </p>
          </FadeInView>
        </div>

      </div>

      {/* Infinite Marquee — full width, outside the max-w container so it truly spans edge-to-edge */}
      <div className="relative w-full overflow-hidden py-4">
        <motion.div
          className="flex gap-6"
          animate={{
            x: shouldReduceMotion ? 0 : ["0%", "calc(-50% - 12px)"],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 23.5,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {/* First Set */}
          <div className="flex gap-6 flex-shrink-0">
            {items.map((testimonial) => (
              <div
                key={`set1-${testimonial.id}`}
                className="w-[85vw] sm:w-[400px] lg:w-[450px] flex-shrink-0 h-auto"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            ))}
          </div>
          {/* Second Set */}
          <div className="flex gap-6 flex-shrink-0">
            {items.map((testimonial) => (
              <div
                key={`set2-${testimonial.id}`}
                className="w-[85vw] sm:w-[400px] lg:w-[450px] flex-shrink-0 h-auto"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
