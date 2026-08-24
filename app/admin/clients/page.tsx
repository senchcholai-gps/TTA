import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminClientLogos, defaultStaticClientLogos } from '@/lib/supabase/cms'
import AdminClientsClient from '@/components/admin/AdminClientsClient'

export const dynamic = 'force-dynamic'

export default async function AdminClientsPage() {
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

  const dbItems = await getAllAdminClientLogos(supabase)
  const initialItems = dbItems && dbItems.length > 0 ? dbItems : defaultStaticClientLogos

  return (
    <AdminClientsClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialItems={initialItems}
    />
  )
}
