'use client'

import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import FadeInView from '@/components/ui/FadeInView'
import { staggerContainer, staggerItem, cardHover } from '@/lib/motion'
import { blogPosts, BlogPost } from '@/lib/blog-data'
import { getBlogPosts } from '@/lib/supabase/cms'

export default function BlogSection() {
  const shouldReduceMotion = useReducedMotion()

  const [posts, setPosts] = useState<BlogPost[]>(blogPosts)

  useEffect(() => {
    getBlogPosts().then((data) => {
      if (data && data.length > 0) {
        setPosts(data)
      }
    })
  }, [])

  const previewPosts = posts.slice(0, 3)

  return (
    <section id="blog" className="py-14 sm:py-16 md:py-20 lg:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <FadeInView className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="text-sm font-bold text-brand-purple tracking-widest uppercase">
            Blog &amp; Insights
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black mt-2 mb-4">
            Latest Marketing Insights
          </h2>
          <p className="text-lg text-neutral-black/75 max-w-2xl mx-auto">
            Actionable strategies, AI marketing guides, branding ideas, case studies and growth tips from The Three Amigos.
          </p>
        </FadeInView>

        {/* Blog Cards — stagger reveal */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8 relative mb-12"
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
        >
          {previewPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              variants={shouldReduceMotion ? undefined : staggerItem}
              whileHover={shouldReduceMotion ? undefined : cardHover}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col h-full hover:shadow-lg hover:border-brand-purple/20 transition-shadow duration-300 group"
            >
              {/* Cover Image */}
              <div className="h-32 sm:h-48 overflow-hidden relative bg-slate-100 flex-shrink-0">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-purple bg-white border border-gray-100 px-3 py-1 rounded-full shadow-xs z-10">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[10px] text-neutral-black/45 mb-3 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-black mb-2 leading-snug group-hover:text-brand-purple transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-black/60 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-neutral-black/45 group-hover:text-brand-purple transition-colors duration-300">
                  <a href={`/blog/${post.slug}`} className="flex items-center gap-1.5">
                    <span>Read Article</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <FadeInView delay={0.1} className="text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-200 hover:border-brand-purple/35 text-xs font-bold text-brand-purple hover:bg-brand-purple/5 transition-all duration-300"
          >
            <span>View All Insights</span>
            <ArrowRight size={14} />
          </a>
        </FadeInView>
      </div>
    </section>
  )
}

