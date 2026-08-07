'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { BlogPost } from '@/lib/blog-data'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-purple/20 transition-all duration-300 flex flex-col h-full group relative z-10"
    >
      {/* Cover Image */}
      <div className="h-48 overflow-hidden relative bg-slate-100 flex-shrink-0">
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60'
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 text-[9px] font-extrabold uppercase tracking-widest text-brand-purple bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm z-10">
          {post.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[10px] text-neutral-black/50">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime}
            </span>
          </div>

          <h3 className="text-base font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-neutral-black/60 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Author / Arrow CTA Footer */}
        <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div>
              <span className="block text-[11px] font-bold text-neutral-black leading-none mb-0.5">
                {post.author.name}
              </span>
              <span className="block text-[9px] text-neutral-black/45 leading-none">
                {post.author.role}
              </span>
            </div>
          </div>

          <a
            href={`/blog/${post.slug}`}
            className="w-8 h-8 rounded-full bg-brand-purple/5 group-hover:bg-brand-gradient group-hover:text-white text-brand-purple flex items-center justify-center transition-all duration-300"
            aria-label={`Read ${post.title}`}
          >
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
