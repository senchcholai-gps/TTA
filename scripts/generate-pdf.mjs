/**
 * TTA Company Profile — Premium 6-Page PDF Generator
 * ────────────────────────────────────────────────────────
 * Design language: Premium Executive · Minimal Luxury · Annual Report Editorial
 * Layout: 6 pages matching the screenshot references exactly.
 * Background: Pure White, minimal brand accent elements, zero placeholder clutter pages.
 * Library: pdfkit 0.19.x
 */

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ──────────────────────────────────────────────────────────────────────────────
// CONSTANTS & BRAND SYSTEM
// ──────────────────────────────────────────────────────────────────────────────

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 54
const CW = PAGE_W - MARGIN * 2 // Content width = 487.28

const BRAND = {
  red: '#D6003C',
  magenta: '#8B0095',
  purple: '#3D00D6',
  charcoal: '#1A1A1A',
  darkGray: '#2D2D35',
  midGray: '#6B6B78',
  lightGray: '#E8E8EF',
  nearWhite: '#F9F9FB',
  purpleTint: '#F4F3FA',
  white: '#FFFFFF'
}

// Brand gradient generators
function hGrad(doc, x, y, w) {
  const g = doc.linearGradient(x, y, x + w, y)
  g.stop(0, BRAND.red)
  g.stop(0.5, BRAND.magenta)
  g.stop(1, BRAND.purple)
  return g
}

// ──────────────────────────────────────────────────────────────────────────────
// PATH CONTEXT & LOGO HELPERS
// ──────────────────────────────────────────────────────────────────────────────

const OUTPUT = path.join(__dirname, '..', 'public', 'documents', 'TTA_Company_Profile.pdf')
const LOGO_ICON = path.join(__dirname, '..', 'public', 'TTA_Logo_Icon.png')

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  bufferPages: true
})

const writeStream = fs.createWriteStream(OUTPUT)
doc.pipe(writeStream)

// Helper to draw the logo icon inside a dashed border box
function drawLogoBox(doc, x, y, size) {
  doc.save()
  
  // Outer dashed box
  doc.roundedRect(x, y, size, size, 4)
     .lineWidth(0.5)
     .strokeColor(BRAND.midGray)
     .strokeOpacity(0.5)
     .dash(2, { space: 2 })
     .stroke()
  
  // Image draw
  if (fs.existsSync(LOGO_ICON)) {
    doc.image(LOGO_ICON, x + 2, y + 2, { width: size - 4, height: size - 4 })
  } else {
    doc.font('Helvetica-Bold')
       .fontSize(size * 0.2)
       .fillColor(BRAND.midGray)
       .text('LOGO', x, y + (size - size * 0.2) / 2, { width: size, align: 'center' })
  }
  
  doc.restore()
}

// Helper to draw standard page header
function drawPageHeader(doc, pageNum) {
  const y = 54
  
  // Logo
  drawLogoBox(doc, MARGIN, y, 24)
  
  // Title text next to logo
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(7.5)
     .fillColor(BRAND.charcoal)
     .text('THE THREE', MARGIN + 32, y + 3, { lineGap: 0 })
     .text('AMIGOS', MARGIN + 32, y + 11, { lineGap: 0 })
  doc.restore()

  // Right metadata
  doc.save()
  doc.font('Helvetica')
     .fontSize(8.5)
     .fillColor(BRAND.midGray)
     .text(`Company Profile | Page ${pageNum}`, PAGE_W - MARGIN - 120, y + 7, { width: 120, align: 'right' })
  doc.restore()

  // Horizontal separator line
  doc.save()
  doc.rect(MARGIN, y + 36, CW, 0.5).fill(BRAND.lightGray)
  doc.restore()
}

