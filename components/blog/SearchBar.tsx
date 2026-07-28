'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-black/45">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search insights..."
        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-250 bg-white text-sm text-neutral-black transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/10 focus:border-brand-purple"
      />
    </div>
  )
}
