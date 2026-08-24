import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { portfolioItems } from '@/lib/portfolio-data'
import { getPortfolioItems } from '@/lib/supabase/cms'
import { ChevronRight, ArrowRight, Video, Calendar, Eye, Users } from 'lucide-react'
import NewsletterCTA from '@/components/blog/NewsletterCTA'
import { ClientAvatar } from '@/components/portfolio/PortfolioGrid'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

function getReelId(url: string): string {
  const match = url.match(/\/reel(?:s)?\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : ''
}

function getYoutubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/)
  return match ? match[1] : ''
}

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const allItems = await getPortfolioItems()
  const item = allItems.find((p) => p.slug === slug) || portfolioItems.find((p) => p.slug === slug)
  if (!item) return {}

  return {
    title: `${item.title} | The Three Amigos Portfolio`,
    description: item.description,
    openGraph: {
      title: `${item.title} | The Three Amigos Portfolio`,
      description: item.description,
      url: `https://threeamigos.com/portfolio/${item.slug}`,
      type: 'article',
      images: [{ url: item.thumbnail }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} | The Three Amigos Portfolio`,
      description: item.description,
      images: [item.thumbnail]
    }
  }
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params
  const allItems = await getPortfolioItems()
  const currentIndex = allItems.findIndex((p) => p.slug === slug)
  if (currentIndex === -1) notFound()

  const item = allItems[currentIndex]

  // Find related projects (filter by category and exclude current)
  const related = allItems
    .filter((p) => p.category === item.category && p.slug !== slug)
    .slice(0, 3)

  if (related.length < 3) {
    const extra = allItems.filter((p) => p.slug !== slug && !related.find((r) => r.slug === p.slug))
    related.push(...extra.slice(0, 3 - related.length))
  }

  const isReel = item.category === 'Instagram Reels & Short-form Content'
  const isYT = item.category === 'Long-form YouTube Videos'
  const isPage = item.category === 'Pages We Manage'

  const reelId = isReel ? getReelId(item.url) : ''
  const ytId = isYT ? getYoutubeId(item.url) : ''

  return (
    <div className="w-full bg-transparent relative min-h-screen flex flex-col justify-between">
      <div>
        <Header />

        <main className="py-12 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-black/45 mb-8 select-none" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-purple transition-colors font-semibold">Home</Link>
              <ChevronRight size={12} />
              <Link href="/portfolio" className="hover:text-brand-purple transition-colors font-semibold">Portfolio</Link>
              <ChevronRight size={12} />
              <span className="text-neutral-black/75 line-clamp-1 font-semibold">{item.title}</span>
            </nav>

            {/* Case Study Details */}
            <article className="space-y-12">
              
              {/* Header Titles */}
              <div className="space-y-4 max-w-4xl">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-purple bg-brand-purple/5 border border-brand-purple/10 px-4 py-1.5 rounded-full">
                  {item.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-black leading-tight">
                  {item.title}
                </h1>
                <p className="text-base text-neutral-black/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Dynamic Embed / Media Showcase Container */}
              {isYT && (
                <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-sm relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              {isReel && (
                <div className="max-w-md mx-auto aspect-[9/16] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-sm relative">
                  <iframe
                    src={`https://www.instagram.com/reel/${reelId}/embed/`}
                    className="w-full h-full border-0 absolute inset-0"
                    allowTransparency
                    scrolling="no"
                    allowFullScreen
                  />
                </div>
              )}

              {isPage && (
                <div className="p-8 rounded-3xl border border-gray-150 bg-slate-50/50 flex flex-col md:flex-row gap-6 items-center">
                  <ClientAvatar logo={item.clientLogo} name={item.clientName} className="w-24 h-24 text-2xl" imgPaddingClass="p-4" />
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-neutral-black">{item.clientName}</h3>
                    <p className="text-xs font-black text-brand-purple uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                      <span>{item.platformName} Managed Profile</span>
                    </p>
                    <p className="text-xs md:text-sm text-neutral-black/70 leading-relaxed max-w-xl">
                      This represents an active profile managed by our agency. We handle branding, visual aesthetics, audience engagement, and overall performance strategy.
                    </p>
                  </div>
                </div>
              )}

              {/* Meta Grid info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-gray-150 bg-slate-50/50">
                <div>
                  <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Brand Partner</span>
                  <span className="text-xs font-bold text-neutral-black">{item.clientName || item.clientType || 'Maven Consulting Services'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Platform</span>
                  <span className="text-xs font-bold text-neutral-black">{item.platformName || (isYT ? 'YouTube' : 'Instagram')}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Project Type</span>
                  <span className="text-xs font-bold text-neutral-black">{item.tag}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Scope</span>
                  <span className="text-xs font-bold text-neutral-black">{isPage ? 'Account Management' : 'Content Production'}</span>
                </div>
              </div>

              {/* Details and Description */}
              <div className="grid md:grid-cols-2 gap-12 pt-4">
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold text-neutral-black flex items-center gap-2">
                    <Video size={18} className="text-brand-purple" />
                    Project Strategy
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-black/70 leading-relaxed">
                    Our team focuses on high-impact visual style, strategic timing, search engine optimization, and audience retention. For every piece of content, we develop custom thumbnails, structured scripts, and visual cues that align with the brand identity.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-bold text-neutral-black flex items-center gap-2">
                    <Users size={18} className="text-brand-red" />
                    Delivery Parameters
                  </h2>
                  <ul className="space-y-3 text-xs md:text-sm text-neutral-black/70 list-disc pl-5 leading-relaxed">
                    <li>Dynamic visual layouts matching modern platform formats.</li>
                    <li>Full engagement management and community interaction loops.</li>
                    <li>High quality motion graphics, transitions, and customized scripting.</li>
                  </ul>
                </div>
              </div>

              {/* Related Projects */}
              <div className="pt-12 border-t border-gray-100">
                <h3 className="text-lg font-bold text-neutral-black mb-6">Related Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {related.map((relItem) => (
                    <Link
                      key={relItem.id}
                      href={`/portfolio/${relItem.slug}`}
                      className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-sm p-4 transition-all duration-300 hover:border-brand-purple/20 group"
                    >
                      <div className="aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden mb-3 relative">
                        <img
                          src={relItem.thumbnail}
                          alt={relItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="block text-[8px] font-extrabold text-brand-purple uppercase tracking-wider mb-1">
                        {relItem.tag}
                      </span>
                      <h5 className="text-xs font-bold text-neutral-black line-clamp-1 group-hover:text-brand-purple transition-colors">
                        {relItem.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Call To Action */}
              <div className="p-8 md:p-12 rounded-3xl bg-brand-gradient text-white text-center space-y-6 shadow-md">
                <h4 className="text-2xl md:text-3xl font-bold">Ready to Scale Your Brand Metrics?</h4>
                <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                  Book a free audit/consultation with our team. We'll analyze your current marketing stack, conversion bottlenecks, and draft a custom ROI action plan.
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-purple hover:bg-slate-50 rounded-xl text-xs font-bold hover:shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  <span>View Original Page / Link</span>
                  <ArrowRight size={14} />
                </a>
              </div>

            </article>

            {/* Newsletter CTA container */}
            <NewsletterCTA />

          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