// Helper to draw standard page footer
function drawPageFooter(doc, pageNum) {
  const y = PAGE_H - 72

  // Horizontal top divider line
  doc.save()
  doc.rect(MARGIN, y - 12, CW, 0.5).fill(BRAND.lightGray)
  doc.restore()

  // Left metadata details
  doc.save()
  doc.font('Helvetica')
     .fontSize(8)
     .fillColor(BRAND.midGray)
     .text('www.thethreeamigos.in', MARGIN, y, { lineGap: 2.5 })
     .text('thethreeamigosdm@gmail.com', MARGIN, y + 11, { lineGap: 2.5 })
     .text('Tamil Nadu, India', MARGIN, y + 22, { lineGap: 2.5 })
  doc.restore()

  // Right page number
  const pageStr = String(pageNum).padStart(2, '0')
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(9)
     .fillColor(BRAND.charcoal)
     .text(pageStr, PAGE_W - MARGIN - 30, y + 11, { width: 30, align: 'right' })
  doc.restore()
}

// Helper to draw checkbox element
function drawCheck(doc, x, y, text) {
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(9.5)
     .fillColor(BRAND.purple)
     .text('✓', x, y, { lineBreak: false })
     .fillColor(BRAND.charcoal)
     .text(text, x + 14, y, { lineBreak: false })
  doc.restore()
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1: COVER PAGE
// ══════════════════════════════════════════════════════════════════════════════

// Top left header logo
drawLogoBox(doc, MARGIN, 54, 48)
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(9.5)
   .fillColor(BRAND.charcoal)
   .text('THE THREE AMIGOS', MARGIN + 58, 66)
   .font('Helvetica')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('AI-FIRST MARKETING AGENCY', MARGIN + 58, 78, { characterSpacing: 0.5 })
doc.restore()

// Central Gradient bar & Title text
const barY = 320
const barH = 52
doc.save()
doc.rect(MARGIN, barY, CW, barH).fill(hGrad(doc, MARGIN, barY, CW))
doc.restore()

// Bold title text printed directly over the gradient bar
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(28)
   .fillColor(BRAND.charcoal)
   .text('THE THREE AMIGOS', MARGIN, barY + 14, { width: CW, align: 'center', characterSpacing: 0.5 })
doc.restore()

// Subtitle & taglines below gradient bar
doc.save()
doc.font('Helvetica')
   .fontSize(12)
   .fillColor(BRAND.midGray)
   .text('AI-FIRST MARKETING AGENCY', MARGIN, barY + 72, { width: CW, align: 'center', characterSpacing: 1.5 })

doc.font('Helvetica-Bold')
   .fontSize(14)
   .fillColor(BRAND.charcoal)
   .text('Company Profile', MARGIN, barY + 114, { width: CW, align: 'center' })

doc.font('Helvetica')
   .fontSize(9.5)
   .fillColor(BRAND.midGray)
   .text(
     'Accelerating Business Growth Through AI-Powered Marketing,\nCreative Content, and Performance-Driven Digital Strategies.',
     MARGIN, barY + 154, { width: CW, align: 'center', lineGap: 4 }
   )
doc.restore()

// Tiny centered gradient accent line
doc.save()
doc.rect((PAGE_W - 60) / 2, barY + 214, 60, 2).fill(hGrad(doc, (PAGE_W - 60) / 2, barY + 214, 60))
doc.restore()

// Footer (Horizontal Alignment)
const fY = PAGE_H - 72
doc.save()
doc.font('Helvetica')
   .fontSize(8)
   .fillColor(BRAND.midGray)
   .text('www.thethreeamigos.in', MARGIN, fY, { lineBreak: false })
   .text('thethreeamigosdm@gmail.com', MARGIN, fY, { width: CW, align: 'center' })
   .text('Tamil Nadu, India', PAGE_W - MARGIN - 120, fY, { width: 120, align: 'right', lineBreak: false })
doc.restore()

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2: ABOUT US
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
drawPageHeader(doc, 2)

let py = 124
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(BRAND.charcoal)
   .text('About Us', MARGIN, py)
doc.restore()

py += 42

// Columns: Left (Company Overview) & Right (Vision & Mission)
const colW1 = 230
const colW2 = 241
const col2X = MARGIN + colW1 + 16

// Left Column (Overview)
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('COMPANY OVERVIEW', MARGIN, py, { characterSpacing: 0.8 })

doc.font('Helvetica')
   .fontSize(9)
   .fillColor(BRAND.darkGray)
   .text(
     'The Three Amigos is a forward-thinking AI-first marketing agency dedicated to bridging the gap between traditional brand storytelling and the future of digital technology. We empower businesses to scale by leveraging cutting-edge AI tools, data analytics, and high-impact creative strategies.',
     MARGIN, py + 18,
     { width: colW1 - 10, lineGap: 4.5 }
   )
doc.restore()

// Right Column Callout (Vision & Mission)
doc.save()
doc.roundedRect(col2X, py, colW2, 178, 8)
   .fillColor(BRAND.nearWhite)
   .fill()
doc.roundedRect(col2X, py, colW2, 178, 8)
   .lineWidth(0.5)
   .strokeColor(BRAND.lightGray)
   .stroke()

// Vision text block
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('VISION', col2X + 16, py + 16, { characterSpacing: 0.5 })
   .font('Helvetica')
   .fontSize(9)
   .fillColor(BRAND.darkGray)
   .text(
     'To be the global leader in AI-driven marketing, setting the standard for how brands connect with their audiences in a post-digital world.',
     col2X + 16, py + 28, { width: colW2 - 32, lineGap: 3.5 }
   )

// Mission text block
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('MISSION', col2X + 16, py + 98, { characterSpacing: 0.5 })
   .font('Helvetica')
   .fontSize(9)
   .fillColor(BRAND.darkGray)
   .text(
     'To deliver measurable growth for our clients through the intelligent integration of human creativity and artificial intelligence.',
     col2X + 16, py + 110, { width: colW2 - 32, lineGap: 3.5 }
   )
doc.restore()

py += 210

// Core Values
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('CORE VALUES', MARGIN, py, { characterSpacing: 0.8 })
doc.restore()

py += 18

const values = [
  { title: 'Innovation', desc: 'Constantly exploring the frontiers of AI technology.' },
  { title: 'Transparency', desc: 'Clear communication and data-driven reporting.' },
  { title: 'Excellence', desc: 'Uncompromising quality in every creative output.' }
]

const valW = (CW - 16) / 3
values.forEach((v, idx) => {
  const vX = MARGIN + idx * (valW + 8)

  doc.save()
  doc.roundedRect(vX, py, valW, 88, 8)
     .fillColor(BRAND.white)
     .fill()
  doc.roundedRect(vX, py, valW, 88, 8)
     .lineWidth(0.5)
     .strokeColor(BRAND.lightGray)
     .stroke()

  doc.font('Helvetica-Bold')
     .fontSize(10)
     .fillColor(BRAND.charcoal)
     .text(v.title, vX + 12, py + 14)

  doc.font('Helvetica')
     .fontSize(8.2)
     .fillColor(BRAND.midGray)
     .text(v.desc, vX + 12, py + 30, { width: valW - 24, lineGap: 2.5 })
  doc.restore()
})

drawPageFooter(doc, 2)

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3: OUR SERVICES
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
drawPageHeader(doc, 3)

py = 124
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(BRAND.charcoal)
   .text('Our Services', MARGIN, py)
doc.restore()

py += 36

const servicesList = [
  { tag: 'AI', title: 'AI Strategy', bullets: ['Workflow Automation', 'Custom AI Training', 'Tool Implementation'] },
  { tag: 'GR', title: 'Digital Growth', bullets: ['SEO & SEM', 'Performance Ads', 'Conversion Audit'] },
  { tag: 'CR', title: 'Content Creation', bullets: ['Video Production', 'AI Visuals', 'Copywriting'] },
  { tag: 'SM', title: 'Social Media', bullets: ['Community Mgmt', 'Influencer Collabs', 'Viral Campaigns'] },
  { tag: 'DA', title: 'Data Analytics', bullets: ['Custom Dashboards', 'ROI Tracking', 'User Behavior'] },
  { tag: 'BR', title: 'Branding', bullets: ['Brand Identity', 'Market Positioning', 'Visual Language'] }
]

const cardW = (CW - 16) / 3
const cardH = 124

servicesList.forEach((s, idx) => {
  const col = idx % 3
  const row = Math.floor(idx / 3)
  const cX = MARGIN + col * (cardW + 8)
  const cY = py + row * (cardH + 12)

  doc.save()
  // Card base
  doc.roundedRect(cX, cY, cardW, cardH, 8)
     .fillColor(BRAND.white)
     .fill()
  doc.roundedRect(cX, cY, cardW, cardH, 8)
     .lineWidth(0.5)
     .strokeColor(BRAND.lightGray)
     .stroke()

  // Dashed icon tag box in top-left
  doc.roundedRect(cX + 14, cY + 14, 24, 24, 4)
     .fillColor(BRAND.purpleTint)
     .fill()
  doc.roundedRect(cX + 14, cY + 14, 24, 24, 4)
     .lineWidth(0.5)
     .strokeColor(BRAND.purple)
     .dash(1.5, { space: 1.5 })
     .stroke()

  doc.font('Helvetica-Bold')
     .fontSize(7.5)
     .fillColor(BRAND.purple)
     .text(s.tag, cX + 14, cY + 22, { width: 24, align: 'center' })
  doc.restore()

  // Title
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(10.5)
     .fillColor(BRAND.charcoal)
     .text(s.title, cX + 14, cY + 48)
  doc.restore()

  // Bullet items
  let itemY = cY + 68
  s.bullets.forEach((bullet) => {
    doc.save()
    // Dot bullet
    doc.circle(cX + 17, itemY + 3.5, 1.2).fill(BRAND.purple)
    // Label
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor(BRAND.midGray)
       .text(bullet, cX + 24, itemY)
    doc.restore()
    itemY += 14
  })
})

drawPageFooter(doc, 3)

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 4: WHY CHOOSE US & PROCESS
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
drawPageHeader(doc, 4)

py = 124
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(BRAND.charcoal)
   .text('Why Choose Us', MARGIN, py)
doc.restore()

py += 36

// 6 checkmark items
const whyItems = [
  'AI First', 'Data Driven', 'Creative Excellence',
  'End-to-End Solutions', 'Transparent Reporting', 'Scalable Growth'
]

const wColW = CW / 3
whyItems.forEach((item, idx) => {
  const col = idx % 3
  const row = Math.floor(idx / 3)
  const itemX = MARGIN + col * wColW
  const itemY = py + row * 26

  drawCheck(doc, itemX, itemY, item)
})

py += 74

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(20)
   .fillColor(BRAND.charcoal)
   .text('Working Process', MARGIN, py)
doc.restore()

py += 38

// 5 Process steps
const steps = ['Discovery', 'Strategy', 'Creation', 'Execution', 'Optimization']
const sColW = CW / 5

steps.forEach((step, idx) => {
  const sX = MARGIN + idx * sColW

  // Large process numbers (e.g. 01, 02...)
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(22)
     .fillColor(BRAND.lightGray)
     .text(String(idx + 1).padStart(2, '0'), sX, py)
  doc.restore()

  // Label
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(9.5)
     .fillColor(BRAND.charcoal)
     .text(step, sX, py + 26)
  doc.restore()
})

drawPageFooter(doc, 4)

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 5: LEADERSHIP & INDUSTRIES SERVED
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
drawPageHeader(doc, 5)

py = 124
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(BRAND.charcoal)
   .text('Leadership Team', MARGIN, py)
doc.restore()

py += 36

const leaders = [
  { role: 'Founder', name: 'Amirthashree\nVijayakumar', desc: 'Driving the vision of AI-\nintegrated marketing\nstrategies for global brands.' },
  { role: 'Co-Founder', name: 'Co-Founder Name', desc: 'Leading operations and\ntechnical implementation\nacross all client projects.' },
  { role: 'Creative Head', name: 'Camera & Editor', desc: 'Overseeing visual\nstorytelling and high-fidelity\nvideo production.' }
]

const lColW = (CW - 16) / 3
const lColH = 168

leaders.forEach((l, idx) => {
  const lX = MARGIN + idx * (lColW + 8)

  doc.save()
  // Card base
  doc.roundedRect(lX, py, lColW, lColH, 8)
     .fillColor(BRAND.white)
     .fill()
  doc.roundedRect(lX, py, lColW, lColH, 8)
     .lineWidth(0.5)
     .strokeColor(BRAND.lightGray)
     .stroke()

  // "PHOTO" placeholder box
  doc.roundedRect(lX + 16, py + 16, lColW - 32, 22, 4)
     .fillColor(BRAND.nearWhite)
     .fill()
  doc.roundedRect(lX + 16, py + 16, lColW - 32, 22, 4)
     .lineWidth(0.5)
     .strokeColor(BRAND.lightGray)
     .stroke()
  
  doc.font('Helvetica-Bold')
     .fontSize(7)
     .fillColor(BRAND.midGray)
     .text('PHOTO', lX, py + 23, { width: lColW, align: 'center', characterSpacing: 0.5 })

  // Role tag
  doc.font('Helvetica-Bold')
     .fontSize(7)
     .fillColor(BRAND.midGray)
     .text(l.role.toUpperCase(), lX + 16, py + 52, { characterSpacing: 0.5 })

  // Name
  doc.font('Helvetica-Bold')
     .fontSize(10.5)
     .fillColor(BRAND.charcoal)
     .text(l.name, lX + 16, py + 64, { lineGap: 1 })

  // Biography description
  doc.font('Helvetica')
     .fontSize(8)
     .fillColor(BRAND.midGray)
     .text(l.desc, lX + 16, py + 110, { width: lColW - 32, lineGap: 2 })
  doc.restore()
})

py += lColH + 24

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(18)
   .fillColor(BRAND.charcoal)
   .text('Industries Served', MARGIN, py)
doc.restore()

py += 26

const industries = [
  'E-commerce & Retail', 'Real Estate', 'Health & Wellness',
  'Technology & SaaS', 'Education & EdTech', 'Finance & Fintech'
]

const indColW = CW / 2
industries.forEach((ind, idx) => {
  const col = idx % 2
  const row = Math.floor(idx / 2)
  const indX = MARGIN + col * indColW
  const indY = py + row * 20

  doc.save()
  doc.circle(indX + 4, indY + 5.5, 1.5).fill(BRAND.purple)
  doc.font('Helvetica')
     .fontSize(9.5)
     .fillColor(BRAND.charcoal)
     .text(ind, indX + 14, indY)
  doc.restore()
})

drawPageFooter(doc, 5)

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 6: CONTACT & CLOSING
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
drawPageHeader(doc, 6)

py = 124
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(22)
   .fillColor(BRAND.charcoal)
   .text("Let's Build Your Growth Story", MARGIN, py)
doc.restore()

py += 36

// Contact details card block
doc.save()
doc.roundedRect(MARGIN, py, CW, 120, 8)
   .fillColor(BRAND.nearWhite)
   .fill()
doc.roundedRect(MARGIN, py, CW, 120, 8)
   .lineWidth(0.5)
   .strokeColor(BRAND.lightGray)
   .stroke()

doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('CONTACT DETAILS', MARGIN + 16, py + 14, { characterSpacing: 0.5 })

// Contact lists
const listY1 = py + 28
doc.font('Helvetica-Bold')
   .fontSize(9.5)
   .fillColor(BRAND.charcoal)
   .text('Website:', MARGIN + 16, listY1, { lineBreak: false })
   .font('Helvetica')
   .text(' www.thethreeamigos.in', MARGIN + 60, listY1, { lineBreak: false })

doc.font('Helvetica-Bold')
   .fontSize(9.5)
   .text('Email:', MARGIN + 16, listY1 + 14, { lineBreak: false })
   .font('Helvetica')
   .text(' thethreeamigosdm@gmail.com', MARGIN + 48, listY1 + 14, { lineBreak: false })

doc.font('Helvetica-Bold')
   .fontSize(9.5)
   .text('Location:', MARGIN + 16, listY1 + 28, { lineBreak: false })
   .font('Helvetica')
   .text(' Tamil Nadu, India', MARGIN + 64, listY1 + 28, { lineBreak: false })

// Social follows
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.midGray)
   .text('FOLLOW US', MARGIN + 16, py + 78, { characterSpacing: 0.5 })

