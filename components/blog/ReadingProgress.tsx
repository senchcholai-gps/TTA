'use client'

import React, { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const totalScrollable = documentHeight - windowHeight
      if (totalScrollable > 0) {
        setProgress((scrollTop / totalScrollable) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-[80px] left-0 w-full h-[3px] bg-gray-100 z-[49] pointer-events-none">
      <div
        className="h-full bg-brand-gradient transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
