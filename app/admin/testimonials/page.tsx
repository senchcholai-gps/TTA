import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getAllAdminTestimonials, defaultStaticTestimonials } from '@/lib/supabase/cms'
import AdminTestimonialsClient from '@/components/admin/AdminTestimonialsClient'

export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage() {
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

  const dbItems = await getAllAdminTestimonials(supabase)
  const initialItems = dbItems && dbItems.length > 0 ? dbItems : defaultStaticTestimonials

  return (
    <AdminTestimonialsClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialItems={initialItems}
    />
  )
}
