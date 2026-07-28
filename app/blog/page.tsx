import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogHero from '@/components/blog/BlogHero'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogGrid from '@/components/blog/BlogGrid'
import NewsletterCTA from '@/components/blog/NewsletterCTA'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog & Insights | The Three Amigos — AI Marketing Agency, Chennai',
  description: 'AI marketing guides, social media strategies, video production insights, performance marketing tips, and industry spotlights from The Three Amigos — Chennai\'s digital marketing and AI agency.',
  keywords: 'digital marketing blog India, AI marketing tips, social media strategy India, Instagram marketing Chennai, performance marketing blog',
  alternates: {
    canonical: 'https://thethreeamigos.in/blog',
  },
  openGraph: {
    title: 'Blog & Insights | The Three Amigos',
    description: 'AI marketing guides, social media strategies, video production insights, and industry spotlights from Chennai\'s digital marketing and AI agency.',
    url: 'https://thethreeamigos.in/blog',
    siteName: 'The Three Amigos',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://thethreeamigos.in/TTA_Logo_Landscape.png',
        width: 1200,
        height: 630,
        alt: 'The Three Amigos — Blog & Insights',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Insights | The Three Amigos',
    description: 'AI marketing guides, social media strategies, and industry spotlights from The Three Amigos.',
    images: ['https://thethreeamigos.in/TTA_Logo_Landscape.png'],
  }
}

export default function BlogPage() {
  // Featured post: first article in the official dataset
  const featured = blogPosts[0]

  return (
    <div className="w-full bg-white relative min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <BlogHero />
        <FeaturedPost post={featured} />
        <BlogGrid posts={blogPosts} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterCTA />
        </div>
      </div>
      <Footer />
    </div>
  )
}
