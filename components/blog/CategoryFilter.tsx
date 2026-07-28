'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const CATEGORIES = [
  'All',
  'AI Marketing',
  'Social Media Strategy',
  'Video & Content Production',
  'Performance Marketing',
  'Influencer Marketing',
  'Industry Spotlights',
  'Case Studies & Client Wins'
]

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-none">
      <div className="flex flex-wrap gap-2 px-4 md:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer select-none focus:outline-none border ${
                isSelected
                  ? 'border-transparent text-white'
                  : 'bg-slate-50 border-gray-200 text-neutral-black/70 hover:text-brand-purple hover:border-brand-purple/35'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-brand-gradient rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
