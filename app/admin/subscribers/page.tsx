import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminSubscribers, AdminSubscriberItem } from '@/lib/supabase/cms'
import AdminSubscribersClient from '@/components/admin/AdminSubscribersClient'

export const dynamic = 'force-dynamic'

export default async function AdminSubscribersPage() {
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

  const subscribers: AdminSubscriberItem[] = await getAllAdminSubscribers(supabase)

  return (
    <AdminSubscribersClient
      userEmail={user.email || 'Admin'}
      initialSubscribers={subscribers}
    />
  )
}
