/**
 * TTA Company Profile — Premium PDF Generator
 * ─────────────────────────────────────────────
 * Design language: Premium Corporate · Modern Editorial · Minimal Luxury
 * Library: pdfkit 0.19.x
 *
 * Brand Palette
 *   Red      #D6003C
 *   Magenta  #8B0095
 *   Purple   #3D00D6
 *   Charcoal #1A1A1A
 *   White    #FFFFFF
 */

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ──────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────────────────────────────────────

const PAGE_W    = 595.28
const PAGE_H    = 841.89
const MARGIN    = 52
const CW        = PAGE_W - MARGIN * 2   // content width  = 491.28

const BRAND = {
  red:          '#D6003C',
  magenta:      '#8B0095',
  purple:       '#3D00D6',
  charcoal:     '#1A1A1A',
  darkGray:     '#2D2D35',
  midGray:      '#6B6B78',
  lightGray:    '#E8E8EF',
  nearWhite:    '#F5F5F8',
  purpleTint:   '#EDEBFF',
  purpleBorder: '#C5BFEE',
  white:        '#FFFFFF',
}

// ──────────────────────────────────────────────────────────────────────────────
// GRADIENT FACTORY
// ──────────────────────────────────────────────────────────────────────────────

/** Horizontal brand gradient (red → magenta → purple) */
function hGrad(doc, x, y, w) {
  const g = doc.linearGradient(x, y, x + w, y)
  g.stop(0,   BRAND.red)
  g.stop(0.5, BRAND.magenta)
  g.stop(1,   BRAND.purple)
  return g
}

/** Vertical brand gradient (top → bottom) */
function vGrad(doc, x, y, h) {
  const g = doc.linearGradient(x, y, x, y + h)
  g.stop(0,   BRAND.red)
  g.stop(0.5, BRAND.magenta)
  g.stop(1,   BRAND.purple)
  return g
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITY: draw a thin 0.5pt horizontal gradient rule
// ──────────────────────────────────────────────────────────────────────────────
function gradRule(doc, x, y, w, h = 0.5) {
  doc.save()
  doc.rect(x, y, w, h).fill(hGrad(doc, x, y, w))
  doc.restore()
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITY: section eyebrow label + accent bar
//   Returns how much y was consumed.
// ──────────────────────────────────────────────────────────────────────────────
function sectionLabel(doc, text, x, y, color = BRAND.purple) {
  // Label text
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(6.5)
     .fillColor(color)
     .text(text, x, y, { characterSpacing: 1.5, lineBreak: false })
  doc.restore()

  // Accent bar: thin gradient 48pt wide
  doc.save()
  doc.rect(x, y + 13, 48, 1.2).fill(hGrad(doc, x, y + 13, 48))
  doc.restore()

  return 22   // total height consumed
}

// ──────────────────────────────────────────────────────────────────────────────
// UTILITY: draw a check-circle outline icon
// ──────────────────────────────────────────────────────────────────────────────
function checkCircle(doc, cx, cy, r, color) {
  doc.save()

  // Circle outline
  doc.circle(cx, cy, r)
     .lineWidth(0.8)
     .strokeColor(color)
     .strokeOpacity(0.55)
     .stroke()

  // Checkmark inside (three-point path)
  const s = r * 0.4
  doc.moveTo(cx - s, cy)
     .lineTo(cx - s * 0.2, cy + s * 0.8)
     .lineTo(cx + s * 0.9, cy - s * 0.7)
     .lineWidth(0.9)
     .strokeColor(color)
     .strokeOpacity(0.65)
     .stroke()

  doc.restore()
}

// ──────────────────────────────────────────────────────────────────────────────
// PATHS
// ──────────────────────────────────────────────────────────────────────────────
const OUTPUT     = path.join(__dirname, '..', 'public', 'documents', 'TTA_Company_Profile.pdf')
const LOGO_WHITE = path.join(__dirname, '..', 'public', 'TTA_Logo_Landscape_White.png')
const LOGO_COLOR = path.join(__dirname, '..', 'public', 'TTA_Logo_Landscape.png')

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })

// ──────────────────────────────────────────────────────────────────────────────
// DOCUMENT
// ──────────────────────────────────────────────────────────────────────────────

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title:    'The Three Amigos — Company Profile',
    Author:   'The Three Amigos Agency',
    Subject:  'Official Company Profile',
    Keywords: 'TTA, AI Marketing, Agency, Company Profile',
    Creator:  'TTA Internal Documents v1.0',
  },
})

