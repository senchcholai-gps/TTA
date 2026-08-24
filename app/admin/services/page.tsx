import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminServices, defaultStaticServices } from '@/lib/supabase/cms'
import AdminServicesClient from '@/components/admin/AdminServicesClient'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
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

  const dbServices = await getAllAdminServices(supabase)
  const initialServices = dbServices && dbServices.length > 0 ? dbServices : defaultStaticServices

  return (
    <AdminServicesClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialServices={initialServices}
    />
  )
}
