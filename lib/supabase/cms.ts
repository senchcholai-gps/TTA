import { createClient } from './client'
import { portfolioItems, PortfolioItem } from '@/lib/portfolio-data'

async function safeRevalidatePath(path: string, type?: 'layout' | 'page') {
  if (typeof window === 'undefined') {
    try {
      const { revalidatePath } = await import('next/cache')
      revalidatePath(path, type)
    } catch {}
  }
}
import { testimonials, Testimonial } from '@/lib/testimonials-data'
export type { Testimonial }
import { serviceCategories, ServiceCategory } from '@/lib/services-data'
import { caseStudies, CaseStudy } from '@/lib/case-studies-data'
import { blogPosts, BlogPost } from '@/lib/blog-data'
import {
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
  Star,
  Globe,
  Zap,
  Eye,
  Heart,
  Briefcase,
  LucideIcon
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
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
  Star,
  Globe,
  Zap,
  Eye,
  Heart,
  Briefcase
}

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && !url.includes('your-project-id'))
}

function formatSupabaseError(error: any, tableName: string): string {
  if (!error) return 'Unknown database error.'
  if (error.code === 'PGRST205' || (error.message && error.message.includes('schema cache'))) {
    return `Database table 'public.${tableName}' does not exist in your Supabase project yet. Please execute supabase/schema.sql in your Supabase SQL Editor.`
  }
  return error.message || `Database error on table 'public.${tableName}' (${error.code || 'UNKNOWN'})`
}

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// DEFAULT STATIC CONTENT FOR ADMIN DISPLAY
// --------------------------------------------------------------------
// Helper to generate valid static UUIDs for fallback items
function staticUUID(prefix: number, index: number): string {
  const p = prefix.toString().padStart(8, '0')
  const i = index.toString().padStart(12, '0')
  return `${p}-0000-4000-a000-${i}`
}

