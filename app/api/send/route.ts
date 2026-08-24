import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, businessName, phone, servicesInterested, budgetRange, email, website, message } = body

    // Basic server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required.' },
        { status: 400 }
      )
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { error: 'Phone / WhatsApp number is required.' },
        { status: 400 }
      )
    }

    if (!servicesInterested || typeof servicesInterested !== 'string' || !servicesInterested.trim()) {
      return NextResponse.json(
        { error: 'Please select a service you are interested in.' },
        { status: 400 }
      )
    }

    const recipient = process.env.AUDIT_RECIPIENT_EMAIL || 'thethreeamigosdm@gmail.com'

    if (!resend) {
      console.warn('RESEND_API_KEY is not configured.')
      return NextResponse.json(
        { error: 'Email service is not currently configured.' },
        { status: 500 }
      )
    }

    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const fromAddress = process.env.AUDIT_FROM_EMAIL || 'TTA Audits <onboarding@resend.dev>'

    const emailOptions: any = {
      from: fromAddress,
      to: [recipient],
      subject: `New Free Marketing Audit Request: ${name.trim()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #D6003C 0%, #8B0095 50%, #3D00D6 100%); padding: 18px 24px; border-radius: 12px; margin-bottom: 24px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">New Free Marketing Audit Request</h2>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0 0; font-size: 13px;">Submitted via The Three Amigos Website Form</p>
          </div>

          <p style="font-size: 14px; color: #333333; margin-bottom: 20px; line-height: 1.6;">
            A prospect has submitted a request for a free marketing audit with the following details:
          </p>

          <div style="background-color: #f9f9fb; border: 1px solid #ebebef; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a; width: 170px;">Client Name:</td>
                <td style="padding: 10px 0; color: #1a1a1a; font-weight: 600;">${name.trim()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Business Name:</td>
                <td style="padding: 10px 0; color: #4b5563;">${businessName ? businessName.trim() : 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0; color: #3D00D6; font-weight: 600;">
                  <a href="tel:${phone.trim()}" style="color: #3D00D6; text-decoration: none;">${phone.trim()}</a>
                </td>
              </tr>
              ${email ? `
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Email:</td>
                <td style="padding: 10px 0; color: #3D00D6; font-weight: 600;">
                  <a href="mailto:${email.trim()}" style="color: #3D00D6; text-decoration: none;">${email.trim()}</a>
                </td>
              </tr>
              ` : ''}
              ${website ? `
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Website / Link:</td>
                <td style="padding: 10px 0; color: #3D00D6;">
                  <a href="${website.trim()}" target="_blank" rel="noopener noreferrer" style="color: #3D00D6;">${website.trim()}</a>
                </td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Service Interested:</td>
                <td style="padding: 10px 0; color: #8B0095; font-weight: 700;">${servicesInterested.trim()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Budget Range:</td>
                <td style="padding: 10px 0; color: #4b5563;">${budgetRange ? budgetRange.trim() : 'Not Specified'}</td>
              </tr>
              ${message ? `
              <tr style="border-bottom: 1px solid #ececf1;">
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a; vertical-align: top;">Message / Notes:</td>
                <td style="padding: 10px 0; color: #4b5563; line-height: 1.5;">${message.trim()}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #1a1a1a;">Submitted At:</td>
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 8px;">
              WhatsApp Client
            </a>
            ${email ? `
            <a href="mailto:${email.trim()}?subject=The%20Three%20Amigos%20-%20Free%20Marketing%20Audit" style="display: inline-block; background-color: #1A1A1A; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">
              Email Client
            </a>
            ` : ''}
          </div>

          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 28px 0 16px 0;" />
          <p style="font-size: 11px; color: #999999; text-align: center; margin: 0;">
            This is an automated notification generated by The Three Amigos Free Marketing Audit Form.
          </p>
        </div>
      `,
      text: `
New Free Marketing Audit Request

Client Name: ${name.trim()}
Business Name: ${businessName ? businessName.trim() : 'N/A'}
Phone / WhatsApp: ${phone.trim()}
${email ? `Email: ${email.trim()}\n` : ''}${website ? `Website: ${website.trim()}\n` : ''}Service Interested: ${servicesInterested.trim()}
Budget Range: ${budgetRange ? budgetRange.trim() : 'Not Specified'}
${message ? `Message: ${message.trim()}\n` : ''}Submitted At: ${formattedDate}
      `.trim()
    }

    if (email && typeof email === 'string' && email.includes('@')) {
      emailOptions.reply_to = email.trim()
    }

    const { data, error } = await resend.emails.send(emailOptions)

    if (error) {
      console.error('Resend send audit email error:', error)
      return NextResponse.json({ error: error.message || 'Failed to send audit request.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('Audit handler error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to send audit request.' }, { status: 500 })
  }
}

