import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminPortfolioItems, defaultStaticPortfolioItems } from '@/lib/supabase/cms'
import AdminPortfolioClient from '@/components/admin/AdminPortfolioClient'

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
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

  const dbItems = await getAllAdminPortfolioItems(supabase)
  const initialItems = dbItems && dbItems.length > 0 ? dbItems : defaultStaticPortfolioItems

  return (
    <AdminPortfolioClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialItems={initialItems}
    />
  )
}