export const defaultStaticPortfolioItems: AdminPortfolioItem[] = portfolioItems.map((p, idx) => ({
  id: (p.id && isValidUUID(p.id)) ? p.id : staticUUID(4, idx + 1),
  title: p.title,
  description: p.description,
  category: p.category,
  media_type: (p.tag && p.tag.toLowerCase().includes('reel')) ? 'video' : 'video',
  media_url: p.url,
  thumbnail_url: p.thumbnail,
  client_name: p.clientName || p.clientType || 'Three Amigos Client',
  published: true,
  display_order: idx + 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

const serviceIconNames: Record<string, string> = {
  ai: 'Sparkles',
  social: 'Share2',
  content: 'Video',
  performance: 'Target',
  email: 'Mail',
  influencer: 'Award',
}

export const defaultStaticServices: AdminServiceItem[] = serviceCategories.map((s, idx) => ({
  id: staticUUID(2, idx + 1),
  title: s.title,
  description: s.description,
  icon: serviceIconNames[s.id] || 'Briefcase',
  published: true,
  display_order: idx + 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

export const defaultStaticBlogPosts: AdminBlogPostItem[] = blogPosts.map((b, idx) => ({
  id: staticUUID(5, idx + 1),
  title: b.title,
  slug: b.slug,
  excerpt: b.excerpt,
  content: b.sections ? b.sections.map(s => s.text).join('\n\n') : b.excerpt,
  thumbnail_url: b.coverImage,
  published: true,
  published_at: b.publishDate || new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

export const defaultStaticClientLogos: AdminClientLogoItem[] = [
  { id: staticUUID(3, 1), name: 'UNICEF', logo_url: '/logos/optimized/unicef.png', website_url: null, published: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 2), name: 'Maven Consulting', logo_url: '/logos/optimized/maven-consulting.png', website_url: null, published: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 3), name: 'Jashmi Investment', logo_url: '/logos/optimized/jashmi-investment.png', website_url: null, published: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 4), name: 'Maven Education', logo_url: '/logos/optimized/maven-education.png', website_url: null, published: true, display_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 5), name: 'The Book Show', logo_url: '/logos/optimized/the-book-show.png', website_url: null, published: true, display_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 6), name: 'Why Tap', logo_url: '/logos/optimized/why-tap.png', website_url: null, published: true, display_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 7), name: 'Namma Yatri', logo_url: '/logos/optimized/namma-yatri.png', website_url: null, published: true, display_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 8), name: 'Ather', logo_url: '/logos/optimized/ather.png', website_url: null, published: true, display_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 9), name: 'Yellow Owl', logo_url: '/logos/optimized/yellow-owl.png', website_url: null, published: true, display_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(3, 10), name: "Aara's Chicken", logo_url: '/logos/optimized/aaras-chicken.png', website_url: null, published: true, display_order: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export const defaultStaticMetrics: AdminMetricItem[] = [
  { id: staticUUID(1, 1), title: 'Clients Served', target_value: 150, start_value: 130, suffix: '+', description: 'Across 12+ industries', display_order: 1, published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(1, 2), title: 'Views Generated', target_value: 20, start_value: 18, suffix: 'M+', description: 'Organic + paid combined', display_order: 2, published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(1, 3), title: 'Avg. Engagement Growth', target_value: 40, start_value: 34, suffix: '%', description: 'Month-over-month average', display_order: 3, published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: staticUUID(1, 4), title: 'Campaigns Delivered', target_value: 150, start_value: 130, suffix: '+', description: 'On time & on budget', display_order: 4, published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export const defaultStaticTestimonials: AdminTestimonialItem[] = testimonials.map((t, idx) => ({
  id: staticUUID(6, idx + 1),
  client_name: t.name,
  company: t.company,
  role: t.role,
  testimonial: t.text,
  rating: t.rating || 5,
  avatar_url: (t as any).avatar || null,
  published: true,
  display_order: idx + 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

// --------------------------------------------------------------------
// ADMIN AUTHENTICATION CHECK
// --------------------------------------------------------------------
export async function isAdminUser(userId: string, customClient?: any): Promise<boolean> {
  if (!isConfigured() || !userId) return false

  try {
    const supabase = customClient || createClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    return Boolean(!error && data?.user_id)
  } catch {
    return false
  }
}

// --------------------------------------------------------------------
// PORTFOLIO ITEMS
// --------------------------------------------------------------------
export interface AdminPortfolioItem {
  id: string
  title: string
  description: string
  category: string
  media_type: string
  media_url: string
  thumbnail_url: string
  client_name: string | null
  published: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isConfigured()) return portfolioItems

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return portfolioItems
    }

    return (data as Array<{
      id: string
      title: string
      description: string
      category: string
      media_type: string
      media_url: string
      thumbnail_url: string
      client_name: string | null
    }>).map((item) => {
      // Find matching static item if any for extended fields like clientLogo, platformName, etc.
      const staticMatch = portfolioItems.find(
        (p) => p.id === item.id || p.title.toLowerCase() === item.title.toLowerCase()
      )

      const isYT = item.category === 'Long-form YouTube Videos' || item.media_type === 'video'
      const isPage = item.category === 'Pages We Manage' || item.media_type === 'page'

      const tag = isYT
        ? 'YouTube Video'
        : isPage
        ? item.media_url?.includes('youtube')
          ? 'YouTube Page'
          : item.media_url?.includes('facebook')
          ? 'Facebook Page'
          : 'Instagram Page'
        : 'Instagram Reel'

      const platformName = isPage
        ? item.media_url?.includes('youtube')
          ? 'YouTube'
          : item.media_url?.includes('facebook')
          ? 'Facebook'
          : 'Instagram'
        : undefined

      return {
        id: item.id,
        slug: staticMatch?.slug || item.id,
        title: item.title,
        category: item.category as PortfolioItem['category'],
        tag: tag,
        description: item.description,
        thumbnail: item.thumbnail_url || '',
        url: item.media_url,
        clientName: item.client_name || staticMatch?.clientName || undefined,
        clientLogo: staticMatch?.clientLogo || item.thumbnail_url || undefined,
        platformName: staticMatch?.platformName || platformName,
        duration: staticMatch?.duration || undefined,
        services: staticMatch?.services || undefined,
        challenge: staticMatch?.challenge || undefined,
        strategy: staticMatch?.strategy || undefined,
        testimonial: staticMatch?.testimonial || undefined,
        featured: staticMatch?.featured ?? true,
      }
    })
  } catch {
    return portfolioItems
  }
}

export async function getAllAdminPortfolioItems(customClient?: any): Promise<AdminPortfolioItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.portfolio_items does not exist in Supabase database yet.')
      return []
    }
    console.error('[CMS Fetch Error portfolio_items]:', error)
    throw new Error(`[portfolio_items fetch error]: ${error.message} (${error.code})`)
  }
  return (data || []) as AdminPortfolioItem[]
}

export async function createPortfolioItem(item: {
  title: string
  description: string
  category: string
  media_type: string
  media_url: string
  thumbnail_url: string
  client_name?: string | null
  published?: boolean
  display_order?: number
}): Promise<{ data: AdminPortfolioItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([item])
      .select()

    if (error) return { data: null, error: formatSupabaseError(error, 'portfolio_items') }
    safeRevalidatePath('/', 'layout')
    safeRevalidatePath('/portfolio', 'page')
    return { data: (data && data.length > 0 ? data[0] : null) as AdminPortfolioItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: formatSupabaseError(err, 'portfolio_items') }
  }
}

export async function updatePortfolioItem(
  id: string,
  item: Partial<{
    title: string
    description: string
    category: string
    media_type: string
    media_url: string
    thumbnail_url: string
    client_name: string | null
    published: boolean
    display_order: number
  }>
): Promise<{ data: AdminPortfolioItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: formatSupabaseError(error, 'portfolio_items') }
    safeRevalidatePath('/', 'layout')
    safeRevalidatePath('/portfolio', 'page')
    return { data: (data && data.length > 0 ? data[0] : null) as AdminPortfolioItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: formatSupabaseError(err, 'portfolio_items') }
  }
}

