'use client'

import React from 'react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  FolderKanban,
  MessageSquareQuote,
  Building2,
  FileText,
  PhoneCall,
  Mail
} from 'lucide-react'

interface AdminSidebarProps {
  currentPath: string
}

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const contentItems = [
    { name: 'About', icon: Users, href: '/admin/about' },
    { name: 'Services', icon: Briefcase, href: '/admin/services' },
    { name: 'Metrics', icon: BarChart3, href: '/admin/metrics' },
    { name: 'Portfolio', icon: FolderKanban, href: '/admin/portfolio' },
    { name: 'Testimonials', icon: MessageSquareQuote, href: '/admin/testimonials' },
    { name: 'Clients', icon: Building2, href: '/admin/clients' },
    { name: 'Blog', icon: FileText, href: '/admin/blog' },
    { name: 'CTA / Contact', icon: PhoneCall, href: '/admin/contact-cta' },
    { name: 'Subscribers', icon: Mail, href: '/admin/subscribers' },
  ]

  const isDashboardActive = currentPath === '/admin'

  return (
    <aside className="lg:col-span-3 space-y-4 font-sans">
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs space-y-3">
        {/* Dashboard Direct Item */}
        <div>
          <a
            href="/admin"
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
              isDashboardActive
                ? 'bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 hover:bg-slate-100 hover:text-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </div>
          </a>
        </div>

        {/* Content Group */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Content
          </div>
          {contentItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href || currentPath.startsWith(item.href)
            return (
              <a
                key={item.name}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D6003C] via-[#8B0095] to-[#3D00D6] text-white shadow-xs'
                    : 'text-[#1A1A1A]/70 hover:bg-slate-100 hover:text-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{item.name}</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
