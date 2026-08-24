import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminMetrics, defaultStaticMetrics } from '@/lib/supabase/cms'
import AdminMetricsClient from '@/components/admin/AdminMetricsClient'

export const dynamic = 'force-dynamic'

export default async function AdminMetricsPage() {
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

  const dbItems = await getAllAdminMetrics(supabase)
  const initialItems = dbItems && dbItems.length > 0 ? dbItems : defaultStaticMetrics

  return (
    <AdminMetricsClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialItems={initialItems}
    />
  )
}