export async function deletePortfolioItem(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id)

    if (error) return { success: false, error: formatSupabaseError(error, 'portfolio_items') }
    safeRevalidatePath('/', 'layout')
    safeRevalidatePath('/portfolio', 'page')
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: formatSupabaseError(err, 'portfolio_items') }
  }
}

// --------------------------------------------------------------------
// TESTIMONIALS
// --------------------------------------------------------------------
export interface AdminTestimonialItem {
  id: string
  client_name: string
  company: string
  role: string
  testimonial: string
  rating: number
  avatar_url: string | null
  published: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isConfigured()) return testimonials

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return testimonials
    }

    return (data as Array<{
      client_name: string
      company: string
      role: string
      testimonial: string
      rating: number
      avatar_url?: string | null
    }>).map((item) => ({
      name: item.client_name,
      role: item.role,
      company: item.company,
      text: item.testimonial,
      avatar_url: item.avatar_url || null,
      initials: (item.client_name || '')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
      rating: item.rating,
    }))
  } catch {
    return testimonials
  }
}

export async function getAllAdminTestimonials(customClient?: any): Promise<AdminTestimonialItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.testimonials does not exist in Supabase database yet.')
      return []
    }
    console.error('[CMS Fetch Error testimonials]:', error)
    throw new Error(`[testimonials fetch error]: ${error.message} (${error.code})`)
  }

  let rawData = (data || []) as AdminTestimonialItem[]
  rawData = rawData.filter((item) => !item.client_name?.includes('Client Testimonial Placeholder'))

  return rawData
}

