'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Check,
  X,
  Loader2,
  HardDrive,
  ImageIcon
} from 'lucide-react'
import { StorageMediaItem, listAllMediaFiles } from '@/lib/supabase/cms'
import Modal from '@/components/admin/Modal'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  title?: string
}

const BUCKETS = ['portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog']

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Asset from Media Library',
}: MediaPickerProps) {
  const [items, setItems] = useState<StorageMediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBucket, setSelectedBucket] = useState('All')
  const [selectedItem, setSelectedItem] = useState<StorageMediaItem | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      loadMedia()
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const loadMedia = async () => {
    setIsLoading(true)
    const data = await listAllMediaFiles()
    setItems(data)
    setIsLoading(false)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBucket = selectedBucket === 'All' || item.bucket === selectedBucket
    return matchesSearch && matchesBucket
  })

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.url)
      onClose()
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-3xl"
    >
      {/* Filter Controls */}
      <div className="p-3 bg-slate-50 border border-gray-150 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-3 flex-shrink-0">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by filename..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-neutral-black focus:border-brand-purple outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-neutral-black focus:border-brand-purple outline-none cursor-pointer"
          >
            <option value="All">All Buckets</option>
            {BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="py-2">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-black/50 flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-brand-purple" />
            <span>Loading Storage Assets...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-neutral-black/40">
              <HardDrive size={24} />
            </div>
            <h4 className="text-sm font-bold text-neutral-black">No Media Found</h4>
            <p className="text-xs text-neutral-black/50">
              No files found in storage matching your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[40vh] overflow-y-auto p-1">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.url === item.url
              return (
                <div
                  key={item.url}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative rounded-2xl border p-2 cursor-pointer transition flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                      : 'border-gray-200 bg-white hover:border-brand-purple/40 hover:shadow-xs'
                  }`}
                >
                  <div className="h-24 w-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-purple/30 backdrop-blur-xs flex items-center justify-center text-white">
                        <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center shadow-md">
                          <Check size={18} />
                        </div>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-[8px] font-black uppercase bg-black/70 text-white px-1.5 py-0.5 rounded">
                      {item.bucket}
                    </span>
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <p className="text-[11px] font-bold text-neutral-black truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[9px] text-neutral-black/50 font-medium">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
        <div className="text-xs text-neutral-black/60 font-medium truncate max-w-xs">
          {selectedItem ? (
            <span>Selected: <span className="font-bold text-neutral-black">{selectedItem.name}</span></span>
          ) : (
            <span>Click an asset above to select</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-neutral-black/70 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedItem}
            onClick={handleConfirmSelect}
            className="px-5 py-2 bg-brand-gradient text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Check size={14} />
            <span>Use Selected Asset</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
