'use client'

import React, { useState, useRef, memo } from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star, User } from 'lucide-react'
import FadeInView from '@/components/ui/FadeInView'

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
    // No fabricated AI profile photo — uses neutral default placeholder
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
          {testimonial.logo ? (
            <img
              src={testimonial.logo}
              alt={testimonial.name}
              className={`w-full h-full ${
                testimonial.logoFit === 'contain' ? 'object-contain p-1.5' : 'object-cover'
              } object-center`}
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
  const [activeIndex, setActiveIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScrollTo = (index: number) => {
    setActiveIndex(index)
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 350
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth + 24),
        behavior: 'smooth',
      })
    }
  }

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % testimonialsData.length
    handleScrollTo(nextIdx)
  }

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + testimonialsData.length) % testimonialsData.length
    handleScrollTo(prevIdx)
  }

  return (
    <section
      id="testimonials"
      className="py-24 bg-transparent overflow-hidden relative"
    >
      {/* Decorative Background Drifting Glow */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-brand-red/5 via-brand-magenta/5 to-brand-purple/5 rounded-full blur-3xl pointer-events-none -z-10"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-neutral-black hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-neutral-black hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container — 2.2 cards visible on desktop, snap-scroll on mobile */}
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-[88%] sm:w-[55%] lg:w-[42%] flex-shrink-0 snap-start h-auto"
            >
              <TestimonialCard
                testimonial={testimonial}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </motion.div>

        {/* Pagination Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonialsData.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleScrollTo(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-8 bg-brand-gradient'
                  : 'w-2.5 bg-gray-250 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
