import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminBlogPosts, defaultStaticBlogPosts } from '@/lib/supabase/cms'
import AdminBlogClient from '@/components/admin/AdminBlogClient'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
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

  const dbItems = await getAllAdminBlogPosts(supabase)
  const initialItems = dbItems && dbItems.length > 0 ? dbItems : defaultStaticBlogPosts

  return (
    <AdminBlogClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialItems={initialItems}
    />
  )
}
