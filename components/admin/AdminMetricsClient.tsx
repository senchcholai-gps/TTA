'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check
} from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Modal from '@/components/admin/Modal'
import { AdminMetricItem, getAllAdminMetrics, createMetric, updateMetric, deleteMetric } from '@/lib/supabase/cms'

interface AdminMetricsClientProps {
  userEmail: string
  initialItems: AdminMetricItem[]
}

export default function AdminMetricsClient({ userEmail, initialItems }: AdminMetricsClientProps) {
  const router = useRouter()
  const [items, setItems] = useState<AdminMetricItem[]>(initialItems)

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'display_order' | 'title' | 'target_value'>('display_order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Modal & Confirmation States
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AdminMetricItem | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<AdminMetricItem | null>(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [targetValue, setTargetValue] = useState<number>(100)
  const [startValue, setStartValue] = useState<number>(0)
  const [suffix, setSuffix] = useState('+')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [published, setPublished] = useState(true)

  const refreshItems = async () => {
    setIsLoading(true)
    try {
      const data = await getAllAdminMetrics()
      if (data && data.length > 0) {
        setItems(data)
      }
    } catch {
      // Expose if needed
    }
    setIsLoading(false)
    router.refresh()
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setTargetValue(100)
    setStartValue(0)
    setSuffix('+')
    setDescription('')
    setDisplayOrder(items.length + 1)
    setPublished(true)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: AdminMetricItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setTargetValue(item.target_value)
    setStartValue(item.start_value)
    setSuffix(item.suffix)
    setDescription(item.description || '')
    setDisplayOrder(item.display_order)
    setPublished(item.published)
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setFormError('Metric title is required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload = {
      title: title.trim(),
      target_value: Number(targetValue) || 0,
      start_value: Number(startValue) || 0,
      suffix: suffix.trim(),
      description: description.trim() || null,
      display_order: Number(displayOrder) || 0,
      published,
    }

    if (editingItem) {
      const { data: updated, error } = await updateMetric(editingItem.id, payload)
      setIsSubmitting(false)
      if (error) {
        setFormError(error)
      } else {
        if (updated) {
          setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
        }
        setIsModalOpen(false)
        setStatusMessage({ type: 'success', text: `Metric "${payload.title}" updated successfully.` })
        await refreshItems()
      }
    } else {
      const { data: created, error } = await createMetric(payload)
      setIsSubmitting(false)
      if (error) {
        setFormError(error)
      } else {
        if (created) {
          setItems((prev) => [...prev, created])
        }
        setIsModalOpen(false)
        setStatusMessage({ type: 'success', text: `Metric "${payload.title}" created successfully.` })
        await refreshItems()
      }
    }
  }

  const handleTogglePublish = async (item: AdminMetricItem) => {
    const nextPublished = !item.published
    setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, published: nextPublished } : m)))

    const { error } = await updateMetric(item.id, { published: nextPublished })
    if (error) {
      setStatusMessage({ type: 'error', text: error })
      await refreshItems()
    } else {
      setStatusMessage({
        type: 'success',
        text: `Metric "${item.title}" ${nextPublished ? 'published' : 'moved to draft'}.`,
      })
      await refreshItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setIsSubmitting(true)
    const targetId = deleteConfirmItem.id
    const targetTitle = deleteConfirmItem.title

    setItems((prev) => prev.filter((m) => m.id !== targetId))
    setDeleteConfirmItem(null)

    const { error } = await deleteMetric(targetId)
    setIsSubmitting(false)
    if (error) {
      setStatusMessage({ type: 'error', text: error })
      await refreshItems()
    } else {
      setStatusMessage({ type: 'success', text: `Deleted "${targetTitle}" metric.` })
      await refreshItems()
    }
  }

  // Real-time Search & Sort Computation
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          item.suffix.toLowerCase().includes(query)

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
        } else if (sortBy === 'title') {
          comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
        } else if (sortBy === 'target_value') {
          comp = (a.target_value || 0) - (b.target_value || 0)
        }
        return sortDirection === 'asc' ? comp : -comp
      })
  }, [items, searchQuery, selectedStatus, sortBy, sortDirection])

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Metrics" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/metrics" />

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
                <span className="text-xs font-bold text-[#6D0091]">Metrics</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Live Animated Metrics Management
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Control numerical counter values, labels, and suffixes displayed on the public About/Results section.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="px-5 py-3 bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Metric</span>
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

          {/* Search, Filter & Sort Toolbar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metric title or description..."
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

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Draft Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'display_order' | 'title' | 'target_value')}
                className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none cursor-pointer"
              >
                <option value="display_order">Sort by Order</option>
                <option value="title">Sort by Title</option>
                <option value="target_value">Sort by Value</option>
              </select>

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

          {/* List or Empty State */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-[#3D00D6]" />
                <span>Loading Metric Records...</span>
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
                  <BarChart3 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-black">
                    {items.length === 0 ? 'No metrics created yet' : 'No matching metrics'}
                  </h3>
                  <p className="text-xs text-neutral-black/50">
                    {items.length === 0
                      ? 'Click "Add Metric" above to create your first counter record.'
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
                    className="px-4 py-2 bg-[#3D00D6] text-white rounded-xl text-xs font-bold hover:bg-[#3D00D6]/90 transition cursor-pointer"
                  >
                    Clear Filters &amp; Reset
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-150">
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-[#3D00D6]">
                          {item.target_value}{item.suffix}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-black/40 bg-slate-100 px-2 py-0.5 rounded">
                          Order: #{item.display_order}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-black leading-snug">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-neutral-black/60">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
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
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-black/60 hover:text-[#3D00D6] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Edit Metric"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-2 text-neutral-black/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Metric"
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
        title={editingItem ? 'Edit Live Metric' : 'Add New Metric'}
        maxWidth="max-w-lg"
      >
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Metric Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clients Served"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Target Value *
              </label>
              <input
                type="number"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Start Value
              </label>
              <input
                type="number"
                value={startValue}
                onChange={(e) => setStartValue(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
                Suffix
              </label>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="+, M+, %"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-black">
              Supporting Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Across 12+ industries"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-neutral-black focus:bg-white focus:border-[#3D00D6] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="publishedMetric"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-[#3D00D6] rounded border-gray-300 focus:ring-[#3D00D6] cursor-pointer"
            />
            <label htmlFor="publishedMetric" className="text-xs font-bold text-neutral-black cursor-pointer">
              Publish immediately on public website
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
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingItem ? 'Update Metric' : 'Add Metric'}</span>
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