const writeStream = fs.createWriteStream(OUTPUT)
doc.pipe(writeStream)

// ══════════════════════════════════════════════════════════════════════════════
// ❶  COVER HEADER  (0 → 178pt)
// ══════════════════════════════════════════════════════════════════════════════

const HEADER_H = 178

// ── Full-width gradient fill ──────────────────────────────────────────────────
doc.save()
doc.rect(0, 0, PAGE_W, HEADER_H).fill(hGrad(doc, 0, 0, PAGE_W))
doc.restore()

// ── Subtle decorative circle (top-right) ──────────────────────────────────────
// Two nested, semi-transparent white circles give depth without clutter
doc.save()
doc.circle(PAGE_W - 54, -22, 148)
   .fillOpacity(0.05)
   .fill(BRAND.white)
doc.restore()

doc.save()
doc.circle(PAGE_W - 12, 12, 88)
   .fillOpacity(0.04)
   .fill(BRAND.white)
doc.restore()

// ── LEFT COLUMN: Text content ─────────────────────────────────────────────────
const TXT_X = MARGIN

// Company name — largest element
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(31)
   .fillColor(BRAND.white)
   .fillOpacity(1)
   .text('The Three Amigos', TXT_X, 30, { lineBreak: false })
doc.restore()

// Agency descriptor line
doc.save()
doc.font('Helvetica')
   .fontSize(11)
   .fillColor(BRAND.white)
   .fillOpacity(0.72)
   .text('AI Marketing Agency', TXT_X, 68, { lineBreak: false })
doc.restore()

// Thin white rule (100pt) between descriptor and profile title
doc.save()
doc.rect(TXT_X, 88, 80, 0.75)
   .fillOpacity(0.30)
   .fill(BRAND.white)
doc.restore()

// "Company Profile" — medium-large
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(19.5)
   .fillColor(BRAND.white)
   .fillOpacity(1)
   .text('Company Profile', TXT_X, 98, { lineBreak: false })
doc.restore()

// Meta line — small, uppercase, wide tracking
doc.save()
doc.font('Helvetica')
   .fontSize(7)
   .fillColor(BRAND.white)
   .fillOpacity(0.55)
   .text('OFFICIAL DOCUMENT  ·  CONFIDENTIAL  ·  ISSUED JULY 2026', TXT_X, 128, {
     lineBreak: false,
     characterSpacing: 0.4,
   })
doc.restore()

// ── RIGHT COLUMN: TTA Logo ────────────────────────────────────────────────────
// Logo positioned top-right with generous breathing room
// Logo area: x=340 to 543 (width ~203pt), vertically centred in header
const LOGO_AREA_X = 332
const LOGO_AREA_W = PAGE_W - LOGO_AREA_X - MARGIN - 8
const LOGO_AREA_H = HEADER_H - 30  // vertical space available
const LOGO_AREA_Y = 15

const LOGO_MAX_W = LOGO_AREA_W        // max width  ≈ 203pt
const LOGO_MAX_H = LOGO_AREA_H - 16  // max height ≈ 117pt

if (fs.existsSync(LOGO_WHITE)) {
  // Calculate aspect ratio to centre properly
  // TTA Landscape logo is roughly 1140×448 (≈ 2.54 : 1)
  const LOGO_ASPECT = 1140 / 448
  const fitH = Math.min(LOGO_MAX_H, LOGO_MAX_W / LOGO_ASPECT)
  const fitW = fitH * LOGO_ASPECT

  const logoX = LOGO_AREA_X + (LOGO_AREA_W - fitW) / 2
  const logoY = LOGO_AREA_Y + (LOGO_AREA_H - fitH) / 2 + 8

  doc.image(LOGO_WHITE, logoX, logoY, {
    width:  fitW,
    height: fitH,
  })
}

// ── Bottom edge: very thin white separator line ───────────────────────────────
doc.save()
doc.rect(0, HEADER_H - 1, PAGE_W, 1)
   .fillOpacity(0.15)
   .fill(BRAND.white)
doc.restore()

// ══════════════════════════════════════════════════════════════════════════════
// ❷  BODY
// ══════════════════════════════════════════════════════════════════════════════
// Body starts at y = HEADER_H, white background (implicit)
// Body ends at y = 782pt (footer begins there)

