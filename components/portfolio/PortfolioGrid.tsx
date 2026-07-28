'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioItems, portfolioCategories, PortfolioCategory, PortfolioItem } from '@/lib/portfolio-data'

function getReelId(url: string): string {
  const match = url.match(/\/reel(?:s)?\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : ''
}

function getYoutubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/)
  return match ? match[1] : ''
}

export function ClientAvatar({ logo, name, className = "w-12 h-12 text-[11px]", imgPaddingClass = "p-2" }: { logo?: string, name?: string, className?: string, imgPaddingClass?: string }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'FD'

  if (!logo || logo === 'DSM' || logo.includes('finance_dsm_logo')) {
    return (
      <div className={`${className} rounded-full bg-gradient-to-br from-brand-purple to-blue-500 flex items-center justify-center flex-shrink-0 text-white font-black select-none border border-gray-200/80 shadow-xs`}>
        {initials}
      </div>
    )
  }

  return (
    <div className={`${className} rounded-full border border-gray-200 bg-white flex items-center justify-center ${imgPaddingClass} flex-shrink-0`}>
      <img
        src={logo}
        alt={name}
        className="w-full h-full object-contain object-center"
        loading="lazy"
      />
    </div>
  )
}

// 1. Instagram Reels Card (Vertical Card)
export function InstagramReelCard({ item }: { item: PortfolioItem }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-gray-150 rounded-3xl shadow-sm hover:shadow-2xl hover:border-brand-purple/35 transition-all duration-300 flex flex-col h-full overflow-hidden group relative"
    >
      {/* Top Thin Animated Gradient Line */}
      <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-brand-red via-brand-magenta to-brand-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Visual Area - Fixed 9:16 aspect ratio thumbnail with max height */}
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-full aspect-[9/16] max-h-[360px] bg-slate-50 relative overflow-hidden flex-shrink-0 border-b border-gray-100 block cursor-pointer group/thumb"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover scale-100 group-hover/thumb:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-neutral-black/20 group-hover/thumb:bg-neutral-black/35 transition-colors duration-300" />
        
        {/* Centered Translucent Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-md transform group-hover/thumb:scale-110 transition duration-300">
            <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      </a>
      
      {/* Content Area */}
      <div className="p-7 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          {/* Label */}
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-purple">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>Instagram Reel</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-neutral-black leading-snug group-hover:text-brand-purple group-hover:-translate-y-1 transition-all duration-300 line-clamp-2">
            {item.title}
          </h3>
          
          {/* Description */}
          <p className="text-[15px] text-neutral-black/65 leading-relaxed line-clamp-2 font-medium">
            {item.description}
          </p>
        </div>
        
        {/* Button CTA */}
        <div className="pt-5 mt-6 border-t border-gray-100 flex-shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-brand-gradient text-white rounded-xl text-xs font-bold hover:shadow-[0_8px_30px_rgba(214,0,60,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn"
          >
            <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">Open Reel</span>
            <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// 2. YouTube Showcase Card (Horizontal Card)