export async function createTestimonial(item: {
  client_name: string
  company: string
  role: string
  testimonial: string
  rating?: number
  avatar_url?: string | null
  published?: boolean
  display_order?: number
}): Promise<{ data: AdminTestimonialItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .insert([item])
      .select()

    if (error) return { data: null, error: error.message }
    safeRevalidatePath('/', 'layout')
    return { data: (data && data.length > 0 ? data[0] : null) as AdminTestimonialItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create testimonial.' }
  }
}

export async function updateTestimonial(
  id: string,
  item: Partial<{
    client_name: string
    company: string
    role: string
    testimonial: string
    rating: number
    avatar_url: string | null
    published: boolean
    display_order: number
  }>
): Promise<{ data: AdminTestimonialItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: error.message }
    safeRevalidatePath('/', 'layout')
    return { data: (data && data.length > 0 ? data[0] : null) as AdminTestimonialItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update testimonial.' }
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    safeRevalidatePath('/', 'layout')
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete testimonial.' }
  }
}

// --------------------------------------------------------------------
// CLIENT LOGOS
// --------------------------------------------------------------------
export interface AdminClientLogoItem {
  id: string
  name: string
  logo_url: string
  website_url: string | null
  published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export async function getClientLogos(): Promise<Array<{ name: string; logo: string; website_url?: string }>> {
  const defaultLogos = defaultStaticClientLogos.map((item) => ({
    name: item.name,
    logo: item.logo_url,
    website_url: item.website_url || undefined,
  }))

  if (!isConfigured()) return defaultLogos

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return defaultLogos

    return (data as AdminClientLogoItem[]).map((item) => ({
      name: item.name,
      logo: item.logo_url,
      website_url: item.website_url || undefined,
    }))
  } catch {
    return defaultLogos
  }
}

export async function getAllAdminClientLogos(customClient?: any): Promise<AdminClientLogoItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('client_logos')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.client_logos does not exist in Supabase database yet.')
      return []
    }
    console.error('[CMS Fetch Error client_logos]:', error)
    throw new Error(`[client_logos fetch error]: ${error.message} (${error.code})`)
  }
  return (data || []) as AdminClientLogoItem[]
}

export async function createClientLogo(item: {
  name: string
  logo_url: string
  website_url?: string | null
  display_order?: number
  published?: boolean
}): Promise<{ data: AdminClientLogoItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('client_logos')
      .insert([item])
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminClientLogoItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create client logo.' }
  }
}

export async function updateClientLogo(
  id: string,
  item: Partial<{
    name: string
    logo_url: string
    website_url: string | null
    display_order: number
    published: boolean
  }>
): Promise<{ data: AdminClientLogoItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('client_logos')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminClientLogoItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update client logo.' }
  }
}

export async function deleteClientLogo(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('client_logos')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete client logo.' }
  }
}

export async function uploadClientLogoImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isConfigured()) {
    return { url: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('client-logos')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: publicUrlData } = supabase.storage
      .from('client-logos')
      .getPublicUrl(filePath)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: any) {
    return { url: null, error: err?.message || 'Failed to upload client logo.' }
  }
}

// --------------------------------------------------------------------
// SITE CONTENT & SETTINGS (Hero, About, Contact CTA, Nav, Footer, Settings)
// --------------------------------------------------------------------
export interface AdminAboutContent {
  tagline: string
  heading: string
  heading_accent: string
  description: string
  about_image_url?: string
}

export const defaultAboutContent: AdminAboutContent = {
  tagline: 'About Us',
  heading: 'We Build High-Converting',
  heading_accent: 'Growth Systems',
  description: 'We help brands grow faster with AI-powered marketing, strategic social media management, in-house video production, influencer collaborations, and performance-driven digital campaigns. From AI content creation to camera production and editing — we build marketing systems that generate awareness, leads, and measurable business growth.',
}