doc.font('Helvetica')
   .fontSize(9)
   .fillColor(BRAND.charcoal)
   .text('LinkedIn • Instagram • Facebook • YouTube', MARGIN + 16, py + 92)
doc.restore()

py += 140

// Gradient bar banner: "Let's Grow Together"
doc.save()
doc.rect(MARGIN, py, CW, 38).fill(hGrad(doc, MARGIN, py, CW))
doc.restore()

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(16)
   .fillColor(BRAND.charcoal)
   .text("Let's Grow Together", MARGIN, py + 11, { width: CW, align: 'center', characterSpacing: 0.5 })
doc.restore()

py += 54

doc.save()
doc.font('Helvetica')
   .fontSize(10.5)
   .fillColor(BRAND.charcoal)
   .text('Schedule Your Free Marketing Audit', MARGIN, py, { width: CW, align: 'center' })
doc.restore()

py += 20

// Filled button: "Get Started"
const btnW = 100
const btnH = 26
const btnX = (PAGE_W - btnW) / 2
doc.save()
doc.roundedRect(btnX, py, btnW, btnH, 13)
   .fillColor(BRAND.purple)
   .fill()
doc.font('Helvetica-Bold')
   .fontSize(8.5)
   .fillColor(BRAND.white)
   .text('Get Started', btnX, py + 9, { width: btnW, align: 'center' })
