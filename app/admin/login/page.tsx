'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isAdminUser } from '@/lib/supabase/cms'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        setErrorMessage(error?.message || 'Invalid login credentials.')
        setIsLoading(false)
        return
      }

      // Check if user is registered in admin_users
      const isAdmin = await isAdminUser(data.user.id)

      if (!isAdmin) {
        await supabase.auth.signOut()
        setErrorMessage('You are not authorized to access the admin panel.')
        setIsLoading(false)
        return
      }

      // Success -> Redirect to /admin
      window.location.href = '/admin'
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected authentication error occurred.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans text-[#1A1A1A]">
      {/* Background Radial Glow Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-[#D6003C]/10 to-[#8B0095]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-[#3D00D6]/10 to-[#8B0095]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Watermark Logo */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] opacity-[0.03] select-none pointer-events-none">
        <img src="/TTA_Logo_Icon.png" alt="" className="w-full h-full object-contain" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative z-10"
      >
        {/* Top Animated Gradient Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6]" />

        <div className="p-8 sm:p-10">
          {/* Header & Logo */}
          <div className="text-center space-y-4 mb-8">
            <a href="/" className="inline-block">
              <img
                src="/TTA_Logo_Landscape.png"
                alt="The Three Amigos"
                className="h-12 w-auto mx-auto object-contain"
              />
            </a>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0095]/10 border border-[#8B0095]/20 text-[11px] font-extrabold uppercase tracking-wider text-[#6D0091]">
                <ShieldCheck size={13} className="text-[#D6003C]" />
                CMS Admin Portal
              </div>
              <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight pt-1">
                Admin Sign In
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Enter your admin credentials to access the website CMS.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@threeamigos.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-gray-200 text-[#1A1A1A] text-sm font-medium focus:bg-white focus:border-[#3D00D6] focus:ring-2 focus:ring-[#3D00D6]/15 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-gray-200 text-[#1A1A1A] text-sm font-medium focus:bg-white focus:border-[#3D00D6] focus:ring-2 focus:ring-[#3D00D6]/15 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#1A1A1A] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#3D00D6] hover:bg-gradient-to-r hover:from-[#D6003C] hover:via-[#8B0095] hover:to-[#3D00D6] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center border-t border-gray-150 pt-4">
            <p className="text-[11px] font-medium text-neutral-400">
              The Three Amigos CMS — Protected System
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
