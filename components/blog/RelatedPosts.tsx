'use client'

import React from 'react'
import { BlogPost } from '@/lib/blog-data'
import BlogCard from './BlogCard'

interface RelatedPostsProps {
  currentSlug: string
  category: string
  posts: BlogPost[]
}

export default function RelatedPosts({ currentSlug, category, posts }: RelatedPostsProps) {
  // Filter by category and exclude current post
  const related = posts
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3)

  // If we don't have enough, fill with other posts
  if (related.length < 3) {
    const extra = posts.filter((p) => p.slug !== currentSlug && !related.find((r) => r.slug === p.slug))
    related.push(...extra.slice(0, 3 - related.length))
  }

  return (
    <section className="py-12 border-t border-gray-100">
      <h3 className="text-xl font-bold text-neutral-black mb-8">
        Related Articles
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        {related.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
