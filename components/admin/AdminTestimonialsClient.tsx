'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquareQuote,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Loader2,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  FileText,
  Building2,
  Image as ImageIcon,
  Settings,
  User,
  ArrowLeft,
  Star,
  Upload,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  AdminTestimonialItem,
  getAllAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadMediaFile,
  defaultStaticTestimonials
} from '@/lib/supabase/cms'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/admin/Modal'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminTestimonialsClientProps {
  userEmail: string
  initialItems: AdminTestimonialItem[]
  initialIsFallback?: boolean
}

export default function AdminTestimonialsClient({
  userEmail,
  initialItems,
  initialIsFallback = false,
}: AdminTestimonialsClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminTestimonialItem[]>(initialItems)
  const [isFallback, setIsFallback] = useState<boolean>(initialIsFallback)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRating, setSelectedRating] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminTestimonialItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminTestimonialItem | null>(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  React.useEffect(() => {
    if (isModalOpen || deleteConfirmItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, deleteConfirmItem])

  // Form Fields
  const [clientName, setClientName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [rating, setRating] = useState(5)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [published, setPublished] = useState(true)

  const refreshItems = async () => {
    setIsLoading(true)
    const data = await getAllAdminTestimonials()
    setItems(data)
    setIsLoading(false)
    router.refresh()
  }

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

  const openCreateModal = () => {
    setEditingItem(null)
    setClientName('')
    setCompany('')
    setRole('')
    setTestimonial('')
    setRating(5)
    setAvatarUrl('')
    setDisplayOrder(items.length + 1)
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminTestimonialItem) => {
    setEditingItem(item)
    setClientName(item.client_name)
    setCompany(item.company)
    setRole(item.role)
    setTestimonial(item.testimonial)
    setRating(item.rating)
    setAvatarUrl(item.avatar_url || '')
    setDisplayOrder(item.display_order)
    setPublished(item.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    setFormError('')

    const { url, error } = await uploadMediaFile('testimonials', file)
    setIsUploadingAvatar(false)

    if (error) {
      setFormError(error)
    } else if (url) {
      setAvatarUrl(url)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim() || !company.trim() || !role.trim() || !testimonial.trim()) {
      setFormError('Client name, company, role, and testimonial quote are required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      client_name: clientName.trim(),
      company: company.trim(),
      role: role.trim(),
      testimonial: testimonial.trim(),
      rating: Number(rating) || 5,
      avatar_url: avatarUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
      published,
    }

    if (editingItem) {
      const { error } = await updateTestimonial(editingItem.id, payload)
      if (error) {
        setFormError(error)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await createTestimonial(payload)
      if (error) {
        setFormError(error)
        setIsSubmitting(false)
        return
      }
    }

    setIsSubmitting(false)
    setIsModalOpen(false)
    await refreshItems()
  }

  const handleTogglePublish = async (item: AdminTestimonialItem) => {
    const { error } = await updateTestimonial(item.id, { published: !item.published })
    if (!error) {
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const { error } = await deleteTestimonial(deleteConfirmItem.id)
    setIsSubmitting(false)
    setDeleteConfirmItem(null)
    if (!error) {
      await refreshItems()
    }
  }

  // Search, Filter & Sort States
  const [sortBy, setSortBy] = useState<'display_order' | 'client_name' | 'rating'>('display_order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Combined Search, Filter & Sort Computation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.client_name.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query) ||
          item.testimonial.toLowerCase().includes(query)

        const matchesRating =
          selectedRating === 'All' || item.rating === Number(selectedRating)

        const matchesStatus =
          selectedStatus === 'All' ||
          (selectedStatus === 'Published' && item.published) ||
          (selectedStatus === 'Draft' && !item.published)

        return matchesSearch && matchesRating && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'display_order') {
          comp = (a.display_order || 0) - (b.display_order || 0)
        } else if (sortBy === 'client_name') {
          comp = a.client_name.localeCompare(b.client_name, undefined, { numeric: true, sensitivity: 'base' })
        } else if (sortBy === 'rating') {
          comp = (a.rating || 0) - (b.rating || 0)
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [items, searchQuery, selectedRating, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Testimonials" />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/testimonials" />

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <a href="/admin" className="text-xs font-bold text-neutral-400 hover:text-[#3D00D6] transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} />
                  Dashboard
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-[#6D0091]">Testimonials</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Testimonials CMS Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage client reviews with direct avatar image upload.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-3 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Testimonial</span>
            </button>
          </div>

          {/* Filters & Sorting Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input with In-Field X Clear Button */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client name, company, or quote..."
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchQuery('')
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-neutral-black transition cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                <option value="4">4 Stars ⭐⭐⭐⭐</option>
                <option value="3">3 Stars ⭐⭐⭐</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'display_order' | 'client_name' | 'rating')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="display_order">Sort by Order</option>
                <option value="client_name">Sort by Client</option>
                <option value="rating">Sort by Rating</option>
              </select>

              <button
                type="button"
                onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black transition cursor-pointer flex items-center justify-center gap-1"
                title={`Current direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortDirection === 'asc' ? <ArrowUp size={14} className="text-brand-purple" /> : <ArrowDown size={14} className="text-[#D6003C]" />}
                <span className="uppercase text-[10px] font-black">{sortDirection}</span>
              </button>
            </div>
          </div>

          {/* Testimonials List */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-brand-purple" />
                <span>Loading Testimonial Records...</span>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
                  <MessageSquareQuote size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-black">
                    {items.length === 0 ? 'No testimonials yet' : 'No matching testimonials'}
                  </h3>
                  <p className="text-xs text-neutral-black/50">
                    {items.length === 0
                      ? 'Click "Add Testimonial" above to create your first record.'
                      : 'No testimonials match your active search or filter criteria.'}
                  </p>
                </div>
                {(searchQuery || selectedRating !== 'All' || selectedStatus !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedRating('All')
                      setSelectedStatus('All')
                    }}
                    className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Clear Filters &amp; Reset</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-150">
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Avatar / Initial */}
                      <div className="w-12 h-12 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-black flex items-center justify-center flex-shrink-0 text-sm overflow-hidden">
                        {item.avatar_url ? (
                          <img src={item.avatar_url} alt={item.client_name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{item.client_name.charAt(0)}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-neutral-black">{item.client_name}</span>
                          <span className="text-[11px] font-medium text-neutral-black/60">
                            • {item.role}, <span className="font-bold text-neutral-black/80">{item.company}</span>
                          </span>
                          {item.id.startsWith('static-') && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-gray-200 text-neutral-500 rounded text-[9px] font-extrabold uppercase">
                              Static Fallback
                            </span>
                          )}
                          <div className="flex items-center text-amber-400 text-[10px]">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} size={11} fill="currentColor" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-black/70 italic line-clamp-2">
                          &ldquo;{item.testimonial}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                          item.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {item.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.published ? 'Published' : 'Draft'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-black/60 hover:text-brand-purple hover:bg-slate-100 rounded-lg border border-transparent hover:border-gray-200 transition cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-2 text-neutral-black/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
        maxWidth="max-w-lg"
      >
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Executive Partner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Company *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. EduAbroad Global"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Role / Position *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Head of Marketing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Testimonial Endorsement Quote *
            </label>
            <textarea
              required
              rows={3}
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Detailed endorsement outlining client experience..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Rating (1 to 5 Stars) *
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Display Order Number
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
            </div>
          </div>

          {/* STANDARDIZED AVATAR/LOGO IMAGE UPLOAD */}
          <div className="space-y-2 p-3.5 bg-slate-50 border border-gray-200 rounded-2xl">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black flex items-center gap-1.5">
              <ImageIcon size={14} className="text-brand-purple" />
              Client Logo / Avatar Image (Optional)
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Paste image/logo URL or upload file"
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-neutral-black focus:border-brand-purple outline-none"
              />
              <label className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black cursor-pointer transition flex items-center gap-1.5 flex-shrink-0">
                <Upload size={14} className="text-brand-purple" />
                <span>{isUploadingAvatar ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  disabled={isUploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            {avatarUrl && (
              <div className="p-2 bg-white border border-gray-150 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border border-gray-200 overflow-hidden bg-white shadow-xs flex items-center justify-center flex-shrink-0">
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-contain p-1" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-black/70 truncate max-w-xs">
                    {avatarUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publishedTestimonial"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple cursor-pointer"
            />
            <label htmlFor="publishedTestimonial" className="text-xs font-bold text-neutral-black cursor-pointer">
              Publish immediately on live website
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black/70 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingAvatar}
              className="px-5 py-2.5 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingItem ? 'Update Testimonial' : 'Add Testimonial'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md p-6 space-y-5"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <Trash2 size={20} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-neutral-black">Delete Testimonial?</h3>
                <p className="text-xs text-neutral-black/60">
                  Are you sure you want to delete the testimonial for <span className="font-bold text-neutral-black">"{deleteConfirmItem.client_name}"</span>? This will remove the record from Supabase.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="w-1/2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black/70 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>Delete Record</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
