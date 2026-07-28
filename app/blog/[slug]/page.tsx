import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents from '@/components/blog/TableOfContents'
import ShareButtons from '@/components/blog/ShareButtons'
import RelatedPosts from '@/components/blog/RelatedPosts'
import NewsletterCTA from '@/components/blog/NewsletterCTA'
import { blogPosts } from '@/lib/blog-data'
import { Calendar, Clock, ChevronRight, ArrowLeft, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.tags.join(', '),
    alternates: {
      canonical: post.canonicalUrl,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: post.canonicalUrl,
      siteName: 'The Three Amigos',
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug)
  if (currentIndex === -1) notFound()

  const post = blogPosts[currentIndex]
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  const pageUrl = post.canonicalUrl

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.metaTitle,
    'description': post.metaDescription,
    'image': post.coverImage,
    'datePublished': post.publishDate,
    'keywords': post.tags.join(', '),
    'url': post.canonicalUrl,
    'author': {
      '@type': 'Organization',
      'name': post.author.name,
      'url': 'https://thethreeamigos.in',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'The Three Amigos',
      'url': 'https://thethreeamigos.in',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://thethreeamigos.in/TTA_Logo_Landscape.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
  }

  // To build unique section ids for scroll navigation
  let sectionIndex = 0

  return (
    <div className="w-full bg-white relative min-h-screen flex flex-col justify-between">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <Header />
        <ReadingProgress />

        <main className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-black/45 mb-8 select-none" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-purple transition-colors font-semibold">Home</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-brand-purple transition-colors font-semibold">Blog</Link>
              <ChevronRight size={12} />
              <span className="text-neutral-black/75 line-clamp-1 font-semibold">{post.title}</span>
            </nav>

            <article className="space-y-10">
              
              {/* Header Info */}
              <div className="space-y-6 max-w-4xl">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-purple bg-brand-purple/5 border border-brand-purple/10 px-4 py-1.5 rounded-full">
                  {post.category}
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-black leading-tight">
                  {post.title}
                </h1>

                {/* Author Info */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <span className="block text-xs font-bold text-neutral-black leading-none mb-1">
                        {post.author.name}
                      </span>
                      <span className="block text-[10px] text-neutral-black/45 leading-none">
                        {post.author.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-black/50 sm:border-l sm:border-gray-200 sm:pl-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Cover Image */}
              <div className="h-[250px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-slate-100 relative shadow-sm">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Grid Layout: Content & Sidebar */}
              <div className="grid lg:grid-cols-12 gap-12 items-start pt-6">
                
                {/* Left Side: Article Body */}
                <div className="lg:col-span-8 space-y-8">
                  {post.sections.map((section) => {
                    const currentId = section.heading ? `section-${sectionIndex++}` : undefined

                    return (
                      <div key={section.text.substring(0, 20)} className="space-y-4">
                        {section.heading && (
                          <h2
                            id={currentId}
                            className="text-xl md:text-2xl font-bold text-neutral-black pt-4 border-b border-gray-50 pb-2 scroll-mt-28"
                          >
                            {section.heading}
                          </h2>
                        )}

                        <p className="text-sm text-neutral-black/75 leading-relaxed">
                          {section.text}
                        </p>

                        {section.callout && (
                          <div className="p-6 rounded-2xl bg-brand-purple/5 border-l-4 border-brand-purple text-xs md:text-sm text-neutral-black/80 my-6 flex gap-3">
                            <AlertTriangle size={18} className="text-brand-purple flex-shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium">{section.callout}</p>
                          </div>
                        )}

                        {section.tip && (
                          <div className="p-6 rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 text-xs md:text-sm text-neutral-black/80 my-6 flex gap-3">
                            <Lightbulb size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="leading-relaxed font-medium italic">{section.tip}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Summary Section */}
                  <div className="pt-8 border-t border-gray-100 space-y-4">
                    <h3 className="text-lg font-bold text-neutral-black">Summary</h3>
                    <p className="text-sm text-neutral-black/75 leading-relaxed font-medium">
                      {post.summary}
                    </p>
                  </div>

                  {/* CTA Section */}
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-red/5 via-brand-purple/5 to-white border border-brand-purple/10 space-y-4 my-8">
                    <h4 className="text-base font-bold text-neutral-black">Take Action</h4>
                    <p className="text-sm text-neutral-black/70 leading-relaxed">
                      {post.cta}
                    </p>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white rounded-lg text-xs font-semibold hover:shadow-[0_4px_15px_rgba(214,0,60,0.3)] transition"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Share and Navigations */}
                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <ShareButtons title={post.title} url={pageUrl} />
                  </div>

                  {/* Previous & Next Post Links */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                    {prevPost ? (
                      <Link
                        href={`/blog/${prevPost.slug}`}
                        className="p-5 rounded-2xl border border-gray-150 bg-white hover:border-brand-purple/35 transition-all text-left flex items-start gap-3 group"
                      >
                        <ArrowLeft size={18} className="text-neutral-black/45 mt-0.5 group-hover:-translate-x-1 transition-transform" />
                        <div>
                          <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Previous Article</span>
                          <span className="block text-xs font-bold text-neutral-black group-hover:text-brand-purple transition-colors line-clamp-1">{prevPost.title}</span>
                        </div>
                      </Link>
                    ) : <div />}

                    {nextPost ? (
                      <Link
                        href={`/blog/${nextPost.slug}`}
                        className="p-5 rounded-2xl border border-gray-150 bg-white hover:border-brand-purple/35 transition-all text-right flex items-start justify-end gap-3 group"
                      >
                        <div>
                          <span className="block text-[10px] font-bold text-neutral-black/40 uppercase tracking-wider mb-1">Next Article</span>
                          <span className="block text-xs font-bold text-neutral-black group-hover:text-brand-purple transition-colors line-clamp-1">{nextPost.title}</span>
                        </div>
                        <ArrowRight size={18} className="text-neutral-black/45 mt-0.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : <div />}
                  </div>

                </div>

                {/* Right Side: Sidebar */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                  <TableOfContents sections={post.sections} />
                  
                  {/* Related Services & Industry Links (SEO Internal Linking) */}
                  {(post.relatedServices?.length > 0 || post.relatedIndustries?.length > 0) && (
                    <div className="p-6 rounded-2xl border border-gray-150 bg-white shadow-sm space-y-4">
                      {post.relatedServices?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-neutral-black uppercase tracking-wider mb-2.5">
                            Matching Services
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {post.relatedServices.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                className="text-xs font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 px-3 py-1.5 rounded-lg border border-brand-purple/10 transition-colors"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {post.relatedIndustries?.length > 0 && (
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-neutral-black uppercase tracking-wider mb-2.5">
                            Industry Solutions
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {post.relatedIndustries.map((ind) => (
                              <Link
                                key={ind.name}
                                href={ind.href}
                                className="text-xs font-medium text-neutral-black/75 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {ind.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 rounded-2xl border border-gray-150 bg-white shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-neutral-black uppercase tracking-wider">
                      Share This Article
                    </h4>
                    <ShareButtons title={post.title} url={pageUrl} />
                  </div>
                </div>

              </div>

            </article>

            {/* Related Posts */}
            <RelatedPosts currentSlug={post.slug} category={post.category} posts={blogPosts} />

            {/* Newsletter CTA */}
            <NewsletterCTA />

          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