export async function getSiteContentSection<T>(
  sectionId: string,
  fallbackContent: T,
  customClient?: any
): Promise<T> {
  if (!isConfigured()) return fallbackContent

  try {
    const supabase = customClient || createClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_id', sectionId)
      .limit(1)

    if (error || !data || data.length === 0 || !data[0].content) {
      return fallbackContent
    }
    return { ...fallbackContent, ...(data[0].content as Record<string, any>) }
  } catch {
    return fallbackContent
  }
}

export async function updateSiteContentSection(
  sectionId: string,
  content: Record<string, any>
): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('site_content')
      .upsert({ section_id: sectionId, content, updated_at: new Date().toISOString() })

    if (error) return { success: false, error: formatSupabaseError(error, 'site_content') }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: formatSupabaseError(err, 'site_content') }
  }
}

// --------------------------------------------------------------------
// METRICS / STATS COUNTERS
// --------------------------------------------------------------------
export interface AdminMetricItem {
  id: string
  title: string
  target_value: number
  start_value: number
  suffix: string
  description: string | null
  display_order: number
  published: boolean
  created_at?: string
  updated_at?: string
}

export async function getMetrics(): Promise<AdminMetricItem[]> {
  if (!isConfigured()) return defaultStaticMetrics

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) return defaultStaticMetrics

    return data as AdminMetricItem[]
  } catch {
    return defaultStaticMetrics
  }
}

export async function getAllAdminMetrics(customClient?: any): Promise<AdminMetricItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.metrics does not exist in Supabase database yet. Please execute schema.sql in Supabase SQL Editor.')
      return []
    }
    console.error('[CMS Fetch Error metrics]:', error)
    throw new Error(`[metrics fetch error]: ${error.message} (${error.code})`)
  }
  return (data || []) as AdminMetricItem[]
}

export async function createMetric(item: {
  title: string
  target_value: number
  start_value?: number
  suffix?: string
  description?: string | null
  display_order?: number
  published?: boolean
}): Promise<{ data: AdminMetricItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('metrics')
      .insert([item])
      .select()

    if (error) return { data: null, error: formatSupabaseError(error, 'metrics') }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminMetricItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: formatSupabaseError(err, 'metrics') }
  }
}

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export async function updateMetric(
  id: string,
  item: Partial<{
    title: string
    target_value: number
    start_value: number
    suffix: string
    description: string | null
    display_order: number
    published: boolean
  }>
): Promise<{ data: AdminMetricItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  if (!isValidUUID(id)) {
    // If updating a static fallback item with a non-UUID id (e.g. 'metric-1'), insert as new DB item
    return createMetric({
      title: item.title || 'Metric',
      target_value: item.target_value ?? 100,
      start_value: item.start_value ?? 0,
      suffix: item.suffix ?? '+',
      description: item.description || null,
      display_order: item.display_order ?? 1,
      published: item.published ?? true,
    })
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('metrics')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: formatSupabaseError(error, 'metrics') }
    safeRevalidatePath('/', 'layout')
    return { data: (data && data.length > 0 ? data[0] : null) as AdminMetricItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: formatSupabaseError(err, 'metrics') }
  }
}

export async function deleteMetric(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  if (!isValidUUID(id)) {
    return { success: true, error: null }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('metrics').delete().eq('id', id)

    if (error) return { success: false, error: formatSupabaseError(error, 'metrics') }
    safeRevalidatePath('/', 'layout')
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: formatSupabaseError(err, 'metrics') }
  }
}

export interface AdminServiceItem {
  id: string
  title: string
  description: string
  icon: string
  sub_services?: string[]
  published: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export async function getServices(): Promise<ServiceCategory[]> {
  if (!isConfigured()) return serviceCategories

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return serviceCategories
    }

