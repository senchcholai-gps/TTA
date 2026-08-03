import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import NewsletterCTA from '@/components/blog/NewsletterCTA'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Case Studies & Portfolio | The Three Amigos',
  description: 'Explore the high-ticket conversions, viral reach campaigns, and custom AI marketing pipelines we build for leading brands.',
  openGraph: {
    title: 'Our Case Studies & Portfolio | The Three Amigos',
    description: 'Explore the high-ticket conversions, viral reach campaigns, and custom AI marketing pipelines we build for leading brands.',
    url: 'https://threeamigos.com/portfolio',
    siteName: 'The Three Amigos',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Case Studies & Portfolio | The Three Amigos',
    description: 'Explore the high-ticket conversions, viral reach campaigns, and custom AI marketing pipelines we build for leading brands.',
  }
}

export default function PortfolioPage() {
  return (
    <div className="w-full bg-transparent relative">
      <Header />
      
      {/* Main Content Area with Backgrounds and clipping */}
      <div className="relative overflow-hidden w-full animate-fade-in">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(253,251,255,0.75)_0%,rgba(253,251,255,0.25)_100%] pointer-events-none" />
        
        {/* Subtle Purple/Pink Radial Glow Bubbles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-brand-red/10 to-brand-magenta/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-brand-purple/10 to-brand-magenta/10 rounded-full blur-3xl pointer-events-none" />

        {/* Low-opacity TTA Logo Watermarks */}
        <div className="absolute right-[-10%] bottom-[-5%] w-[600px] h-[600px] opacity-[0.03] select-none pointer-events-none z-0">
          <img src="/TTA_Logo_Icon.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute left-[-10%] top-[5%] w-[500px] h-[500px] opacity-[0.03] select-none pointer-events-none z-0">
          <img src="/TTA_Logo_Icon.png" alt="" className="w-full h-full object-contain animate-pulse" style={{ animationDuration: '8s' }} />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-12 bg-transparent z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-extrabold text-brand-purple tracking-widest uppercase flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles size={12} className="text-brand-red" />
              Proven Success
            </span>
            <h1 className="text-4.5xl md:text-6xl font-black tracking-tight text-neutral-black leading-tight">
              Our <span className="text-brand-gradient">Portfolio</span>
            </h1>
            <p className="text-base md:text-lg text-neutral-black/70 max-w-2xl mx-auto leading-relaxed font-semibold">
              Real projects. Real metrics. See how our integrated AI, content production, and media buying campaigns generate growth.
            </p>
          </div>
        </section>

        {/* Interactive Grid component */}
        <div className="mt-8 relative z-10">
          <PortfolioGrid />
        </div>

        {/* Newsletter CTA container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24 relative z-10">
          <NewsletterCTA />
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
