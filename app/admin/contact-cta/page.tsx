import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser, getSiteContentSection } from '@/lib/supabase/cms'
import AdminContactCTAClient from '@/components/admin/AdminContactCTAClient'

export const dynamic = 'force-dynamic'

export const defaultContactCTAContent = {
  heading: 'Let’s Build Your Growth System',
  subheading: 'Schedule a free strategy audit or chat directly with our team on WhatsApp.',
  audit_button_label: 'Get Free Audit',
  consultation_cta_text: 'Book Free 30-Min Growth Consultation',
  whatsapp_number: '+918526462969',
  contact_email: 'thethreeamigosdm@gmail.com',
  contact_phone: '+91 85264 62969',
  office_address: 'Chennai, India',
}

export default async function AdminContactCTAPage() {
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

  const initialContent = await getSiteContentSection('contact_cta', defaultContactCTAContent, supabase)

  return (
    <AdminContactCTAClient
      userEmail={user.email || 'admin@threeamigos.com'}
      initialContent={initialContent}
    />
  )
}
