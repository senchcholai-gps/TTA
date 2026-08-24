'use client'

import React, { useState } from 'react'
import { PhoneCall, ArrowLeft, Loader2, Check, AlertCircle, Mail, MapPin, MessageSquare } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { updateSiteContentSection } from '@/lib/supabase/cms'

interface ContactCTAContent {
  heading: string
  subheading: string
  audit_button_label: string
  consultation_cta_text: string
  whatsapp_number: string
  contact_email: string
  contact_phone: string
  office_address: string
}

interface AdminContactCTAClientProps {
  userEmail: string
  initialContent: ContactCTAContent
}

export default function AdminContactCTAClient({ userEmail, initialContent }: AdminContactCTAClientProps) {
  const [content, setContent] = useState<ContactCTAContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFieldChange = (key: keyof ContactCTAContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    const { success, error } = await updateSiteContentSection('contact_cta', content)
    setIsSaving(false)

    if (error) {
      setStatusMessage({ type: 'error', text: error })
    } else if (success) {
      setStatusMessage({ type: 'success', text: 'CTA & Contact settings saved successfully!' })
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="CTA / Contact" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/contact-cta" />

        <main className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <a href="/admin" className="text-xs font-bold text-neutral-400 hover:text-[#3D00D6] transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} />
                  Dashboard
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-[#6D0091]">CTA / Contact</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                CTA & Contact Information CMS
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Control consultation CTAs, WhatsApp floating link, audit form titles, and agency contact details.
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
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider border-b border-gray-150 pb-2 flex items-center gap-2">
                <PhoneCall size={16} className="text-[#3D00D6]" />
                Call To Action Copy & Labels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Contact Section Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={content.heading}
                    onChange={(e) => handleFieldChange('heading', e.target.value)}
                    placeholder="Let’s Build Your Growth System"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Free Audit Button Label
                  </label>
                  <input
                    type="text"
                    value={content.audit_button_label}
                    onChange={(e) => handleFieldChange('audit_button_label', e.target.value)}
                    placeholder="Get Free Audit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                  Contact Subheading *
                </label>
                <textarea
                  required
                  rows={2}
                  value={content.subheading}
                  onChange={(e) => handleFieldChange('subheading', e.target.value)}
                  placeholder="Schedule a free strategy audit..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                  Sticky Consultation Bar Text
                </label>
                <input
                  type="text"
                  value={content.consultation_cta_text}
                  onChange={(e) => handleFieldChange('consultation_cta_text', e.target.value)}
                  placeholder="Book Free 30-Min Growth Consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-150">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider border-b border-gray-150 pb-2 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#3D00D6]" />
                WhatsApp & Direct Contact Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    WhatsApp Number (Intl format, no +)
                  </label>
                  <input
                    type="text"
                    value={content.whatsapp_number}
                    onChange={(e) => handleFieldChange('whatsapp_number', e.target.value)}
                    placeholder="918526462969"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Display Phone Number
                  </label>
                  <input
                    type="text"
                    value={content.contact_phone}
                    onChange={(e) => handleFieldChange('contact_phone', e.target.value)}
                    placeholder="+91 85264 62969"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Agency Email Address
                  </label>
                  <input
                    type="email"
                    value={content.contact_email}
                    onChange={(e) => handleFieldChange('contact_email', e.target.value)}
                    placeholder="thethreeamigosdm@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                    Office Address / Location
                  </label>
                  <input
                    type="text"
                    value={content.office_address}
                    onChange={(e) => handleFieldChange('office_address', e.target.value)}
                    placeholder="Chennai, India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                  />
                </div>
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
                  <span>Save CTA & Contact Settings</span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
