'use client'

import {
  FolderKanban,
  FileText,
  MessageSquareQuote,
  Building2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BarChart3,
  Briefcase,
  Users,
  PhoneCall,
  Navigation,
  Columns,
  AlertTriangle,
  Settings,
  Mail
} from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface StatDetail {
  total: number
  published: number
  draft: number
}

interface AdminDashboardClientProps {
  userEmail: string
  stats: {
    portfolio: StatDetail
    blog: StatDetail
    testimonials: StatDetail
    clients: StatDetail
    metrics: StatDetail
    services: StatDetail
    subscribers?: StatDetail
  }
  dbError?: string | null
}

export default function AdminDashboardClient({ userEmail, stats, dbError }: AdminDashboardClientProps) {
  const statCards = [
    { label: 'Portfolio', data: stats.portfolio, color: 'from-[#D6003C] to-[#8B0095]', href: '/admin/portfolio' },
    { label: 'Blog Articles', data: stats.blog, color: 'from-[#8B0095] to-[#3D00D6]', href: '/admin/blog' },
    { label: 'Testimonials', data: stats.testimonials, color: 'from-[#3D00D6] to-[#6D0091]', href: '/admin/testimonials' },
    { label: 'Client Logos', data: stats.clients, color: 'from-[#6D0091] to-[#D6003C]', href: '/admin/clients' },
    { label: 'Services', data: stats.services, color: 'from-[#D6003C] to-[#3D00D6]', href: '/admin/services' },
    { label: 'Metrics', data: stats.metrics, color: 'from-[#8B0095] to-[#D6003C]', href: '/admin/metrics' },
    {
      label: 'Subscribers',
      data: stats.subscribers || { total: 0, published: 0, draft: 0 },
      color: 'from-[#3D00D6] to-[#D6003C]',
      href: '/admin/subscribers',
      customLabels: { published: 'New', draft: 'Processed' }
    },
  ]

  const modules = [
    { title: 'Subscribers Leads', icon: Mail, href: '/admin/subscribers', desc: 'Manage email leads from website CTA forms and newsletters.' },
    { title: 'About Us', icon: Users, href: '/admin/about', desc: 'Tagline, core content statement, and agency feature statement.' },
    { title: 'Services CMS', icon: Briefcase, href: '/admin/services', desc: 'Category titles, descriptions, icons, and service lists.' },
    { title: 'Metrics Counter', icon: BarChart3, href: '/admin/metrics', desc: 'Live animated counter targets, start values, and suffixes.' },
    { title: 'Portfolio Manager', icon: FolderKanban, href: '/admin/portfolio', desc: 'Video & image items with direct media and thumbnail uploads.' },
    { title: 'Testimonials CMS', icon: MessageSquareQuote, href: '/admin/testimonials', desc: 'Client reviews, ratings, and direct avatar uploads.' },
    { title: 'Client Logos Marquee', icon: Building2, href: '/admin/clients', desc: 'Brand partner logos for the animated marquee.' },
    { title: 'Blog Content Manager', icon: FileText, href: '/admin/blog', desc: 'Articles, excerpts, and direct cover thumbnail uploads.' },
    { title: 'CTA & Contact', icon: PhoneCall, href: '/admin/contact-cta', desc: 'Audit CTA, consultation bar, and WhatsApp number.' },
  ]

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-[#1A1A1A]">
      <AdminHeader userEmail={userEmail} currentModule="Dashboard" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AdminSidebar currentPath="/admin" />

        <main className="lg:col-span-9 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D6003C]/10 via-[#8B0095]/10 to-[#3D00D6]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0095]/10 border border-[#8B0095]/20 text-[11px] font-extrabold uppercase tracking-wider text-[#6D0091]">
                  <Sparkles size={12} className="text-[#D6003C]" />
                  Official TTA Admin CMS
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                  Welcome to The Three Amigos Control Panel
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-2xl">
                  Manage agency portfolio media, client reviews, blog articles, services, animated metrics, and site configuration with authorized Supabase authentication.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/portfolio"
                  target="_blank"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-200 rounded-xl text-xs font-bold text-[#1A1A1A] transition flex items-center gap-1.5"
                >
                  <span>Live Site</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {dbError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs font-semibold">
              <AlertTriangle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Database Connection/Query Error:</span>
                <span>{dbError}</span>
              </div>
            </div>
          )}

          {/* Real Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, idx) => (
              <a
                key={idx}
                href={stat.href}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-[#3D00D6]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                  <div className={`h-2 w-8 rounded-full bg-gradient-to-r ${stat.color}`} />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#1A1A1A]">{stat.data.total} Total</span>
                  <ArrowRight size={16} className="text-neutral-400 group-hover:text-[#3D00D6] group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-neutral-500 mt-2">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {stat.data.published} {(stat as any).customLabels?.published || 'Published'}
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {stat.data.draft} {(stat as any).customLabels?.draft || 'Drafts'}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* CMS Modules Grid */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1A1A1A] border-b border-gray-150 pb-3">
              CMS Management Modules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((mod, idx) => {
                const Icon = mod.icon
                return (
                  <a
                    key={idx}
                    href={mod.href}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-[#3D00D6]/40 hover:shadow-xs transition-all flex items-start gap-3.5 group bg-slate-50/50 hover:bg-white"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-gray-200 text-[#3D00D6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3D00D6] group-hover:text-white transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-[#1A1A1A] group-hover:text-[#3D00D6] transition-colors flex items-center justify-between">
                        <span>{mod.title}</span>
                        <ArrowRight size={13} className="text-neutral-400 group-hover:text-[#3D00D6] group-hover:translate-x-0.5 transition-all" />
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium leading-relaxed line-clamp-2">
                        {mod.desc}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* System Security Badge */}
          <div className="p-4 rounded-2xl bg-[#3D00D6]/5 border border-[#3D00D6]/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#3D00D6]" />
              <div className="text-xs font-semibold text-[#1A1A1A]">
                <span>Supabase RLS & Role Verification Active — User: </span>
                <span className="font-bold text-[#6D0091]">{userEmail}</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>
        </main>
      </div>
    </div>
  )
}
