'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BlogPost } from '@/lib/blog-data'
import BlogCard from './BlogCard'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'

interface BlogGridProps {
  posts: BlogPost[]
}

const POSTS_PER_PAGE = 6

export default function BlogGrid({ posts }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mb-16">
      
      {/* Controls Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-100">
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Grid Container */}
      {paginatedPosts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {paginatedPosts.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm text-neutral-black/45 uppercase tracking-wider">
            No articles found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-100">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-neutral-black/60 hover:border-brand-purple hover:text-brand-purple transitiondisabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous page"
          >
            <ArrowLeft size={16} />
          </button>
          
          <span className="text-xs font-bold text-neutral-black/65 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-neutral-black/60 hover:border-brand-purple hover:text-brand-purple transitiondisabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next page"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  )
}