let y = HEADER_H + 30  // 30pt breathing room beneath header

// ──────────────────────────────────────────────────────────────────────────────
// ❷·A  COMPANY OVERVIEW
// ──────────────────────────────────────────────────────────────────────────────

y += sectionLabel(doc, 'COMPANY OVERVIEW', MARGIN, y, BRAND.red)
y += 6  // gap before body text

// Lead paragraph — semi-bold, slightly larger
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(9.8)
   .fillColor(BRAND.darkGray)
   .fillOpacity(1)
   .text(
     'The Three Amigos (TTA) is an AI-powered marketing agency helping modern brands achieve measurable business growth through strategy, creativity, and technology.',
     MARGIN, y,
     { width: CW, lineGap: 4.5, align: 'left' }
   )
y = doc.y + 11
doc.restore()

// Body paragraph — regular weight, comfortable reading size
doc.save()
doc.font('Helvetica')
   .fontSize(9.5)
   .fillColor(BRAND.darkGray)
   .fillOpacity(0.82)
   .text(
     'Our expertise spans social media management, content production, video editing, AI-assisted creative workflows, influencer collaborations, and performance marketing. Rather than delivering isolated marketing services, we build integrated growth systems that increase brand awareness, generate qualified leads, and create sustainable long-term business impact.',
     MARGIN, y,
     { width: CW, lineGap: 4, align: 'left' }
   )
y = doc.y
doc.restore()

y += 28  // generous breathing room before next section

// Thin full-width gradient rule
gradRule(doc, MARGIN, y, CW, 0.5)

y += 24  // space after rule

// ──────────────────────────────────────────────────────────────────────────────
// ❷·B  LEADERSHIP TEAM
// ──────────────────────────────────────────────────────────────────────────────

y += sectionLabel(doc, 'LEADERSHIP TEAM', MARGIN, y, BRAND.purple)
y += 5

// Section description
doc.save()
doc.font('Helvetica')
   .fontSize(9)
   .fillColor(BRAND.midGray)
   .fillOpacity(1)
   .text(
     'Meet the people responsible for leading strategy, creative execution, and production at The Three Amigos.',
     MARGIN, y,
     { width: CW, lineGap: 2.5 }
   )
y = doc.y + 14
doc.restore()

// ── Premium Table ─────────────────────────────────────────────────────────────

const TABLE_X       = MARGIN
const TABLE_W       = CW
const HEADER_ROW_H  = 32
const DATA_ROW_H    = 40
const COL_ROLE_W    = TABLE_W * 0.28    // 28% for Role
const COL_NAME_W    = TABLE_W - COL_ROLE_W  // 72% for Name

const TEAM = [
  { role: 'Founder',         name: 'Amirthashree Vijayakumar' },
  { role: 'Co-Founder',      name: 'Ravindhar Devaraj'        },
  { role: 'Camera & Editor', name: 'Nagaraj'                  },
]
const ROLE_COLORS = [BRAND.red, BRAND.magenta, BRAND.purple]

// Table outer container (very light gray background for depth)
const TOTAL_TABLE_H = HEADER_ROW_H + TEAM.length * DATA_ROW_H

// Subtle shadow layer
doc.save()
doc.roundedRect(TABLE_X + 1.5, y + 1.5, TABLE_W, TOTAL_TABLE_H, 6)
   .fillOpacity(0.06)
   .fill(BRAND.purple)
doc.restore()

// ── Table header row (gradient) ───────────────────────────────────────────────
doc.save()
doc.roundedRect(TABLE_X, y, TABLE_W, HEADER_ROW_H + 6, 6)
   .fill(hGrad(doc, TABLE_X, y, TABLE_W))
// Square off bottom corners (overlay a rect to cancel the rounding on the bottom)
doc.rect(TABLE_X, y + HEADER_ROW_H / 2, TABLE_W, HEADER_ROW_H / 2 + 6)
   .fill(hGrad(doc, TABLE_X, y + HEADER_ROW_H / 2, TABLE_W))
doc.restore()

// Header column labels
const HEADER_TEXT_Y = y + (HEADER_ROW_H - 8) / 2
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.white)
   .fillOpacity(0.9)
   .text('ROLE', TABLE_X + 16, HEADER_TEXT_Y, { characterSpacing: 1, lineBreak: false })