    // Map DB rows to ServiceCategory format
    return (data as any[]).map((item) => {
      // Find matching static service by title for fallback
      const staticMatch = serviceCategories.find(
        (s) => s.title.toLowerCase() === item.title.toLowerCase()
      )
      // sub_services is a JSONB array of strings stored in DB; services field is the display array
      const servicesList: string[] = Array.isArray(item.sub_services)
        ? item.sub_services
        : staticMatch?.services || []

      // Resolve icon dynamically from item.icon via ICON_MAP, falling back to staticMatch icon or Briefcase
      const resolvedIcon = (item.icon && ICON_MAP[item.icon])
        || staticMatch?.icon
        || ICON_MAP['Briefcase']
        || serviceCategories[0].icon

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        icon: resolvedIcon,
        services: servicesList,
      }
    })
  } catch {
    return serviceCategories
  }
}

export async function getAllAdminServices(customClient?: any): Promise<AdminServiceItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.services does not exist in Supabase database yet.')
      return []
    }
    console.error('[CMS Fetch Error services]:', error)
    throw new Error(`[services fetch error]: ${error.message} (${error.code})`)
  }
  return (data || []) as AdminServiceItem[]
}

export async function createService(item: {
  title: string
  description: string
  icon?: string
  sub_services?: string[]
  published?: boolean
  display_order?: number
}): Promise<{ data: AdminServiceItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('services')
      .insert([{
        title: item.title,
        description: item.description,
        icon: item.icon || 'Briefcase',
        sub_services: item.sub_services || [],
        published: item.published ?? true,
        display_order: item.display_order ?? 0,
      }])
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminServiceItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create service.' }
  }
}

export async function updateService(
  id: string,
  item: Partial<{
    title: string
    description: string
    icon: string
    sub_services: string[]
    published: boolean
    display_order: number
  }>
): Promise<{ data: AdminServiceItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('services')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminServiceItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update service.' }
  }
}

export async function deleteService(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete service.' }
  }
}

// --------------------------------------------------------------------
// CASE STUDIES
// --------------------------------------------------------------------
export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!isConfigured()) return caseStudies

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return caseStudies
    }

    return caseStudies
  } catch {
    return caseStudies
  }
}

// --------------------------------------------------------------------
// BLOG POSTS
// --------------------------------------------------------------------
export interface AdminBlogPostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail_url: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured()) return blogPosts

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return blogPosts
    }

    return (data as Array<{
      id: string
      title: string
      slug: string
      excerpt: string
      content: string
      thumbnail_url: string
      published_at: string | null
      created_at: string
    }>).map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: 'AI Marketing' as const,
      tags: ['AI Marketing', 'Digital Strategy'],
      coverImage: item.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      author: {
        name: 'The Three Amigos',
        avatar: '/TTA_Logo_Icon.png',
        role: 'Marketing Team',
      },
      readingTime: '5 min read',
      publishDate: item.published_at ? new Date(item.published_at).toISOString().split('T')[0] : new Date(item.created_at).toISOString().split('T')[0],
      metaTitle: item.title,
      metaDescription: item.excerpt,
      canonicalUrl: `https://thethreeamigos.in/blog/${item.slug}`,
      relatedServices: [{ name: 'AI Marketing Solutions', href: '/#services' }],
      relatedIndustries: [],
      sections: [{ text: item.content }],
      summary: item.excerpt,
      cta: 'Schedule a Free AI Marketing Audit',
    }))
  } catch {
    return blogPosts
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts()
  return posts.find((p) => p.slug === slug)
}

export async function getAllAdminBlogPosts(customClient?: any): Promise<AdminBlogPostItem[]> {
  if (!isConfigured()) return []

  const supabase = customClient || createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('[CMS Warning]: Table public.blog_posts does not exist in Supabase database yet.')
      return []
    }
    console.error('[CMS Fetch Error blog_posts]:', error)
    throw new Error(`[blog_posts fetch error]: ${error.message} (${error.code})`)
  }
  return (data || []) as AdminBlogPostItem[]
}

