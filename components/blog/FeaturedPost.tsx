'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { BlogPost } from '@/lib/blog-data'

interface FeaturedPostProps {
  post: BlogPost
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="relative mb-6">
        <span className="text-xs font-bold text-brand-purple tracking-wider uppercase">
          Featured Article
        </span>
      </div>
      <motion.a
        href={`/blog/${post.slug}`}
        whileHover={{ y: -4 }}
        className="block bg-white/70 backdrop-blur-md rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-500 group"
      >
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Image Column */}
          <div className="lg:col-span-7 h-[300px] lg:h-[450px] overflow-hidden relative bg-slate-100">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=75'
              }}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <span className="absolute top-6 left-6 text-[10px] font-extrabold uppercase tracking-widest text-brand-purple bg-white border border-gray-100 px-4 py-1.5 rounded-full shadow-sm z-10">
              {post.category}
            </span>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-neutral-black/50">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {post.publishDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-black group-hover:text-brand-purple transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="text-sm text-neutral-black/70 leading-relaxed line-clamp-4">
                {post.excerpt}
              </p>
            </div>

            {/* Author Profile */}
            <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <span className="block text-xs font-bold text-neutral-black leading-none mb-1">
                    {post.author.name}
                  </span>
                  <span className="block text-[10px] text-neutral-black/45 leading-none">
                    {post.author.role}
                  </span>
                </div>
              </div>

              <span className="w-10 h-10 rounded-full bg-brand-purple/5 group-hover:bg-brand-gradient group-hover:text-white text-brand-purple flex items-center justify-center transition-all duration-300">
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </motion.a>
    </div>
  )
}