doc.restore()

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.white)
   .fillOpacity(0.9)
   .text('NAME', TABLE_X + COL_ROLE_W + 16, HEADER_TEXT_Y, { characterSpacing: 1, lineBreak: false })
doc.restore()

y += HEADER_ROW_H

// ── Data rows ─────────────────────────────────────────────────────────────────
TEAM.forEach((member, i) => {
  const rowY = y
  const isLast = i === TEAM.length - 1
  const rowColor = i % 2 === 0 ? BRAND.nearWhite : BRAND.white

  // Row background (with rounded bottom corners on the last row)
  doc.save()
  if (isLast) {
    doc.rect(TABLE_X, rowY, TABLE_W, DATA_ROW_H / 2).fill(rowColor)
    doc.roundedRect(TABLE_X, rowY + DATA_ROW_H / 2 - 6, TABLE_W, DATA_ROW_H / 2 + 6, 6).fill(rowColor)
  } else {
    doc.rect(TABLE_X, rowY, TABLE_W, DATA_ROW_H).fill(rowColor)
  }
  doc.restore()

  // Left accent bar (colour-coded per role)
  doc.save()
  if (isLast) {
    doc.rect(TABLE_X, rowY, 3.5, DATA_ROW_H - 6).fill(ROLE_COLORS[i])
    doc.roundedRect(TABLE_X, rowY + DATA_ROW_H - 10, 3.5, 10, 2).fill(ROLE_COLORS[i])
  } else {
    doc.rect(TABLE_X, rowY, 3.5, DATA_ROW_H).fill(ROLE_COLORS[i])
  }
  doc.restore()

  // Column divider (subtle vertical line)
  doc.save()
  doc.rect(TABLE_X + COL_ROLE_W, rowY + 10, 0.5, DATA_ROW_H - 20)
     .fillOpacity(0.18)
     .fill(BRAND.midGray)
  doc.restore()

  // Row bottom border (not on the last row)
  if (!isLast) {
    doc.save()
    doc.rect(TABLE_X, rowY + DATA_ROW_H - 0.5, TABLE_W, 0.5)
       .fillOpacity(0.12)
       .fill(BRAND.lightGray)
    doc.restore()
  }

  // Role text (coloured, semi-bold)
  const textCentreY = rowY + (DATA_ROW_H - 10) / 2
  doc.save()
  doc.font('Helvetica-Bold')
     .fontSize(9)
     .fillColor(ROLE_COLORS[i])
     .fillOpacity(1)
     .text(member.role, TABLE_X + 16, textCentreY, { lineBreak: false })
  doc.restore()

  // Name text (regular, charcoal)
  doc.save()
  doc.font('Helvetica')
     .fontSize(9.5)
     .fillColor(BRAND.darkGray)
     .fillOpacity(1)
     .text(member.name, TABLE_X + COL_ROLE_W + 16, textCentreY, { lineBreak: false })
  doc.restore()

  y += DATA_ROW_H
})

// Table outer border (very fine)
doc.save()
doc.roundedRect(TABLE_X, y - TOTAL_TABLE_H, TABLE_W, TOTAL_TABLE_H, 6)
   .lineWidth(0.5)
   .strokeColor(BRAND.lightGray)
   .strokeOpacity(0.8)
   .stroke()
doc.restore()

y += 26  // space after table

// ──────────────────────────────────────────────────────────────────────────────
// ❷·C  INFORMATION CARD — "Future Updates"
// ──────────────────────────────────────────────────────────────────────────────

const CARD_PADDING  = 18
const CARD_W        = TABLE_W
const CARD_ACCENT_W = 4

// Pre-estimate card height: heading line + 3-4 body lines + padding
const CARD_H = 106

// Subtle shadow
doc.save()
doc.roundedRect(TABLE_X + 2, y + 2, CARD_W, CARD_H, 7)
   .fillOpacity(0.06)
   .fill(BRAND.purple)
doc.restore()

// Card body (very light purple tint)
doc.save()
doc.roundedRect(TABLE_X, y, CARD_W, CARD_H, 7)
   .fill(BRAND.purpleTint)
doc.restore()

// Left accent bar (gradient vertical)
doc.save()
// Fill left-side strip with a vertical gradient
doc.rect(TABLE_X, y + 7, CARD_ACCENT_W, CARD_H - 14)
   .fill(vGrad(doc, TABLE_X, y + 7, CARD_H - 14))
