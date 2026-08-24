'use client'

import React, { useState } from 'react'
import { ArrowLeft, Loader2, Check, AlertCircle } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { updateSiteContentSection } from '@/lib/supabase/cms'

interface AboutContent {
  tagline: string
  heading: string
  heading_accent: string
  description: string
}

interface AdminAboutClientProps {
  userEmail: string
  initialContent: AboutContent
}

export default function AdminAboutClient({ userEmail, initialContent }: AdminAboutClientProps) {
  const [content, setContent] = useState<AboutContent>({
    tagline: initialContent.tagline || 'About Us',
    heading: initialContent.heading || 'We Build High-Converting',
    heading_accent: initialContent.heading_accent || 'Growth Systems',
    description: initialContent.description || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFieldChange = (key: keyof AboutContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    const { success, error } = await updateSiteContentSection('about', content)
    setIsSaving(false)

    if (error) {
      setStatusMessage({ type: 'error', text: error })
    } else if (success) {
      setStatusMessage({ type: 'success', text: 'About section saved & published successfully!' })
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="About" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/about" />

        <main className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <a href="/admin" className="text-xs font-bold text-neutral-400 hover:text-[#3D00D6] transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} />
                  Dashboard
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-[#6D0091]">About</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                About Us Section Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage About tagline, headline, and core agency text content statement.
              </p>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {statusMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider border-b border-gray-150 pb-2">
                Section Headlines & Text
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                  Section Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={content.tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  placeholder="About Us"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Main Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={content.heading}
                    onChange={(e) => handleFieldChange('heading', e.target.value)}
                    placeholder="We Build High-Converting"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Heading Accent *
                  </label>
                  <input
                    type="text"
                    required
                    value={content.heading_accent}
                    onChange={(e) => handleFieldChange('heading_accent', e.target.value)}
                    placeholder="Growth Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                  Core Statement Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="We help brands grow faster with AI-powered marketing..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-150">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save About Content</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
