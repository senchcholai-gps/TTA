export interface PortfolioMetricComparison {
  label: string
  before: string
  after: string
  badge: string
}

export interface PortfolioDeliverable {
  title: string
  type: 'image' | 'video'
  url: string
}

export interface PortfolioTestimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

export interface PortfolioItem {
  id: string
  slug: string
  title: string
  category: 'Instagram Reels & Short-form Content' | 'Long-form YouTube Videos' | 'Pages We Manage'
  tag: string
  description: string
  thumbnail: string
  url: string
  industry?: string
  clientType?: string
  duration?: string
  services?: string[]
  metric?: string
  metricLabel?: string
  platforms?: string[]
  challenge?: string
  strategy?: string[]
  deliverables?: PortfolioDeliverable[]
  results?: PortfolioMetricComparison[]
  testimonial?: PortfolioTestimonial
  featured?: boolean
  // Specific to Pages We Manage
  clientName?: string
  clientLogo?: string
  platformName?: string
}

export const portfolioCategories = [
  'All',
  'Instagram Reels & Short-form Content',
  'Long-form YouTube Videos',
  'Pages We Manage'
] as const

export type PortfolioCategory = (typeof portfolioCategories)[number]

export const portfolioItems: PortfolioItem[] = [
  // 1. Instagram Reels
  {
    id: 'r1',
    slug: 'visa-interview-success-guide',
    title: 'Student Visa Interview Success Guide',
    category: 'Instagram Reels & Short-form Content',
    tag: 'Instagram Reel',
    description: 'Expert F-1 Student visa preparation advice and mock interview strategies.',
    thumbnail: 'https://images.weserv.nl/?url=https://www.instagram.com/p/DAQxi9LyH9G/media/?size=l',
    url: 'https://www.instagram.com/reel/DAQxi9LyH9G/',
    industry: 'Overseas Education',
    clientType: 'Consulting Services',
    duration: '1 Min',
    services: ['Content Strategy', 'Video Editing', 'Short-form Production'],
    platforms: ['Instagram'],
    challenge: 'Simplifying complex immigration and student visa processes into engaging 60-second video guides.',
    strategy: [
      'Focus on high-value mock interview questions.',
      'Add dynamic captions and visual hooks.',
      'Include a clear call-to-action for visa consulting.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'The Reels generated a substantial influx of qualified student inquiries directly through DMs.',
      author: 'Maven Consulting Team',
      role: 'Education Consultant',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: true
  },
  {
    id: 'r2',
    slug: 'personal-finance-smart-investing',
    title: 'Personal Finance & Smart Investing',
    category: 'Instagram Reels & Short-form Content',
    tag: 'Instagram Reel',
    description: 'Educational vertical reel breaking down financial literacy concepts.',
    thumbnail: 'https://images.weserv.nl/?url=https://www.instagram.com/p/DNVyvpVhEQ6/media/?size=l',
    url: 'https://www.instagram.com/finance_with_dsm/reel/DNVyvpVhEQ6/',
    industry: 'Finance',
    clientType: 'Individual Creator',
    duration: '1 Min',
    services: ['Script Writing', 'Video Editing', 'Creator Brand Strategy'],
    platforms: ['Instagram'],
    challenge: 'Making financial literacy engaging, clean, and understandable for young investors.',
    strategy: [
      'Use high-quality transitions and visual assets.',
      'Explain complex saving/investing strategies in under a minute.',
      'Implement an active engagement workflow in the comments.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Organic engagement on our financial content increased dramatically month-over-month.',
      author: 'Finance with DSM',
      role: 'Creator',
      avatar: ''
    },
    featured: true
  },
  {
    id: 'r3',
    slug: 'study-abroad-planning-timeline',
    title: 'Study Abroad Planning Timeline',
    category: 'Instagram Reels & Short-form Content',
    tag: 'Instagram Reel',
    description: 'A comprehensive step-by-step planning guide for overseas education.',
    thumbnail: 'https://images.weserv.nl/?url=https://www.instagram.com/p/DbI_YsXBmiN/media/?size=l',
    url: 'https://www.instagram.com/reel/DbI_YsXBmiN/',
    industry: 'Overseas Education',
    clientType: 'Consulting Services',
    duration: '1 Min',
    services: ['Content Design', 'Short-form Production', 'Timeline Graphics'],
    platforms: ['Instagram'],
    challenge: 'Structuring a 12-month study abroad preparation timeline into a fast-paced vertical video.',
    strategy: [
      'Utilize timeline visual animations.',
      'Highlight critical monthly milestones.',
      'Provide a link to a downloadable checklist.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Great visual layout that helped clarify the complex application journey for students.',
      author: 'Maven Consulting Team',
      role: 'Student Counselor',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: true
  },
  {
    id: 'r4',
    slug: 'academic-profile-building-strategies',
    title: 'Academic Profile Building Strategies',
    category: 'Instagram Reels & Short-form Content',
    tag: 'Instagram Reel',
    description: 'Key tips on how students can build a strong profile for top university applications.',
    thumbnail: 'https://images.weserv.nl/?url=https://www.instagram.com/p/DafonuFJrjO/media/?size=l',
    url: 'https://www.instagram.com/reel/DafonuFJrjO/',
    industry: 'Overseas Education',
    clientType: 'Consulting Services',
    duration: '1 Min',
    services: ['Editing & Motion Graphics', 'SEO Caption Optimization'],
    platforms: ['Instagram'],
    challenge: 'Explaining multi-dimensional profile building concepts (internships, projects) concisely.',
    strategy: [
      'Break down profile components into three pillars.',
      'Use high-energy pacing and clean iconography.',
      'Include calls-to-action to book free counseling.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Direct student reach and counseling inquiries reached all-time highs during this campaign.',
      author: 'Maven Consulting Team',
      role: 'Consulting Director',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: false
  },
  {
    id: 'r5',
    slug: 'scholarship-funding-opportunities',
    title: 'Scholarship & Funding Opportunities',
    category: 'Instagram Reels & Short-form Content',
    tag: 'Instagram Reel',
    description: 'Breaking down common myths about university scholarships and funding for international students.',
    thumbnail: 'https://images.weserv.nl/?url=https://www.instagram.com/p/Da77mUFpSo6/media/?size=l',
    url: 'https://www.instagram.com/reel/Da77mUFpSo6/',
    industry: 'Overseas Education',
    clientType: 'Consulting Services',
    duration: '1 Min',
    services: ['Content Production', 'Motion Graphics', 'Audience Retargeting'],
    platforms: ['Instagram'],
    challenge: 'Dispersing the myth that scholarships are only for academic geniuses and demonstrating accessibility.',
    strategy: [
      'Contrast standard assumptions with real funding options.',
      'Use overlays highlighting real scholarship names and application links.',
      'Incorporate student testimonial quotes.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Helped demystify scholarships, prompting students to reach out for profile reviews.',
      author: 'Maven Consulting Team',
      role: 'Education Advisor',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: false
  },

  // 2. Long-form YouTube Videos
  {
    id: 'y1',
    slug: 'perfect-visa-interview-prep',
    title: "Why 'Perfect' Visa Interview Prep Still Gets You Rejected | F-1 Visa Tips for Indian Students",
    category: 'Long-form YouTube Videos',
    tag: 'YouTube Video',
    description: 'Detailed analysis of F-1 visa interview strategies, explaining why students get rejected and how to prepare correctly.',
    thumbnail: 'https://img.youtube.com/vi/A-KwfBHe1yg/maxresdefault.jpg',
    url: 'https://youtu.be/A-KwfBHe1yg',
    industry: 'Education & Visa Consulting',
    clientType: 'Maven Consulting Services',
    duration: '8:02',
    services: ['Video Production', 'Long-form Editing', 'YouTube Channel Management'],
    platforms: ['YouTube'],
    challenge: 'Creating a detailed, authoritative long-form video addressing critical student visa pain points.',
    strategy: [
      'Conduct detailed script planning around official visa requirements.',
      'Include high-quality motion graphics and visual cards.',
      'Optimize descriptions and metadata for search indexing.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Students frequently reference this exact video during their actual visa counseling prep sessions.',
      author: 'Maven Consulting Team',
      role: 'Visa Lead',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: true
  },
  {
    id: 'y2',
    slug: 'student-housing-abroad-truth',
    title: 'The Truth About Student Housing Abroad | University Living',
    category: 'Long-form YouTube Videos',
    tag: 'YouTube Video',
    description: 'Comprehensive guide covering accommodation, rental models, cost comparisons, and safety parameters for international students.',
    thumbnail: 'https://img.youtube.com/vi/XIIrNHmyUQw/maxresdefault.jpg',
    url: 'https://youtu.be/XIIrNHmyUQw',
    industry: 'Overseas Student Housing',
    clientType: 'Maven Consulting Services',
    duration: '35:48',
    services: ['Content Marketing', 'Long-form Editing', 'YouTube SEO'],
    platforms: ['YouTube'],
    challenge: 'Structuring a highly detailed, 35-minute overview on housing models abroad without losing user retention.',
    strategy: [
      'Divide the content into clear, chaptered segments.',
      'Co-host with housing experts to build credibility.',
      'Utilize interactive visual comparisons of costs.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Provided an invaluable asset for study abroad clients, saving hours of direct support calls.',
      author: 'Maven Consulting Team',
      role: 'Housing Coordinator',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: true
  },
  {
    id: 'y3',
    slug: 'stevens-industry-connections',
    title: 'Industry Connections Over Degrees - Why Stevens Proves It',
    category: 'Long-form YouTube Videos',
    tag: 'YouTube Video',
    description: 'An in-depth discussion on how Stevens Institute of Technology provides unparalleled networking and placement opportunities.',
    thumbnail: 'https://img.youtube.com/vi/xUlEBOj2QSU/maxresdefault.jpg',
    url: 'https://youtu.be/xUlEBOj2QSU',
    industry: 'University Profiles',
    clientType: 'Maven Consulting Services',
    duration: '29:29',
    services: ['Content Production', 'Editing & Packaging', 'Audience Engagement'],
    platforms: ['YouTube'],
    challenge: 'Creating a compelling, informational university profile that emphasizes real career outcomes.',
    strategy: [
      'Focus on Stevens placement records and alumni success stories.',
      'Incorporate graphic representations of industry connections.',
      'Use chapters to delineate different career paths.'
    ],
    deliverables: [],
    results: [],
    testimonial: {
      quote: 'Direct student interest in Stevens increased significantly following this release.',
      author: 'Maven Consulting Team',
      role: 'University Partner Lead',
      avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png'
    },
    featured: true
  },

  // 3. Pages We Manage
  {
    id: 'pm1',
    slug: 'maven-consulting-youtube',
    title: 'Maven Consulting Services - YouTube Channel Management',
    category: 'Pages We Manage',
    tag: 'YouTube Page',
    description: 'Complete channel management, video production, audience engagement, and SEO strategy for Maven Consulting Services.',
    thumbnail: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png',
    url: 'https://www.youtube.com/@mavenconsultingservices/featured',
    clientName: 'Maven Consulting Services',
    clientLogo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20logo%20Red%20BG%20%202-2xIGVsI7DH9Rbn1BDQEYVhSvhCyaVO.png',
    platformName: 'YouTube',
    featured: true
  },
  {
    id: 'pm2',
    slug: 'finance-with-dsm-instagram',
    title: 'Finance with DSM - Instagram Account Management',
    category: 'Pages We Manage',
    tag: 'Instagram Page',
    description: 'Brand strategy, script-to-video production, design aesthetics, and daily growth management for Finance with DSM.',
    thumbnail: '',
    url: 'https://www.instagram.com/finance_with_dsm/',
    clientName: 'Finance with DSM',
    clientLogo: '',
    platformName: 'Instagram',
    featured: true
  },
  {
    id: 'pm3',
    slug: 'bakthi-infinity-facebook',
    title: 'Bakthi Infinity - Facebook Community Management',
    category: 'Pages We Manage',
    tag: 'Facebook Page',
    description: 'Community moderation, devotional content planning, daily updates, and organic reach optimization for Bakthi Infinity on Facebook.',
    thumbnail: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
    url: 'https://www.facebook.com/BakthiInfinity',
    clientName: 'Bakthi Infinity',
    clientLogo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
    platformName: 'Facebook',
    featured: true
  },
  {
    id: 'pm4',
    slug: 'bakthi-infinity-instagram',
    title: 'Bakthi Infinity - Instagram Brand Strategy',
    category: 'Pages We Manage',
    tag: 'Instagram Page',
    description: 'Devotional content styling, vertical reels distribution, audience engagement, and profile styling for Bakthi Infinity on Instagram.',
    thumbnail: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
    url: 'https://www.instagram.com/bakthiinfinity_/',
    clientName: 'Bakthi Infinity',
    clientLogo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bhakthi%20Infinity-EXAkVtLg1ZjS1g3rutMio3ZeGQsY5K.jpg',
    platformName: 'Instagram',
    featured: true
  }
]