// Top rounded cap
doc.roundedRect(TABLE_X, y, CARD_ACCENT_W, 14, 4)
   .fill(BRAND.red)
// Bottom rounded cap
doc.roundedRect(TABLE_X, y + CARD_H - 14, CARD_ACCENT_W, 14, 4)
   .fill(BRAND.purple)
doc.restore()

// Card border (very subtle)
doc.save()
doc.roundedRect(TABLE_X, y, CARD_W, CARD_H, 7)
   .lineWidth(0.6)
   .strokeColor(BRAND.purpleBorder)
   .strokeOpacity(0.45)
   .stroke()
doc.restore()

// ── Info icon (small filled circle with "i") ──────────────────────────────────
const ICON_CX = TABLE_X + CARD_PADDING + 2 + CARD_ACCENT_W + 8
const ICON_CY = y + CARD_PADDING + 6

doc.save()
doc.circle(ICON_CX, ICON_CY, 8).fill(BRAND.purple)
doc.font('Helvetica-Bold')
   .fontSize(8.5)
   .fillColor(BRAND.white)
   .text('i', ICON_CX - 2, ICON_CY - 5.5, { lineBreak: false })
doc.restore()

// Card heading — "Future Updates"
doc.save()
doc.font('Helvetica-Bold')
   .fontSize(10)
   .fillColor(BRAND.purple)
   .text('Future Updates', ICON_CX + 16, y + CARD_PADDING - 1, { lineBreak: false })
doc.restore()

// Thin rule below heading
doc.save()
doc.rect(TABLE_X + CARD_ACCENT_W + CARD_PADDING, y + CARD_PADDING + 17, CARD_W - CARD_ACCENT_W - CARD_PADDING * 2, 0.4)
   .fillOpacity(0.2)
   .fill(BRAND.purple)
doc.restore()

// Card body text
const CARD_TEXT_X = TABLE_X + CARD_ACCENT_W + CARD_PADDING + 2
const CARD_TEXT_W = CARD_W - CARD_ACCENT_W - CARD_PADDING * 2 - 4

doc.save()
doc.font('Helvetica')
   .fontSize(8.8)
   .fillColor(BRAND.darkGray)
   .fillOpacity(0.82)
   .text(
     'Additional company information—including leadership biographies, team photography, portfolio highlights, certifications, and company credentials—will be incorporated as these assets become available.',
     CARD_TEXT_X, y + CARD_PADDING + 24,
     { width: CARD_TEXT_W, lineGap: 3 }
   )
doc.restore()

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(8.5)
   .fillColor(BRAND.purple)
   .fillOpacity(0.7)
   .text(
     'This document represents the current approved company profile.',
     CARD_TEXT_X, y + CARD_PADDING + 68,
     { width: CARD_TEXT_W, lineGap: 2 }
   )
doc.restore()

y += CARD_H + 28

// ──────────────────────────────────────────────────────────────────────────────
// ❷·D  UPCOMING PROFILE SECTIONS
// ──────────────────────────────────────────────────────────────────────────────

y += sectionLabel(doc, 'UPCOMING PROFILE SECTIONS', MARGIN, y, BRAND.charcoal)
y += 8

const UPCOMING_ITEMS = [
  'Mission & Vision',
  'Core Services',
  'Client Portfolio',
  'Case Studies',
  'Leadership Profiles',
  'Team Photography',
  'Awards & Certifications',
  'Contact Information',
]

const COL_ITEM_W = CW / 2
const ITEM_ROW_H = 22
const ROWS        = Math.ceil(UPCOMING_ITEMS.length / 2)

const checkColors = [BRAND.red, BRAND.purple, BRAND.magenta, BRAND.purple]

UPCOMING_ITEMS.forEach((item, i) => {
  const col    = i % 2
  const row    = Math.floor(i / 2)
  const itemX  = MARGIN + col * COL_ITEM_W
  const itemY  = y + row * ITEM_ROW_H
  const iconCY = itemY + 5.5
  const color  = checkColors[row % checkColors.length]

  // Draw check-circle icon
  checkCircle(doc, itemX + 7, iconCY, 5.5, color)

  // Item label
  doc.save()
  doc.font('Helvetica')
     .fontSize(9)
     .fillColor(BRAND.darkGray)
     .fillOpacity(0.78)
     .text(item, itemX + 19, itemY, { lineBreak: false })
  doc.restore()
})