doc.restore()

py += 44

// Bottom Logo and closing greeting
drawLogoBox(doc, (PAGE_W - 44) / 2, py, 44)

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(11)
   .fillColor(BRAND.charcoal)
   .text('Thank You', MARGIN, py + 54, { width: CW, align: 'center' })
doc.restore()

drawPageFooter(doc, 6)

// ══════════════════════════════════════════════════════════════════════════════
// Buffered Pages loop to draw dynamic Page Numbers & footer on every page
// ══════════════════════════════════════════════════════════════════════════════

const range = doc.bufferedPageRange() // start: 0, count: 6

for (let i = range.start; i < range.start + range.count; i++) {
  // Switched to page inside the drawing loop
  doc.switchToPage(i)
}

// ══════════════════════════════════════════════════════════════════════════════
// FINALIZE & EXPORT
// ══════════════════════════════════════════════════════════════════════════════

doc.end()

writeStream.on('finish', () => {
  const stat = fs.statSync(OUTPUT)
  console.log(`\n✅  Premium 6-Page Company Profile PDF generated successfully!`)
  console.log(`    Path : ${OUTPUT}`)
  console.log(`    Size : ${(stat.size / 1024).toFixed(1)} KB`)
  console.log(`    Pages: ${range.count}\n`)
})

writeStream.on('error', (err) => {
  console.error('❌  PDF generation error:', err.message)
  process.exit(1)
})
