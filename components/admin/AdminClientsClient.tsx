'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
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
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  User,
  ArrowLeft,
  ExternalLink,
  Upload,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  AdminClientLogoItem,
  getAllAdminClientLogos,
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
  uploadClientLogoImage
} from '@/lib/supabase/cms'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/admin/Modal'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminClientsClientProps {
  userEmail: string
  initialItems: AdminClientLogoItem[]
}

export default function AdminClientsClient({ userEmail, initialItems }: AdminClientsClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminClientLogoItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminClientLogoItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminClientLogoItem | null>(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [published, setPublished] = useState(true)

  const refreshItems = async () => {
    setIsLoading(true)
    const data = await getAllAdminClientLogos()
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
    setName('')
    setLogoUrl('')
    setWebsiteUrl('')
    setDisplayOrder(items.length + 1)
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminClientLogoItem) => {
    setEditingItem(item)
    setName(item.name)
    setLogoUrl(item.logo_url)
    setWebsiteUrl(item.website_url || '')
    setDisplayOrder(item.display_order)
    setPublished(item.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setFormError('')

    const { url, error } = await uploadClientLogoImage(file)
    setIsUploading(false)

    if (error) {
      setFormError(error)
    } else if (url) {
      setLogoUrl(url)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !logoUrl.trim()) {
      setFormError('Client name and logo image are required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      name: name.trim(),
      logo_url: logoUrl.trim(),
      website_url: websiteUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
      published,
    }

    if (editingItem) {
      const { error } = await updateClientLogo(editingItem.id, payload)
      if (error) {
        setFormError(error)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await createClientLogo(payload)
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

  const handleTogglePublish = async (item: AdminClientLogoItem) => {
    const { error } = await updateClientLogo(item.id, { published: !item.published })
    if (!error) {
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const { error } = await deleteClientLogo(deleteConfirmItem.id)
    setIsSubmitting(false)
    setDeleteConfirmItem(null)
    if (!error) {
      await refreshItems()
    }
  }

  // Search, Filter & Sort States
  const [sortBy, setSortBy] = useState<'display_order' | 'name'>('display_order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Combined Search, Filter & Sort Computation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          (item.website_url && item.website_url.toLowerCase().includes(query))

        const matchesStatus =
          selectedStatus === 'All' ||
          (selectedStatus === 'Published' && item.published) ||
          (selectedStatus === 'Draft' && !item.published)

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'display_order') {
          comp = (a.display_order || 0) - (b.display_order || 0)
        } else if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [items, searchQuery, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Clients" />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/clients" />

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
                <span className="text-xs font-bold text-[#6D0091]">Clients</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Client Logos CMS Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage partner logos displayed in the homepage animated marquee.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-3 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Client Logo</span>
            </button>
          </div>

          {/* Filters & Sorting Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input with In-Field X Clear Button */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client name or website URL..."
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

            {/* Status & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
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
                onChange={(e) => setSortBy(e.target.value as 'display_order' | 'name')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="display_order">Sort by Order</option>
                <option value="name">Sort by Name</option>
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

          {/* Client Logos Grid */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-brand-purple" />
                <span>Loading Client Logo Records...</span>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
                  <Building2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-black">
                    {items.length === 0 ? 'No client logos yet' : 'No matching client logos'}
                  </h3>
                  <p className="text-xs text-neutral-black/50">
                    {items.length === 0
                      ? 'Click "Add Client Logo" above to upload your first logo.'
                      : 'No records match your active search filter.'}
                  </p>
                </div>
                {(searchQuery || selectedStatus !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedStatus('All')
                    }}
                    className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Clear Filters &amp; Reset</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-brand-purple/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      {/* Logo Preview Container preserving natural aspect ratio */}
                      <div className="h-24 w-full rounded-xl bg-slate-50 border border-gray-150 p-3 flex items-center justify-center overflow-hidden relative">
                        <img
                          src={item.logo_url}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter contrast-[1.05]"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <span className="absolute top-2 left-2 text-[9px] font-black uppercase text-neutral-black/40 bg-white/80 px-1.5 py-0.5 rounded border border-gray-200">
                          Order: #{item.display_order}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-neutral-black flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.website_url && (
                            <a
                              href={item.website_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-black/40 hover:text-brand-purple transition"
                              title="Visit Client Website"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </h4>
                        {item.website_url && (
                          <p className="text-[11px] font-medium text-neutral-black/50 truncate">
                            {item.website_url}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border transition flex items-center gap-1 cursor-pointer ${
                          item.published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {item.published ? <Eye size={11} /> : <EyeOff size={11} />}
                        <span>{item.published ? 'Published' : 'Draft'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-neutral-black/60 hover:text-brand-purple hover:bg-slate-100 rounded-lg border border-transparent hover:border-gray-200 transition cursor-pointer"
                          title="Edit Client Logo"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 text-neutral-black/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer"
                          title="Delete Client Logo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
        title={editingItem ? 'Edit Client Logo' : 'Add New Client Logo'}
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
              Client / Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maven Consulting"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          {/* STANDARDIZED CLIENT LOGO IMAGE UPLOAD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black flex items-center gap-1.5">
              <ImageIcon size={14} className="text-brand-purple" />
              Client Logo Image *
            </label>

            {logoUrl ? (
              <div className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl border border-gray-200 p-1.5 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-neutral-black truncate max-w-xs">
                    Logo Uploaded
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black cursor-pointer transition flex items-center gap-1.5">
                    <Upload size={13} className="text-brand-purple" />
                    <span>Change / Replace</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-gray-200 hover:border-brand-purple rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-brand-purple/5 transition cursor-pointer">
                <Upload size={24} className="text-brand-purple" />
                <span className="text-xs font-bold text-neutral-black">
                  {isUploading ? 'Uploading Logo to Storage...' : 'Upload Client Logo'}
                </span>
                <span className="text-[10px] text-neutral-black/40 font-semibold">
                  Supports PNG, JPG, WEBP, SVG
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Website URL (Optional)
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://client-brand.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
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

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publishedLogo"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple cursor-pointer"
            />
            <label htmlFor="publishedLogo" className="text-xs font-bold text-neutral-black cursor-pointer">
              Publish immediately on public website marquee
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
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingItem ? 'Update Client Logo' : 'Add Client Logo'}</span>
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
                <h3 className="text-base font-black text-neutral-black">Delete Client Logo?</h3>
                <p className="text-xs text-neutral-black/60">
                  Are you sure you want to delete <span className="font-bold text-neutral-black">"{deleteConfirmItem.name}"</span>? This will remove the logo record from Supabase.
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
