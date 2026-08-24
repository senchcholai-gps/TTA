'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
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
  MessageSquareQuote,
  Building2,
  Image as ImageIcon,
  Settings,
  User,
  ArrowLeft,
  Upload,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  AdminBlogPostItem,
  getAllAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage
} from '@/lib/supabase/cms'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/admin/Modal'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminBlogClientProps {
  userEmail: string
  initialItems: AdminBlogPostItem[]
}

function formatDateDeterministic(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Unpublished'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'Unpublished'
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

export default function AdminBlogClient({ userEmail, initialItems }: AdminBlogClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminBlogPostItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminBlogPostItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminBlogPostItem | null>(null)
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
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [published, setPublished] = useState(true)

  const refreshItems = async () => {
    setIsLoading(true)
    const data = await getAllAdminBlogPosts()
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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!editingItem) {
      setSlug(generateSlug(val))
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setThumbnailUrl('')
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminBlogPostItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setSlug(item.slug)
    setExcerpt(item.excerpt)
    setContent(item.content)
    setThumbnailUrl(item.thumbnail_url)
    setPublished(item.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setFormError('')

    const { url, error } = await uploadBlogImage(file)
    setIsUploading(false)

    if (error) {
      setFormError(error)
    } else if (url) {
      setThumbnailUrl(url)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim() || !thumbnailUrl.trim()) {
      setFormError('Title, slug, excerpt, content, and cover thumbnail image are required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      published,
      published_at: published ? new Date().toISOString() : null,
    }

    if (editingItem) {
      const { error } = await updateBlogPost(editingItem.id, payload)
      if (error) {
        setFormError(error)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await createBlogPost(payload)
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

  const handleTogglePublish = async (item: AdminBlogPostItem) => {
    const nextPublished = !item.published
    const { error } = await updateBlogPost(item.id, {
      published: nextPublished,
      published_at: nextPublished ? new Date().toISOString() : null,
    })
    if (!error) {
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const { error } = await deleteBlogPost(deleteConfirmItem.id)
    setIsSubmitting(false)
    setDeleteConfirmItem(null)
    if (!error) {
      await refreshItems()
    }
  }

  // Search, Filter & Sort States
  const [sortBy, setSortBy] = useState<'published_at' | 'title'>('published_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Combined Search, Filter & Sort Computation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)

        const matchesStatus =
          selectedStatus === 'All' ||
          (selectedStatus === 'Published' && item.published) ||
          (selectedStatus === 'Draft' && !item.published)

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'published_at') {
          const dateA = Date.parse(a.published_at || a.created_at || '') || 0
          const dateB = Date.parse(b.published_at || b.created_at || '') || 0
          comp = dateA - dateB
        } else if (sortBy === 'title') {
          comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [items, searchQuery, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Blog" />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/blog" />

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
                <span className="text-xs font-bold text-[#6D0091]">Blog</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Blog Article CMS Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Publish and manage agency blog posts and cover image assets.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-3 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Blog Post</span>
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
                placeholder="Search blog title, slug, or content..."
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
                onChange={(e) => setSortBy(e.target.value as 'published_at' | 'title')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="published_at">Sort by Date</option>
                <option value="title">Sort by Title</option>
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

          {/* Blog Posts List */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-brand-purple" />
                <span>Loading Blog Articles...</span>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
                  <FileText size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-black">
                    {items.length === 0 ? 'No blog articles yet' : 'No matching blog articles'}
                  </h3>
                  <p className="text-xs text-neutral-black/50">
                    {items.length === 0
                      ? 'Click "Create New Article" above to publish your first post.'
                      : 'No articles match your active search filter.'}
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
              <div className="divide-y divide-gray-150">
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Cover Thumbnail */}
                      <div className="w-24 h-16 rounded-xl bg-slate-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-brand-purple bg-brand-purple/5 border border-brand-purple/10 px-2 py-0.5 rounded">
                            /{item.slug}
                          </span>
                          <span className="text-[10px] font-semibold text-neutral-black/40 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDateDeterministic(item.published_at)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-black leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-black/60 line-clamp-1">
                          {item.excerpt}
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
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-2 text-neutral-black/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer"
                        title="Delete Article"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Blog Article' : 'Create New Blog Article'}
        maxWidth="max-w-2xl"
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
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. 30-Day Content Strategy Guide for Brands"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="30-day-content-strategy-guide"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-brand-purple focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Excerpt / Summary *
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary displayed on blog cards..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Full Article Content *
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full article content in markdown or text..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          {/* STANDARDIZED COVER / THUMBNAIL IMAGE UPLOAD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black flex items-center gap-1.5">
              <ImageIcon size={14} className="text-brand-purple" />
              Cover / Thumbnail Image *
            </label>

            {thumbnailUrl ? (
              <div className="p-3 bg-white border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-neutral-black/60">
                    Cover Image Preview
                  </span>
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
                      onClick={() => setThumbnailUrl('')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <X size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 border border-gray-150 rounded-xl flex items-center justify-center min-h-[140px] overflow-hidden">
                  <img src={thumbnailUrl} alt="Cover Preview" className="h-40 max-w-full object-cover rounded-lg" />
                </div>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-gray-200 hover:border-brand-purple rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-brand-purple/5 transition cursor-pointer">
                <Upload size={24} className="text-brand-purple" />
                <span className="text-xs font-bold text-neutral-black">
                  {isUploading ? 'Uploading Cover Image to Storage...' : 'Upload Cover Image'}
                </span>
                <span className="text-[10px] text-neutral-black/40 font-semibold">
                  Supports PNG, JPG, WEBP
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
                <span>{editingItem ? 'Update Article' : 'Create Article'}</span>
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
                <h3 className="text-base font-black text-neutral-black">Delete Blog Article?</h3>
                <p className="text-xs text-neutral-black/60">
                  Are you sure you want to delete <span className="font-bold text-neutral-black">"{deleteConfirmItem.title}"</span>? This will remove the post record from Supabase.
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
