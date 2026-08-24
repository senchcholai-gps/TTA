'use client'

import React, { useState } from 'react'
import {
  Mail,
  ArrowLeft,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Filter,
  RefreshCw
} from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  AdminSubscriberItem,
  updateSubscriberStatus,
  deleteSubscriber
} from '@/lib/supabase/cms'

interface AdminSubscribersClientProps {
  userEmail: string
  initialSubscribers: AdminSubscriberItem[]
}

export default function AdminSubscribersClient({
  userEmail,
  initialSubscribers
}: AdminSubscribersClientProps) {
  const [subscribers, setSubscribers] = useState<AdminSubscriberItem[]>(initialSubscribers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Status badge styling helper
  const getStatusBadge = (status: AdminSubscriberItem['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            New
          </span>
        )
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            Contacted
          </span>
        )
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            Converted
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === 'all' || sub.status === statusFilter
    return matchesSearch && matchesFilter
  })

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'converted') => {
    setUpdatingId(id)
    setStatusMessage(null)

    const res = await updateSubscriberStatus(id, newStatus)
    setUpdatingId(null)

    if (res.success) {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      )
      setStatusMessage({ type: 'success', text: 'Subscriber status updated successfully.' })
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update status.' })
    }
  }

  // Handle delete subscriber
  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove subscriber "${email}"?`)) {
      return
    }

    setUpdatingId(id)
    setStatusMessage(null)

    const res = await deleteSubscriber(id)
    setUpdatingId(null)

    if (res.success) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      setStatusMessage({ type: 'success', text: 'Subscriber removed successfully.' })
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to remove subscriber.' })
    }
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Subscribers" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin/subscribers" />

        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <a
                  href="/admin"
                  className="text-xs font-bold text-neutral-400 hover:text-[#3D00D6] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Dashboard
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-xs font-bold text-[#6D0091]">Subscribers</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">
                Newsletter & CTA Subscribers
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage incoming website email leads, track outreach status, and contact prospective clients.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-2xl text-xs font-black flex items-center gap-2">
                <UserCheck size={16} />
                <span>{subscribers.length} Total Leads</span>
              </div>
            </div>
          </div>

          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-xs opacity-75 hover:opacity-100 font-extrabold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Filters & Search */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriber email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium text-neutral-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 pl-1">
                <Filter size={12} />
                Status:
              </span>
              {(['all', 'new', 'contacted', 'converted'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer flex-shrink-0 ${
                    statusFilter === filterKey
                      ? 'bg-neutral-black text-white'
                      : 'bg-slate-100 text-neutral-600 hover:bg-slate-200'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xs overflow-hidden">
            {filteredSubscribers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Mail size={24} />
                </div>
                <h3 className="text-sm font-bold text-neutral-black">No subscribers found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No subscriber matches your active search query or filter.'
                    : 'Subscribers who submit their email via the website CTA will appear here in real-time.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-gray-200 text-neutral-black text-[11px] uppercase tracking-wider font-extrabold">
                      <th className="px-6 py-4">Subscriber Email</th>
                      <th className="px-6 py-4">Date Submitted</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {filteredSubscribers.map((sub) => {
                      const isUpdating = updatingId === sub.id
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/60 transition duration-150">
                          {/* Email */}
                          <td className="px-6 py-4 font-bold text-neutral-black">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                                <Mail size={14} />
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate font-bold text-[#1A1A1A]">
                                  {sub.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-neutral-500 font-semibold whitespace-nowrap">
                            {formatDate(sub.created_at)}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(sub.status)}
                              
                              {/* Status Dropdown */}
                              <select
                                value={sub.status}
                                disabled={isUpdating}
                                onChange={(e) =>
                                  handleStatusChange(
                                    sub.id,
                                    e.target.value as 'new' | 'contacted' | 'converted'
                                  )
                                }
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 border border-gray-200 rounded-lg px-2 py-1 text-neutral-700 focus:outline-none cursor-pointer"
                              >
                                <option value="new">Mark New</option>
                                <option value="contacted">Mark Contacted</option>
                                <option value="converted">Mark Converted</option>
                              </select>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Manual Contact Action */}
                              <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(sub.email)}&su=The%20Three%20Amigos%20-%20Following%20up%20on%20your%20inquiry`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 bg-neutral-black hover:bg-brand-purple text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <ExternalLink size={13} />
                                <span>Contact</span>
                              </a>

                              {/* Delete Action */}
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleDelete(sub.id, sub.email)}
                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                title="Remove Subscriber"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
