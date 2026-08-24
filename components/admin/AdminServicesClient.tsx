'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  ArrowLeft,
  Plus,
  Edit2,
  Check,
  AlertCircle,
  Sparkles,
  Share2,
  Video,
  Target,
  Mail,
  Award,
  Users,
  TrendingUp,
  BarChart3,
  Rocket,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Modal from '@/components/admin/Modal'
import {
  AdminServiceItem,
  getAllAdminServices,
  createService,
  updateService,
  deleteService
} from '@/lib/supabase/cms'

interface AdminServicesClientProps {
  userEmail: string
  initialServices: AdminServiceItem[]
}

const AVAILABLE_ICONS = [
  'Sparkles',
  'Share2',
  'Video',
  'Target',
  'Mail',
  'Award',
  'Briefcase',
  'Users',
  'TrendingUp',
  'BarChart3',
  'Rocket'
]

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Share2,
  Video,
  Target,
  Mail,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  BarChart3,
  Rocket
}

function getServiceIcon(iconName: string) {
  return ICON_MAP[iconName] || Briefcase
}

export default function AdminServicesClient({ userEmail, initialServices }: AdminServicesClientProps) {
  const router = useRouter()
  const [services, setServices] = useState<AdminServiceItem[]>(initialServices)

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'display_order' | 'title'>('display_order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Modal & Form States
  const [editingService, setEditingService] = useState<AdminServiceItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminServiceItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState(AVAILABLE_ICONS[0])
  const [subServices, setSubServices] = useState<string[]>([])
  const [displayOrder, setDisplayOrder] = useState(0)
  const [published, setPublished] = useState(true)

  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const refreshItems = async () => {
    const data = await getAllAdminServices()
    if (data && data.length > 0) {
      setServices(data)
    }
    router.refresh()
  }

  const openCreateModal = () => {
    setEditingService(null)
    setTitle('')
    setDescription('')
    setIcon(AVAILABLE_ICONS[0])
    setSubServices([])
    setDisplayOrder(services.length + 1)
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (service: AdminServiceItem) => {
    setEditingService(service)
    setTitle(service.title)
    setDescription(service.description)
    setIcon(service.icon || AVAILABLE_ICONS[0])
    setSubServices(service.sub_services || [])
    setDisplayOrder(service.display_order)
    setPublished(service.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      title: title.trim(),
      description: description.trim(),
      icon,
      sub_services: subServices.map((s) => s.trim()).filter(Boolean),
      display_order: Number(displayOrder) || 0,
      published,
    }

    if (editingService) {
      const { data: updated, error } = await updateService(editingService.id, payload)
      setIsSubmitting(false)
      if (error) {
        setFormError(error)
      } else {
        if (updated) {
          setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        }
        setIsModalOpen(false)
        setStatusMessage({ type: 'success', text: `Service "${payload.title}" updated successfully.` })
        await refreshItems()
      }
    } else {
      const { data: created, error } = await createService(payload)
      setIsSubmitting(false)
      if (error) {
        setFormError(error)
      } else {
        if (created) {
          setServices((prev) => [...prev, created])
        }
        setIsModalOpen(false)
        setStatusMessage({ type: 'success', text: `Service "${payload.title}" created successfully.` })
        await refreshItems()
      }
    }
  }

  const handleTogglePublish = async (service: AdminServiceItem) => {
    const nextPublished = !service.published
    // Optimistic local state update
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, published: nextPublished } : s))
    )

    const { error } = await updateService(service.id, { published: nextPublished })
    if (error) {
      setStatusMessage({ type: 'error', text: error })
      await refreshItems()
    } else {
      setStatusMessage({
        type: 'success',
        text: `Service "${service.title}" ${nextPublished ? 'published' : 'moved to draft'}.`,
      })
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const targetId = deleteConfirmItem.id
    const targetTitle = deleteConfirmItem.title

    // Optimistic deletion
    setServices((prev) => prev.filter((s) => s.id !== targetId))
    setDeleteConfirmItem(null)

    const { error } = await deleteService(targetId)
    setIsSubmitting(false)
    if (error) {
      setStatusMessage({ type: 'error', text: error })
      await refreshItems()
    } else {
      setStatusMessage({ type: 'success', text: `Deleted "${targetTitle}" service.` })
      await refreshItems()
    }
  }

  // Real-time Search & Sort Computation
  const filteredAndSortedServices = useMemo(() => {
    return services
      .filter((service) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)

        const matchesStatus =
          selectedStatus === 'All' ||
          (selectedStatus === 'Published' && service.published) ||
          (selectedStatus === 'Draft' && !service.published)

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let comp = 0
        if (sortBy === 'display_order') {
          comp = (a.display_order || 0) - (b.display_order || 0)
        } else if (sortBy === 'title') {
          comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [services, searchQuery, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Services" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/services" />

        <main className="lg:col-span-9 space-y-6">
          {/* Top Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <a href="/admin" className="text-xs font-bold text-neutral-400 hover:text-[#3D00D6] transition-colors flex items-center gap-1">
                  <ArrowLeft size={14} />
                  Dashboard
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-[#6D0091]">Services</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Agency Services CMS Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage service titles, descriptions, icons, and status in public.services Supabase table.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Feedback Banner */}
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

          {/* Toolbar: Search, Status Filter & Sorting */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input with In-field X Clear Button */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services title or description..."
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
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

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Draft Only</option>
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'display_order' | 'title')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none cursor-pointer"
              >
                <option value="display_order">Sort by Order</option>
                <option value="title">Sort by Title</option>
              </select>

              {/* Direction Toggle Button */}
              <button
                type="button"
                onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black transition cursor-pointer flex items-center justify-center gap-1"
                title={`Current direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortDirection === 'asc' ? <ArrowUp size={14} className="text-[#3D00D6]" /> : <ArrowDown size={14} className="text-[#D6003C]" />}
                <span className="uppercase text-[10px] font-black">{sortDirection}</span>
              </button>
            </div>
          </div>

          {/* Cards Grid or Empty State */}
          {filteredAndSortedServices.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
              <Briefcase size={40} className="mx-auto text-neutral-300" />
              <h3 className="text-base font-bold text-[#1A1A1A]">No Matching Services</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {searchQuery || selectedStatus !== 'All'
                  ? 'No services match your active search filter.'
                  : 'The public.services table currently contains 0 records.'}
              </p>
              {(searchQuery || selectedStatus !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedStatus('All')
                  }}
                  className="px-4 py-2 bg-[#3D00D6] text-white rounded-xl text-xs font-bold hover:bg-[#3D00D6]/90 transition cursor-pointer"
                >
                  Clear Filters &amp; Reset
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedServices.map((cat) => {
                const Icon = getServiceIcon(cat.icon)
                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:border-[#3D00D6]/30 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {/* Black-and-White Icon Appearance matching User Module */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6003C]/10 via-[#8B0095]/10 to-[#3D00D6]/10 text-neutral-black flex items-center justify-center shadow-xs">
                          <Icon size={20} className="text-neutral-black" />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(cat)}
                            title={cat.published ? 'Unpublish Service' : 'Publish Service'}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                              cat.published
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            }`}
                          >
                            {cat.published ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{cat.published ? 'Published' : 'Draft'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-neutral-700 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(cat)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                            #{cat.display_order}
                          </span>
                          <h3 className="text-base font-black text-[#1A1A1A]">{cat.title}</h3>
                        </div>
                        <p className="text-xs text-neutral-600 font-medium leading-relaxed mt-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-[11px] text-neutral-400 font-semibold flex items-center justify-between">
                      <span>Icon Key: {cat.icon}</span>
                      <span>Order #{cat.display_order}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service Record' : 'Create New Service'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Performance Marketing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
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
              placeholder="Provide service description..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Lucide Icon *
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none cursor-pointer"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
              />
            </div>
          </div>

          {/* Sub-Services / Technologies Editor */}
          <div className="space-y-2 pt-2 border-t border-gray-150">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Sub-Services / Technologies ({subServices.length})
              </label>
              <button
                type="button"
                onClick={() => setSubServices([...subServices, ''])}
                className="text-xs font-bold text-[#3D00D6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            {subServices.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No sub-services added. Click "Add Item" to add sub-techs.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {subServices.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub}
                      onChange={(e) => {
                        const updated = [...subServices]
                        updated[idx] = e.target.value
                        setSubServices(updated)
                      }}
                      placeholder={`Sub-service ${idx + 1}`}
                      className="flex-grow px-3 py-1.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSubServices(subServices.filter((_, i) => i !== idx))}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="published-service"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded text-[#3D00D6] focus:ring-[#3D00D6] cursor-pointer"
            />
            <label htmlFor="published-service" className="text-xs font-bold text-[#1A1A1A] cursor-pointer">
              Publish immediately
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-black rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#3D00D6] hover:bg-[#3D00D6]/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Service</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <Modal
          isOpen={Boolean(deleteConfirmItem)}
          onClose={() => setDeleteConfirmItem(null)}
          title="Confirm Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-neutral-700 leading-relaxed font-medium">
              Are you sure you want to delete <span className="font-black text-[#1A1A1A]">"{deleteConfirmItem.title}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-black rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