export function YouTubeShowcaseCard({ item }: { item: PortfolioItem }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const ytId = getYoutubeId(item.url)
  
  return (
    <div className="bg-white border border-gray-150 rounded-[20px] shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-300 overflow-hidden flex flex-col md:flex-row group h-full">
      {/* Visual / Player Area */}
      <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto md:h-auto min-h-[200px] bg-slate-100 relative overflow-hidden flex-shrink-0">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full cursor-pointer group/thumb" onClick={() => setIsPlaying(true)}>
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={item.title}
              className="w-full h-full object-cover group-hover/thumb:scale-103 transition-transform duration-500"
              loading="lazy"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-neutral-black/20 group-hover/thumb:bg-neutral-black/35 transition-colors duration-300" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-md transform group-hover/thumb:scale-110 transition duration-300">
                <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
            
            {/* Duration Badge */}
            {item.duration && (
              <span className="absolute bottom-3 right-3 bg-neutral-black/85 backdrop-blur-xs text-[9px] font-black text-white px-2 py-0.5 rounded tracking-wide">
                {item.duration}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-red">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube Video</span>
          </div>
          
          <h3 className="text-base md:text-lg font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-xs text-neutral-black/70 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
        
        <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="text-[10px] text-neutral-black/50 font-bold flex items-center gap-1.5">
            <span>Duration:</span>
            <span className="text-neutral-black font-extrabold">{item.duration}</span>
          </div>
          
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-gradient-to-r from-brand-purple to-blue-600 hover:from-brand-purple/95 hover:to-blue-600/95 text-white rounded-xl text-xs font-bold transition transform hover:scale-[1.01] flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Watch on YouTube</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// 2b. YouTube Vertical Card (for uniform grid layout)
export function YouTubeVerticalCard({ item }: { item: PortfolioItem }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const ytId = getYoutubeId(item.url)
  
  return (
    <div className="bg-white/90 backdrop-blur-xs border border-gray-150 rounded-[20px] shadow-sm hover:shadow-xl hover:border-brand-magenta/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Visual Area */}
      <div className="w-full aspect-[16/9] bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-gray-100">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full cursor-pointer group/thumb" onClick={() => setIsPlaying(true)}>
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={item.title}
              className="w-full h-full object-cover group-hover/thumb:scale-103 transition-transform duration-500"
              loading="lazy"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-neutral-black/20 group-hover/thumb:bg-neutral-black/35 transition-colors duration-300" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-md transform group-hover/thumb:scale-110 transition duration-300">
                <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
            
            {/* Duration Badge */}
            {item.duration && (
              <span className="absolute bottom-3 right-3 bg-neutral-black/85 backdrop-blur-xs text-[9px] font-black text-white px-2 py-0.5 rounded tracking-wide">
                {item.duration}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-7 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-red">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube Video</span>
          </div>
          
          <h3 className="text-base font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
            {item.title}
          </h3>
          
          <p className="text-xs text-neutral-black/70 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
        
        <div className="pt-5 mt-6 border-t border-gray-100 flex-shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-brand-gradient text-white rounded-xl text-xs font-bold hover:shadow-[0_8px_30px_rgba(214,0,60,0.35)] hover:-translate-y-0.5 transition transform duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Watch on YouTube</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}


// 3. Brand Management Card
export function BrandManagementCard({ item }: { item: PortfolioItem }) {
  const isYouTube = item.platformName === 'YouTube'
  const isInstagram = item.platformName === 'Instagram'
  const isFacebook = item.platformName === 'Facebook'
  
  return (
    <div className="bg-white/90 backdrop-blur-xs border border-gray-150 rounded-[20px] shadow-sm hover:shadow-xl hover:border-brand-magenta/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Visual Media Header Frame - Matching Aspect Ratio of Other Cards */}
      <div className="w-full aspect-[16/9] bg-slate-50 relative overflow-hidden flex-shrink-0 border-b border-gray-100 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Large Profile Image/Logo */}
        <ClientAvatar 
          logo={item.clientLogo} 
          name={item.clientName} 
          className="w-20 h-20 text-2xl shadow-sm border border-gray-250 bg-white" 
          imgPaddingClass="p-3" 
        />
        
        {/* Platform Badge/Icon Floating in Header */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center border border-gray-100 text-slate-400 shadow-xs z-10">
          {isYouTube && (
            <svg className="w-4.5 h-4.5 fill-red-600" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          )}
          {isInstagram && (
            <svg className="w-4.5 h-4.5 stroke-pink-600 fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          )}
          {isFacebook && (
            <svg className="w-5 h-5 fill-blue-600" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-7 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-purple">
            <span>{item.platformName} Managed Page</span>
          </div>
          
          <h3 className="text-base font-bold text-neutral-black leading-snug group-hover:text-brand-purple transition-colors">
            {item.clientName}
          </h3>
          
          <p className="text-xs text-neutral-black/60 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="pt-5 mt-6 border-t border-gray-100 flex-shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-brand-gradient text-white rounded-xl text-xs font-bold hover:shadow-[0_8px_30px_rgba(214,0,60,0.35)] hover:-translate-y-0.5 transition transform duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Visit Page</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // Split items by category for the 'All' tab layout
  const reelsItems = useMemo(() => portfolioItems.filter(i => i.category === 'Instagram Reels & Short-form Content'), [])
  const youtubeItems = useMemo(() => portfolioItems.filter(i => i.category === 'Long-form YouTube Videos'), [])
  const managedPagesItems = useMemo(() => portfolioItems.filter(i => i.category === 'Pages We Manage'), [])

  const filteredItems = useMemo(() => {
    return portfolioItems.filter(
      (item) => activeCategory === 'All' || item.category === activeCategory
    )
  }, [activeCategory])

  return (
    <div className="space-y-16">
      
      {/* Category Filters */}
      <div className="flex overflow-x-auto pb-6 scrollbar-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-start md:justify-center">
        <div className="flex gap-3 min-w-max">
          {portfolioCategories.map((cat) => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  // Smoothly scroll grid top into view if user clicks a filter pill
                  const gridEl = document.getElementById('portfolio-cards-container')
                  if (gridEl) {
                    gridEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                  }
                }}
                className={`relative px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none focus:outline-none border ${
                  isSelected
                    ? 'border-transparent text-white shadow-sm'
                    : 'bg-white/80 border-gray-150 text-neutral-black/75 hover:text-brand-purple hover:border-brand-purple/30 hover:shadow-2xs'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePortfolioCategory"
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

      {/* Grid of Cards */}
      <div id="portfolio-cards-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {activeCategory === 'All' ? (
          <div className="space-y-24">
            
            {/* Instagram Reels Section */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-150 pb-5">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black text-neutral-black">
                    Instagram Reels & Short-form Content
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-black/50 font-semibold">
                    Viral reach vertical content designed for mobile-first audiences
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('Instagram Reels & Short-form Content')
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className="text-brand-purple hover:text-brand-text-purple text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mt-3 md:mt-0 group cursor-pointer focus:outline-none"
                >
                  <span>View all Reels</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {reelsItems.slice(0, 3).map((item) => (
                  <InstagramReelCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* YouTube Videos Section */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-150 pb-5">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black text-neutral-black">
                    Long-form YouTube Videos
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-black/50 font-semibold">
                    High-value educational and promotional video production
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('Long-form YouTube Videos')
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className="text-brand-purple hover:text-brand-text-purple text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mt-3 md:mt-0 group cursor-pointer focus:outline-none"
                >
                  <span>View all Videos</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {youtubeItems.slice(0, 3).map((item) => (
                  <YouTubeVerticalCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Pages We Manage Section */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-150 pb-5">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-black text-neutral-black">
                    Pages We Manage
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-black/50 font-semibold">
                    Daily growth management, brand consistency, and audience moderation
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('Pages We Manage')
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                  className="text-brand-purple hover:text-brand-text-purple text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mt-3 md:mt-0 group cursor-pointer focus:outline-none"
                >
                  <span>View all Pages</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {managedPagesItems.slice(0, 3).map((item) => (
                  <BrandManagementCard key={item.id} item={item} />
                ))}
              </div>
            </div>

          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const isReel = item.category === 'Instagram Reels & Short-form Content'
                const isYT = item.category === 'Long-form YouTube Videos'
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-1"
                  >
                    {isReel && <InstagramReelCard item={item} />}
                    {isYT && <YouTubeVerticalCard item={item} />}
                    {!isReel && !isYT && <BrandManagementCard item={item} />}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

    </div>
  )
}
