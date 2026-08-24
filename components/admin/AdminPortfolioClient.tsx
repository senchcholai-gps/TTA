'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban,
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
  FileText,
  MessageSquareQuote,
  Building2,
  Image as ImageIcon,
  Settings,
  User,
  ArrowLeft,
  Upload,
  Video,
  Film,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  AdminPortfolioItem,
  getAllAdminPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadMediaFile
} from '@/lib/supabase/cms'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/admin/Modal'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminPortfolioClientProps {
  userEmail: string
  initialItems: AdminPortfolioItem[]
}

const CATEGORIES = [
  'Long-form YouTube Videos',
  'Instagram Reels & Short-form Content',
  'Pages We Manage'
]

function getYoutubeId(url: string): string {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/)
  return match ? match[1] : ''
}

function getReelId(url: string): string {
  const match = url?.match(/\/reel(?:s)?\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : ''
}

function getSourceThumbnailUrl(url: string): string {
  const yt = getYoutubeId(url)
  if (yt) return `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`
  const reel = getReelId(url)
  if (reel) return `https://images.weserv.nl/?url=https://www.instagram.com/p/${reel}/media/?size=l`
  return ''
}

export default function AdminPortfolioClient({ userEmail, initialItems }: AdminPortfolioClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminPortfolioItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminPortfolioItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminPortfolioItem | null>(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)

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
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [mediaType, setMediaType] = useState('video')
  const [mediaUrl, setMediaUrl] = useState('')
  const [thumbnailMode, setThumbnailMode] = useState<'source' | 'custom'>('source')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [published, setPublished] = useState(true)

  const refreshItems = async () => {
    setIsLoading(true)
    const data = await getAllAdminPortfolioItems()
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
    setTitle('')
    setDescription('')
    setCategory(CATEGORIES[0])
    setMediaType('video')
    setMediaUrl('')
    setThumbnailMode('source')
    setThumbnailUrl('')
    setClientName('')
    setDisplayOrder(items.length + 1)
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminPortfolioItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setDescription(item.description)
    setCategory(item.category)
    setMediaType(item.media_type)
    setMediaUrl(item.media_url)
    const autoThumb = getSourceThumbnailUrl(item.media_url)
    if (item.thumbnail_url && item.thumbnail_url !== autoThumb) {
      setThumbnailMode('custom')
      setThumbnailUrl(item.thumbnail_url)
    } else {
      setThumbnailMode('source')
      setThumbnailUrl(item.thumbnail_url || autoThumb)
    }
    setClientName(item.client_name || '')
    setDisplayOrder(item.display_order)
    setPublished(item.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingMedia(true)
    setFormError('')

    const { url, error } = await uploadMediaFile('portfolio', file)
    setIsUploadingMedia(false)

    if (error) {
      setFormError(error)
    } else if (url) {
      setMediaUrl(url)
    }
  }

  const handleThumbnailFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingThumbnail(true)
    setFormError('')

    const { url, error } = await uploadMediaFile('portfolio', file)
    setIsUploadingThumbnail(false)

    if (error) {
      setFormError(error)
    } else if (url) {
      setThumbnailUrl(url)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    let finalThumbnail = thumbnailUrl.trim()
    if (thumbnailMode === 'source') {
      finalThumbnail = getSourceThumbnailUrl(mediaUrl) || ''
    }

    if (!title.trim() || !description.trim() || !mediaUrl.trim()) {
      setFormError('Title, description, and media asset URL are required.')
      return
    }

    if (thumbnailMode === 'custom' && !finalThumbnail) {
      setFormError('Please upload or enter a custom thumbnail image URL.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      media_type: mediaType,
      media_url: mediaUrl.trim(),
      thumbnail_url: finalThumbnail,
      client_name: clientName.trim() || null,
      display_order: Number(displayOrder) || 0,
      published,
    }

    if (editingItem) {
      const { error } = await updatePortfolioItem(editingItem.id, payload)
      if (error) {
        setFormError(error)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await createPortfolioItem(payload)
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

  const handleTogglePublish = async (item: AdminPortfolioItem) => {
    const { error } = await updatePortfolioItem(item.id, { published: !item.published })
    if (!error) {
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const { error } = await deletePortfolioItem(deleteConfirmItem.id)
    setIsSubmitting(false)
    setDeleteConfirmItem(null)
    if (!error) {
      await refreshItems()
    }
  }

  // Search, Filter & Sort States
  const [sortBy, setSortBy] = useState<'display_order' | 'title' | 'category'>('display_order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const isDirectVideoUrl = (url: string) => {
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.includes('supabase.co/storage')
    )
  }

  // Combined Search, Filter & Sort Computation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.client_name && item.client_name.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)

        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory

        const matchesStatus =
          selectedStatus === 'All' ||
          (selectedStatus === 'Published' && item.published) ||
          (selectedStatus === 'Draft' && !item.published)

        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'display_order') {
          comp = (a.display_order || 0) - (b.display_order || 0)
        } else if (sortBy === 'title') {
          comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        } else if (sortBy === 'category') {
          comp = a.category.localeCompare(b.category, undefined, { numeric: true, sensitivity: 'base' })
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [items, searchQuery, selectedCategory, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Portfolio" />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/portfolio" />

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
                <span className="text-xs font-bold text-brand-purple">Portfolio</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-black mt-1">
                Portfolio CMS Management
              </h1>
              <p className="text-xs text-neutral-black/60 font-medium">
                Create and manage video & image portfolio entries with direct file upload.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-3 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Portfolio Item</span>
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
                placeholder="Search portfolio title, description, or client..."
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

            {/* Category Filter, Status Filter & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
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
                onChange={(e) => setSortBy(e.target.value as 'display_order' | 'title' | 'category')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="display_order">Sort by Order</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
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

          {/* Portfolio Table / List */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-brand-purple" />
                <span>Loading Portfolio Records...</span>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
                  <FolderKanban size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-black">
                    {items.length === 0 ? 'No portfolio items yet' : 'No matching portfolio items'}
                  </h3>
                  <p className="text-xs text-neutral-black/50">
                    {items.length === 0
                      ? 'Click "Add Portfolio Item" above to create your first record.'
                      : 'No items match your active search or filter criteria.'}
                  </p>
                </div>
                {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
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
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-14 rounded-xl bg-slate-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-[8px] font-black text-white uppercase rounded">
                          {item.media_type}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-purple/5 border border-brand-purple/10 text-brand-purple">
                            {item.category}
                          </span>
                          {item.client_name && (
                            <span className="text-[10px] font-bold text-neutral-black/60 bg-slate-100 px-2 py-0.5 rounded">
                              {item.client_name}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-neutral-black/40">
                            Order: #{item.display_order}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-black leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-black/60 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

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
                        title="Edit Item"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-2 text-neutral-black/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer"
                        title="Delete Item"
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

      {/* Create / Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
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
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Student Visa Interview Success Guide"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the video content or campaign..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Media Type *
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none cursor-pointer"
              >
                <option value="video">video</option>
                <option value="image">image</option>
              </select>
            </div>
          </div>

          {/* MAIN PORTFOLIO MEDIA (media_url) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black flex items-center gap-1.5">
              {mediaType === 'video' ? <Video size={14} className="text-brand-purple" /> : <ImageIcon size={14} className="text-brand-purple" />}
              Main Portfolio Media URL ({mediaType.toUpperCase()}) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={mediaType === 'video' ? 'e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/...' : 'e.g. https://images.unsplash.com/... or upload below'}
                className="flex-grow px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-brand-purple outline-none"
              />
              <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black cursor-pointer transition flex items-center gap-1.5 flex-shrink-0">
                <Upload size={14} className="text-brand-purple" />
                <span>{isUploadingMedia ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleMediaFileUpload}
                  disabled={isUploadingMedia}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-neutral-black/40 font-medium">
              Paste a YouTube, Instagram Reel, or video URL directly, or click "Upload File" to upload a local media asset.
            </p>
          </div>

          {/* THUMBNAIL COVER (thumbnail_url) */}
          <div className="space-y-3 p-4 bg-slate-50 border border-gray-200 rounded-2xl">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black flex items-center gap-1.5">
              <ImageIcon size={14} className="text-brand-purple" />
              Thumbnail Option *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-2 text-xs font-bold p-3 rounded-xl border transition cursor-pointer ${
                thumbnailMode === 'source' ? 'bg-brand-purple/5 border-brand-purple text-brand-purple' : 'bg-white border-gray-200 text-neutral-black'
              }`}>
                <input
                  type="radio"
                  name="thumbnailMode"
                  checked={thumbnailMode === 'source'}
                  onChange={() => {
                    setThumbnailMode('source')
                  }}
                  className="text-brand-purple focus:ring-brand-purple"
                />
                <span>Use source/default thumbnail</span>
              </label>

              <label className={`flex items-center gap-2 text-xs font-bold p-3 rounded-xl border transition cursor-pointer ${
                thumbnailMode === 'custom' ? 'bg-brand-purple/5 border-brand-purple text-brand-purple' : 'bg-white border-gray-200 text-neutral-black'
              }`}>
                <input
                  type="radio"
                  name="thumbnailMode"
                  checked={thumbnailMode === 'custom'}
                  onChange={() => setThumbnailMode('custom')}
                  className="text-brand-purple focus:ring-brand-purple"
                />
                <span>Upload custom thumbnail</span>
              </label>
            </div>

            {thumbnailMode === 'custom' ? (
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Upload image below or paste custom image URL"
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-neutral-black focus:border-brand-purple outline-none"
                  />
                  <label className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black cursor-pointer transition flex items-center gap-1.5 flex-shrink-0">
                    <Upload size={14} className="text-brand-purple" />
                    <span>{isUploadingThumbnail ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileUpload}
                      disabled={isUploadingThumbnail}
                      className="hidden"
                    />
                  </label>
                </div>

                {thumbnailUrl && (
                  <div className="p-2 bg-white border border-gray-150 rounded-xl flex items-center justify-between">
                    <img src={thumbnailUrl} alt="Preview" className="h-20 max-w-[120px] object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <X size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2">
                {getSourceThumbnailUrl(mediaUrl) ? (
                  <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-200 rounded-xl">
                    <img
                      src={getSourceThumbnailUrl(mediaUrl)}
                      alt="Source Preview"
                      className="w-24 h-14 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-emerald-700 block">✓ Source thumbnail auto-detected</span>
                      <span className="text-[10px] text-neutral-black/50 truncate block">{getSourceThumbnailUrl(mediaUrl)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-black/60 bg-white p-3 rounded-xl border border-gray-150 font-medium">
                    The thumbnail will be automatically derived from the video URL (e.g. YouTube or Instagram Reel).
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Client Name (Optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. EduCorp Abroad"
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
              id="publishedCheckbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple cursor-pointer"
            />
            <label htmlFor="publishedCheckbox" className="text-xs font-bold text-neutral-black cursor-pointer">
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
              disabled={isSubmitting || isUploadingMedia || isUploadingThumbnail}
              className="px-5 py-2.5 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingItem ? 'Update Portfolio Item' : 'Add Portfolio Item'}</span>
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
                <h3 className="text-base font-black text-neutral-black">Delete Portfolio Item?</h3>
                <p className="text-xs text-neutral-black/60">
                  Are you sure you want to delete <span className="font-bold text-neutral-black">"{deleteConfirmItem.title}"</span>? This will remove the item record from Supabase.
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
