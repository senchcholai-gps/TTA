'use client'

import React, { useState } from 'react'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  userEmail: string
  currentModule: string
}

export default function AdminHeader({ userEmail, currentModule }: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/admin/login'
    } catch {
      window.location.href = '/admin/login'
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin" className="flex items-center gap-2">
            <img src="/TTA_Logo_Landscape.png" alt="The Three Amigos" className="h-10 w-auto object-contain" />
          </a>
          <span className="hidden sm:inline-block text-xs font-black text-[#6D0091] bg-[#8B0095]/10 border border-[#8B0095]/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {currentModule} CMS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] bg-slate-100 px-3 py-1.5 rounded-full border border-gray-200">
            <User size={14} className="text-[#3D00D6]" />
            <span>{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-rose-50 text-[#D6003C] hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>{isLoggingOut ? 'Signing Out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
