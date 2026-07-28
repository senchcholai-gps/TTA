'use client'

import React from 'react'
import { BlogSection } from '@/lib/blog-data'

interface TableOfContentsProps {
  sections: BlogSection[]
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const headings = sections
    .filter((s) => s.heading)
    .map((s, idx) => ({
      title: s.heading as string,
      id: `section-${idx}`
    }))

  if (headings.length === 0) return null

  const handleScrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      const yOffset = -100 // Header height offset
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="p-6 rounded-2xl border border-gray-150 bg-white shadow-sm space-y-4">
      <h4 className="text-sm font-bold text-neutral-black uppercase tracking-wider">
        Table of Contents
      </h4>
      <nav aria-label="Table of contents">
        <ul className="space-y-2 text-xs">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleScrollToSection(e, h.id)}
                className="block text-neutral-black/60 hover:text-brand-purple hover:underline transition-colors font-medium py-1"
              >
                {h.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
