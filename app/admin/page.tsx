import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  isAdminUser,
  getAllAdminPortfolioItems,
  getAllAdminBlogPosts,
  getAllAdminTestimonials,
  getAllAdminClientLogos,
  getAllAdminMetrics,
  getAllAdminServices,
  getAllAdminSubscribers,
  defaultStaticPortfolioItems,
  defaultStaticBlogPosts,
  defaultStaticClientLogos,
  defaultStaticMetrics,
  defaultStaticServices,
  defaultStaticTestimonials,
  AdminPortfolioItem,
  AdminBlogPostItem,
  AdminTestimonialItem,
  AdminClientLogoItem,
  AdminMetricItem,
  AdminServiceItem,
  AdminSubscriberItem
} from '@/lib/supabase/cms'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const isAdmin = await isAdminUser(user.id, supabase)
  if (!isAdmin) {
    redirect('/admin/login')
  }

  let dbError: string | null = null
  let portfolio: AdminPortfolioItem[] = []
  let blog: AdminBlogPostItem[] = []
  let testimonials: AdminTestimonialItem[] = []
  let clients: AdminClientLogoItem[] = []
  let metrics: AdminMetricItem[] = []
  let services: AdminServiceItem[] = []
  let subscribers: AdminSubscriberItem[] = []

  try {
    const results = await Promise.all([
      getAllAdminPortfolioItems(supabase),
      getAllAdminBlogPosts(supabase),
      getAllAdminTestimonials(supabase),
      getAllAdminClientLogos(supabase),
      getAllAdminMetrics(supabase),
      getAllAdminServices(supabase),
      getAllAdminSubscribers(supabase),
    ])
    portfolio = results[0].length > 0 ? results[0] : defaultStaticPortfolioItems
    blog = results[1].length > 0 ? results[1] : defaultStaticBlogPosts
    testimonials = results[2].length > 0 ? results[2] : defaultStaticTestimonials
    clients = results[3].length > 0 ? results[3] : defaultStaticClientLogos
    metrics = results[4].length > 0 ? results[4] : defaultStaticMetrics
    services = results[5].length > 0 ? results[5] : defaultStaticServices
    subscribers = results[6]
  } catch (err: any) {
    console.error('[Admin Dashboard Error]:', err)
    dbError = err?.message || 'Database query error encountered while loading Admin Dashboard.'
    portfolio = defaultStaticPortfolioItems
    blog = defaultStaticBlogPosts
    testimonials = defaultStaticTestimonials
    clients = defaultStaticClientLogos
    metrics = defaultStaticMetrics
    services = defaultStaticServices
    subscribers = []
  }

  const stats = {
    portfolio: {
      total: portfolio.length,
      published: portfolio.filter((i) => i.published).length,
      draft: portfolio.filter((i) => !i.published).length,
    },
    blog: {
      total: blog.length,
      published: blog.filter((i) => i.published).length,
      draft: blog.filter((i) => !i.published).length,
    },
    testimonials: {
      total: testimonials.length,
      published: testimonials.filter((i) => i.published).length,
      draft: testimonials.filter((i) => !i.published).length,
    },
    clients: {
      total: clients.length,
      published: clients.filter((i) => i.published).length,
      draft: clients.filter((i) => !i.published).length,
    },
    metrics: {
      total: metrics.length,
      published: metrics.filter((i) => i.published).length,
      draft: metrics.filter((i) => !i.published).length,
    },
    services: {
      total: services.length,
      published: services.filter((i) => i.published).length,
      draft: services.filter((i) => !i.published).length,
    },
    subscribers: {
      total: subscribers.length,
      published: subscribers.filter((i) => i.status === 'new').length,
      draft: subscribers.filter((i) => i.status !== 'new').length,
    },
  }

  return (
    <AdminDashboardClient
      userEmail={user.email || 'admin@threeamigos.com'}
      stats={stats}
      dbError={dbError}
    />
  )
}
