import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/client'

// Server-side Resend instance using private environment variable
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Standard email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // 1. Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail) || normalizedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Optional package / source validation
    const ALLOWED_PACKAGES = ['Starter', 'Growth', 'Premium', 'Enterprise']
    let validatedSource: string | null = null
    if (typeof source === 'string' && source.trim()) {
      const trimmedSource = source.trim()
      const matched = ALLOWED_PACKAGES.find(
        (p) => p.toLowerCase() === trimmedSource.toLowerCase()
      )
      validatedSource = matched || trimmedSource.slice(0, 50)
    }

    // 2. Save subscriber to Supabase (Atomic insert protected by unique constraint)
    const supabase = createClient()

    const insertPayload: { email: string; status: string; source?: string | null } = {
      email: normalizedEmail,
      status: 'new'
    }
    if (validatedSource) {
      insertPayload.source = validatedSource
    }

    let { error: insertError } = await supabase
      .from('subscribers')
      .insert([insertPayload])

    // Graceful fallback if source column does not yet exist in live database
    if (insertError && (insertError.code === '42703' || insertError.message?.includes('source'))) {
      const fallback = await supabase
        .from('subscribers')
        .insert([{ email: normalizedEmail, status: 'new' }])
      insertError = fallback.error
    }

    const isDuplicate = insertError?.code === '23505' || insertError?.message?.includes('duplicate key')

    if (isDuplicate && validatedSource) {
      // Update existing subscriber's source to the latest pricing package interest
      try {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({
            source: validatedSource,
            updated_at: new Date().toISOString()
          })
          .eq('email', normalizedEmail)

        if (updateError) {
          console.warn('Could not update subscriber source on duplicate:', updateError.message)
        }
      } catch (upErr: any) {
        console.warn('Exception updating subscriber on duplicate:', upErr?.message)
      }
    }

    if (insertError && !isDuplicate) {
      console.error('Supabase subscriber insert error:', insertError.message)
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    // 3. Send notification to Admin (Server-Side ONLY)
    // IMPORTANT: Subscriber does NOT receive an email. Only Admin receives notification.
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const adminRecipient =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.AUDIT_RECIPIENT_EMAIL ||
      'thethreeamigosdm@gmail.com'

    const fromSender =
      process.env.SUBSCRIBER_FROM_EMAIL ||
      process.env.AUDIT_FROM_EMAIL ||
      'TTA Notifications <onboarding@resend.dev>'

    const leadHeading = validatedSource
      ? `New Pricing Lead (${validatedSource})`
      : 'New Website Subscriber'

    const emailSubject = validatedSource
      ? `${isDuplicate ? '[Existing Contact] ' : ''}New Pricing Lead: ${validatedSource} — TTA`
      : 'New Website Subscriber — TTA'

    if (resend) {
      try {
        await resend.emails.send({
          from: fromSender,
          to: [adminRecipient],
          subject: emailSubject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #D6003C 0%, #8B0095 50%, #3D00D6 100%); padding: 18px 24px; border-radius: 12px; margin-bottom: 24px;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">${leadHeading}</h2>
                <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0 0; font-size: 13px;">The Three Amigos CTA Lead Capture</p>
              </div>

              <p style="font-size: 15px; color: #333333; margin-bottom: 20px; line-height: 1.6;">
                ${validatedSource ? `A visitor has requested details for the <strong>${validatedSource}</strong> package.` : 'A new subscriber has submitted their email address through the website.'}
              </p>

              <div style="background-color: #f9f9fb; border: 1px solid #ebebef; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr style="border-bottom: 1px solid #ececf1;">
                    <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a; width: 140px;">Email:</td>
                    <td style="padding: 10px 0; color: #3D00D6; font-weight: 600;">
                      <a href="mailto:${normalizedEmail}" style="color: #3D00D6; text-decoration: none;">${normalizedEmail}</a>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ececf1;">
                    <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Package:</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: #ede9fe; color: #6d28d9; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">${validatedSource || 'Newsletter'}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ececf1;">
                    <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Submitted:</td>
                    <td style="padding: 10px 0; color: #555555;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Status:</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: #ede9fe; color: #6d28d9; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${isDuplicate ? 'Existing Contact' : 'New'}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${normalizedEmail}?subject=The%20Three%20Amigos%20-%20${encodeURIComponent(validatedSource || 'Welcome')}" style="display: inline-block; background-color: #1A1A1A; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">
                  Contact Lead
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 28px 0 16px 0;" />
              <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">
                This notification was sent automatically to admin when a user submitted their email on the website.
              </p>
            </div>
          `,
          text: `
${leadHeading}

Email: ${normalizedEmail}
Package: ${validatedSource || 'Newsletter'}
Submitted: ${formattedDate}
Status: ${isDuplicate ? 'Existing Contact' : 'New'}
          `.trim()
        })
      } catch (emailErr: any) {
        // IMPORTANT: If notification email fails, subscriber remains saved in database.
        console.error('Failed to send admin notification email:', emailErr?.message || emailErr)
      }
    } else {
      console.warn('RESEND_API_KEY is not configured. Admin notification email skipped.')
    }

    // 4. Return response to user
    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "You're already on our list!"
      })
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch."
    })
  } catch (err: any) {
    console.error('Subscription handler error:', err?.message || err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