y += ROWS * ITEM_ROW_H + 14

// ══════════════════════════════════════════════════════════════════════════════
// ❸  FOOTER  (PAGE_H - 62 → PAGE_H)
// ══════════════════════════════════════════════════════════════════════════════

const FOOTER_H = 60
const FOOTER_Y = PAGE_H - FOOTER_H

// Footer background (very light, off-white)
doc.save()
doc.rect(0, FOOTER_Y, PAGE_W, FOOTER_H).fill('#F3F3F6')
doc.restore()

// Top gradient rule (full width, 1.5pt)
gradRule(doc, 0, FOOTER_Y, PAGE_W, 1.5)

// ── Left column: logo + descriptor ───────────────────────────────────────────
const FOOTER_LOGO_X = MARGIN
const FOOTER_LOGO_Y = FOOTER_Y + 14

if (fs.existsSync(LOGO_COLOR)) {
  doc.image(LOGO_COLOR, FOOTER_LOGO_X, FOOTER_LOGO_Y, { height: 18 })
}

doc.save()
doc.font('Helvetica')
   .fontSize(6.8)
   .fillColor(BRAND.midGray)
   .text('AI Marketing Agency', FOOTER_LOGO_X, FOOTER_LOGO_Y + 22, { lineBreak: false })
doc.restore()

// ── Centre column: contact details ───────────────────────────────────────────
const CENTRE_X = PAGE_W / 2

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7.5)
   .fillColor(BRAND.darkGray)
   .text('hello@threeamigos.com', CENTRE_X - 78, FOOTER_Y + 16, { lineBreak: false })
doc.restore()

doc.save()
doc.font('Helvetica')
   .fontSize(7)
   .fillColor(BRAND.midGray)
   .text('Chennai, India', CENTRE_X - 78, FOOTER_Y + 28, { lineBreak: false })
doc.restore()

doc.save()
doc.font('Helvetica')
   .fontSize(7)
   .fillColor(BRAND.midGray)
   .text('www.threeamigos.in', CENTRE_X - 78, FOOTER_Y + 39, { lineBreak: false })
doc.restore()

// ── Right column: metadata + page number ─────────────────────────────────────
const RIGHT_X = PAGE_W - MARGIN

doc.save()
doc.font('Helvetica')
   .fontSize(7)
   .fillColor(BRAND.midGray)
   .text('Version 1.0  ·  Issued July 2026', RIGHT_X - 108, FOOTER_Y + 16, { lineBreak: false })
doc.restore()

doc.save()
doc.font('Helvetica-Bold')
   .fontSize(7)
   .fillColor(BRAND.midGray)
   .text('CONFIDENTIAL', RIGHT_X - 54, FOOTER_Y + 28, { lineBreak: false, characterSpacing: 0.4 })
doc.restore()

// Page number — right-aligned
doc.save()
doc.font('Helvetica')
   .fontSize(7)
   .fillColor(BRAND.midGray)
   .text('Page 1 of 1', RIGHT_X - 42, FOOTER_Y + 39, { lineBreak: false })
doc.restore()

// ── Thin vertical separator lines in footer ───────────────────────────────────
doc.save()
// Left separator (between logo col and centre col)
doc.rect(CENTRE_X - 104, FOOTER_Y + 14, 0.4, FOOTER_H - 28)
   .fillOpacity(0.15)
   .fill(BRAND.midGray)
// Right separator (between centre col and meta col)
doc.rect(CENTRE_X + 66, FOOTER_Y + 14, 0.4, FOOTER_H - 28)
   .fillOpacity(0.15)
   .fill(BRAND.midGray)
doc.restore()

// ══════════════════════════════════════════════════════════════════════════════
// FINALIZE
// ══════════════════════════════════════════════════════════════════════════════

doc.end()

writeStream.on('finish', () => {
  const stat = fs.statSync(OUTPUT)
  console.log(`\n✅  Premium Company Profile PDF generated`)
  console.log(`    Path : ${OUTPUT}`)
  console.log(`    Size : ${(stat.size / 1024).toFixed(1)} KB\n`)
})

writeStream.on('error', (err) => {
  console.error('❌  PDF generation error:', err.message)
  process.exit(1)
})
