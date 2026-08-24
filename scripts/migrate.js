const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join('=').trim();
      if (k && v) process.env[k] = v;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon key is missing in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('=== IDEMPOTENT MIGRATION OF PUBLIC STATIC DATA TO SUPABASE ===');

  // 1. SERVICES MIGRATION
  console.log('\n--- 1. Services ---');
  const staticServices = [
    { title: 'AI Marketing Solutions', description: 'Cutting-edge AI tools for content, automation, personalization, chatbots & lead generation', icon: 'Sparkles', display_order: 1, published: true },
    { title: 'Social Media Marketing', description: 'Strategy, management, organic growth, optimization, and analytics reporting', icon: 'Share2', display_order: 2, published: true },
    { title: 'Content Production & Video Editing', description: 'Camera shoots, video editing, motion graphics, podcasts & scriptwriting', icon: 'Video', display_order: 3, published: true },
    { title: 'Performance Marketing', description: 'Meta Ads, Google Ads, YouTube campaigns, lead generation & retargeting', icon: 'Target', display_order: 4, published: true },
    { title: 'Email Marketing', description: 'Campaign strategy, newsletter design, automation & list segmentation', icon: 'Mail', display_order: 5, published: true },
    { title: 'Influencer Marketing', description: 'Influencer discovery, campaign management, UGC creators & ROI tracking', icon: 'Award', display_order: 6, published: true }
  ];

  const { data: existingServices, error: sErr } = await supabase.from('services').select('title');
  if (sErr) {
    console.error('Failed to query services table:', sErr.message);
  } else {
    const existingServiceTitles = new Set((existingServices || []).map(s => s.title));
    for (const s of staticServices) {
      if (!existingServiceTitles.has(s.title)) {
        const { error } = await supabase.from('services').insert([s]);
        if (error) console.error(`Service insert error (${s.title}):`, error.message);
        else console.log(`Inserted Service: ${s.title}`);
      } else {
        console.log(`Service already exists: ${s.title}`);
      }
    }
  }

  // 2. CLIENT LOGOS MIGRATION
  console.log('\n--- 2. Client Logos ---');
  const staticLogos = [
    { name: 'UNICEF', logo_url: '/logos/optimized/unicef.png', display_order: 1, published: true },
    { name: 'Maven Consulting', logo_url: '/logos/optimized/maven-consulting.png', display_order: 2, published: true },
    { name: 'Jashmi Investment', logo_url: '/logos/optimized/jashmi-investment.png', display_order: 3, published: true },
    { name: 'Maven Education', logo_url: '/logos/optimized/maven-education.png', display_order: 4, published: true },
    { name: 'The Book Show', logo_url: '/logos/optimized/the-book-show.png', display_order: 5, published: true },
    { name: 'Why Tap', logo_url: '/logos/optimized/why-tap.png', display_order: 6, published: true },
    { name: 'Namma Yatri', logo_url: '/logos/optimized/namma-yatri.png', display_order: 7, published: true },
    { name: 'Ather', logo_url: '/logos/optimized/ather.png', display_order: 8, published: true },
    { name: 'Yellow Owl', logo_url: '/logos/optimized/yellow-owl.png', display_order: 9, published: true },
    { name: 'Aaras Chicken', logo_url: '/logos/optimized/aaras-chicken.png', display_order: 10, published: true }
  ];

  const { data: existingLogos, error: lErr } = await supabase.from('client_logos').select('name');
  if (lErr) {
    console.error('Failed to query client_logos table:', lErr.message);
  } else {
    const existingLogoNames = new Set((existingLogos || []).map(l => l.name));
    for (const l of staticLogos) {
      if (!existingLogoNames.has(l.name)) {
        const { error } = await supabase.from('client_logos').insert([l]);
        if (error) console.error(`Client logo insert error (${l.name}):`, error.message);
        else console.log(`Inserted Client Logo: ${l.name}`);
      } else {
        console.log(`Client logo already exists: ${l.name}`);
      }
    }
  }

  // 3. PORTFOLIO MIGRATION
  console.log('\n--- 3. Portfolio Items ---');
  const staticPortfolio = [
    {
      title: "Why 'Perfect' Visa Interview Prep Still Gets You Rejected | F-1 Visa Tips for Indian Students",
      description: 'Detailed analysis of F-1 visa interview strategies, explaining why students get rejected and how to prepare correctly.',
      category: 'Long-form YouTube Videos',
      media_type: 'video',
      media_url: 'https://youtu.be/A-KwfBHe1yg',
      thumbnail_url: 'https://img.youtube.com/vi/A-KwfBHe1yg/maxresdefault.jpg',
      client_name: 'Maven Consulting Services',
      published: true,
      display_order: 1
    },
    {
      title: 'The Truth About Student Housing Abroad | University Living',
      description: 'Comprehensive guide covering accommodation, rental models, cost comparisons, and safety parameters for international students.',
      category: 'Long-form YouTube Videos',
      media_type: 'video',
      media_url: 'https://youtu.be/XIIrNHmyUQw',
      thumbnail_url: 'https://img.youtube.com/vi/XIIrNHmyUQw/maxresdefault.jpg',
      client_name: 'Maven Consulting Services',
      published: true,
      display_order: 2
    },
    {
      title: 'Stevens Institute of Technology | Industry Connections & Career Opportunities',
      description: 'Breakdown of industry networking, location advantages, co-op programs, and graduate outcomes at Stevens Institute of Technology.',
      category: 'Long-form YouTube Videos',
      media_type: 'video',
      media_url: 'https://youtu.be/yJ6WlXwzK9s',
      thumbnail_url: 'https://img.youtube.com/vi/yJ6WlXwzK9s/maxresdefault.jpg',
      client_name: 'Maven Consulting Services',
      published: true,
      display_order: 3
    }
  ];

  const { data: existingPort, error: pErr } = await supabase.from('portfolio_items').select('title');
  if (pErr) {
    console.error('Failed to query portfolio_items table:', pErr.message);
  } else {
    const existingPortTitles = new Set((existingPort || []).map(p => p.title));
    for (const p of staticPortfolio) {
      if (!existingPortTitles.has(p.title)) {
        const { error } = await supabase.from('portfolio_items').insert([p]);
        if (error) console.error(`Portfolio insert error (${p.title}):`, error.message);
        else console.log(`Inserted Portfolio Item: ${p.title}`);
      } else {
        console.log(`Portfolio item already exists: ${p.title}`);
      }
    }
  }

  // 4. BLOG POSTS MIGRATION
  console.log('\n--- 4. Blog Posts ---');
  const staticBlog = [
    {
      title: 'AI vs Traditional Content Creation: What Actually Works for Small Businesses in India',
      slug: 'ai-vs-traditional-content-creation-india',
      excerpt: 'An honest, data-backed breakdown of where AI content tools genuinely save time for Indian SMBs — and where human creativity still has the edge.',
      content: "For small businesses in India, the content creation race has never been faster. AI tools promise to cut production time by 80% — but does that actually translate into real results? Having worked with finance brands, study-abroad consultancies, F&B businesses and e-commerce brands across Chennai and beyond, here's our honest answer.",
      thumbnail_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&auto=format&fit=crop&q=75',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'The 30-Day Instagram Content Calendar That Built a 50K+ Community in Chennai',
      slug: '30-day-instagram-content-calendar-guide',
      excerpt: 'Step-by-step content strategy, post formats, hook templates, and posting schedule used to scale local Tamil & English brand accounts.',
      content: "Posting every day without a strategy is the fastest route to creator burnout. In this guide, we break down the exact 30-day content matrix we use at The Three Amigos for client accounts across Instagram Reels, carousels, and stories.",
      thumbnail_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&auto=format&fit=crop&q=75',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Why Tanglish & Regional Content Beats Generic English Marketing in South India',
      slug: 'tanglish-content-regional-language-marketing-india',
      excerpt: 'Why cultural relevance and regional language hooks out-perform polished global campaigns across Instagram Reels and YouTube in Tamil Nadu.',
      content: "Language is emotion. In South India, brands that communicate in natural, conversational Tanglish connect 3x faster with audiences than brands using generic corporate English.",
      thumbnail_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=75',
      published: true,
      published_at: new Date().toISOString()
    }
  ];

  const { data: existingBlog, error: bErr } = await supabase.from('blog_posts').select('slug');
  if (bErr) {
    console.error('Failed to query blog_posts table:', bErr.message);
  } else {
    const existingBlogSlugs = new Set((existingBlog || []).map(b => b.slug));
    for (const b of staticBlog) {
      if (!existingBlogSlugs.has(b.slug)) {
        const { error } = await supabase.from('blog_posts').insert([b]);
        if (error) console.error(`Blog insert error (${b.slug}):`, error.message);
        else console.log(`Inserted Blog Post: ${b.title}`);
      } else {
        console.log(`Blog post already exists: ${b.slug}`);
      }
    }
  }

  // 5. TESTIMONIALS MIGRATION (4 rows already exist, check idempotency)
  console.log('\n--- 5. Testimonials ---');
  const staticTestimonials = [
    {
      client_name: 'Finance with DSM',
      company: 'Individual Creator',
      role: 'Creator',
      testimonial: 'The Three Amigos completely reshaped how we tell our story on Instagram. Our finance content finally feels simple and relatable to a Tamil-speaking audience — SIPs and Demat accounts explained in a way people actually stop and watch.',
      rating: 5,
      avatar_url: '/finance_dsm_logo.jpg',
      published: true,
      display_order: 1,
    },
    {
      client_name: 'Maven Consulting Services',
      company: 'Consulting Services',
      role: 'Client Partner',
      testimonial: "Our YouTube videos used to get views but not results. After The Three Amigos restructured our scripts and CTAs, we're seeing real consultation inquiries — and our commission-free model finally comes through clearly in every video.",
      rating: 5,
      avatar_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png',
      published: true,
      display_order: 2,
    },
    {
      client_name: 'Mathangee Thiagarajan',
      company: 'Her Finance Stories',
      role: 'Founder',
      testimonial: "Working with The Three Amigos brought structure and consistency to my content that I couldn't manage on my own. They understand finance content and know how to make it feel personal, not preachy.",
      rating: 5,
      avatar_url: null,
      published: true,
      display_order: 3,
    },
    {
      client_name: 'Bakthi Infinity',
      company: 'Devotional Brand',
      role: 'Brand Manager',
      testimonial: 'From content planning to the final edit, The Three Amigos handled everything in-house. Our page finally has a consistent identity across Facebook and Instagram.',
      rating: 5,
      avatar_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
      published: true,
      display_order: 4,
    },
  ];

  const { data: existingTest, error: tErr } = await supabase.from('testimonials').select('client_name');
  if (tErr) {
    console.error('Failed to query testimonials table:', tErr.message);
  } else {
    const existingTestNames = new Set((existingTest || []).map(t => t.client_name));
    for (const t of staticTestimonials) {
      if (!existingTestNames.has(t.client_name)) {
        const { error } = await supabase.from('testimonials').insert([t]);
        if (error) console.error(`Testimonial insert error (${t.client_name}):`, error.message);
        else console.log(`Inserted Testimonial: ${t.client_name}`);
      } else {
        console.log(`Testimonial already exists: ${t.client_name}`);
      }
    }
  }

  console.log('\n=== MIGRATION SCRIPT COMPLETED ===');
}

migrate();