export async function createBlogPost(item: {
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail_url: string
  published?: boolean
  published_at?: string | null
}): Promise<{ data: AdminBlogPostItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([item])
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminBlogPostItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create blog post.' }
  }
}

export async function updateBlogPost(
  id: string,
  item: Partial<{
    title: string
    slug: string
    excerpt: string
    content: string
    thumbnail_url: string
    published: boolean
    published_at: string | null
  }>
): Promise<{ data: AdminBlogPostItem | null; error: string | null }> {
  if (!isConfigured()) {
    return { data: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .update(item)
      .eq('id', id)
      .select()

    if (error) return { data: null, error: error.message }
    return { data: (data && data.length > 0 ? data[0] : null) as AdminBlogPostItem | null, error: null }
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update blog post.' }
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete blog post.' }
  }
}

export async function uploadBlogImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isConfigured()) {
    return { url: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('blog')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: publicUrlData } = supabase.storage
      .from('blog')
      .getPublicUrl(filePath)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: any) {
    return { url: null, error: err?.message || 'Failed to upload blog image.' }
  }
}

// --------------------------------------------------------------------
// CENTRALIZED MEDIA LIBRARY STORAGE HELPERS
// --------------------------------------------------------------------
export interface StorageMediaItem {
  id: string
  name: string
  bucket: string
  url: string
  size?: number
  created_at?: string | null
  mimetype?: string
}

export async function listBucketFiles(bucketName: string): Promise<StorageMediaItem[]> {
  if (!isConfigured()) return []

  try {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from(bucketName).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error || !data) return []

    return data
      .filter((file) => file.name !== '.emptyFolderPlaceholder')
      .map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(file.name)

        return {
          id: file.id || `${bucketName}-${file.name}`,
          name: file.name,
          bucket: bucketName,
          url: publicUrlData.publicUrl,
          size: file.metadata?.size,
          created_at: file.created_at,
          mimetype: file.metadata?.mimetype,
        }
      })
  } catch {
    return []
  }
}

export async function listAllMediaFiles(): Promise<StorageMediaItem[]> {
  const buckets = ['portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog']
  try {
    const results = await Promise.all(buckets.map((b) => listBucketFiles(b)))
    const flattened = results.flat()
    flattened.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateB - dateA
    })
    return flattened
  } catch {
    return []
  }
}

export async function uploadMediaFile(
  bucketName: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!isConfigured()) {
    return { url: null, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
    const fileName = `${Date.now()}-${cleanBaseName}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (err: any) {
    return { url: null, error: err?.message || 'Failed to upload media file.' }
  }
}

export async function deleteMediaFile(
  bucketName: string,
  fileName: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.storage.from(bucketName).remove([fileName])

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete media file.' }
  }
}

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// SUBSCRIBERS / LEADS CMS
// --------------------------------------------------------------------
export interface AdminSubscriberItem {
  id: string
  email: string
  status: 'new' | 'contacted' | 'converted'
  source?: string | null
  created_at: string
  updated_at: string
}

export async function getAllAdminSubscribers(
  client?: any
): Promise<AdminSubscriberItem[]> {
  if (!isConfigured()) return []

  try {
    const supabase = client || createClient()
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('getAllAdminSubscribers warning:', error.message)
      return []
    }
    return (data || []) as AdminSubscriberItem[]
  } catch (err: any) {
    console.warn('getAllAdminSubscribers exception:', err?.message)
    return []
  }
}

export async function updateSubscriberStatus(
  id: string,
  status: 'new' | 'contacted' | 'converted'
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('subscribers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return { success: false, error: formatSupabaseError(error, 'subscribers') }
    }

    await safeRevalidatePath('/admin/subscribers', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update subscriber status.' }
  }
}

export async function deleteSubscriber(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    return { success: false, error: 'Supabase environment is not configured.' }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: formatSupabaseError(error, 'subscribers') }
    }

    await safeRevalidatePath('/admin/subscribers', 'page')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete subscriber.' }
  }
}

