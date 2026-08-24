import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getSiteContentSection } from '@/lib/supabase/cms'
import AdminAboutClient from '@/components/admin/AdminAboutClient'

export const dynamic = 'force-dynamic'

export const defaultAboutContent = {
  tagline: 'About Us',
  heading: 'We Build High-Converting',
  heading_accent: 'Growth Systems',
  description: 'We help brands grow faster with AI-powered marketing, strategic social media management, in-house video production, influencer collaborations, and performance-driven digital campaigns. From AI content creation to camera production and editing — we build marketing systems that generate awareness, leads, and measurable business growth.',
  about_image_url: '',
}

export default async function AdminAboutPage() {
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

  const initialContent = await getSiteContentSection('about', defaultAboutContent, supabase)

  return (
    <AdminAboutClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialContent={initialContent}
    />
  )
}
