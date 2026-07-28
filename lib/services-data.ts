import { 
  Sparkles, 
  Share2, 
  Video, 
  Target, 
  Mail, 
  Award,
  LucideIcon
} from 'lucide-react'

export interface ServiceCategory {
  id: string
  title: string
  description: string
  icon: LucideIcon
  services: string[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'ai',
    title: 'AI Marketing Solutions',
    description: 'Cutting-edge AI tools for content, automation, personalization, chatbots & lead generation',
    icon: Sparkles,
    services: [
      'AI Content Strategy',
      'AI-Powered Social Media Management',
      'AI Video Creation',
      'AI Image Generation',
      'AI Voiceovers',
      'AI Chatbot Integration',
      'AI Sales Funnel Automation',
      'AI Marketing Automation',
      'AI Lead Generation',
      'AI Email Marketing Automation',
      'AI Customer Support Automation',
      'AI Personalization Campaigns'
    ]
  },
  {
    id: 'social',
    title: 'Social Media Marketing',
    description: 'Strategy, management, organic growth, optimization, and analytics reporting',
    icon: Share2,
    services: [
      'Social Media Strategy',
      'Instagram Marketing',
      'Facebook Marketing',
      'YouTube Channel Management',
      'Content Planning & Content Calendar',
      'Content Ideas & Suggestions',
      'Community Management',
      'Profile Optimization',
      'Organic Growth Strategy',
      'Social Media Audit',
      'SEO for Social Platforms',
      'GEO (Generative Engine Optimization)',
      'Monthly Analytics & Performance Reports'
    ]
  },
  {
    id: 'content',
    title: 'Content Production & Video Editing',
    description: 'Camera shoots, video editing, motion graphics, podcasts & scriptwriting',
    icon: Video,
    services: [
      'On-location Production Camera Shoots',
      'Video Editing – Reels & Shorts',
      'Video Editing – Long-form (YouTube)',
      'Podcast Editing & Distribution',
      'Motion Graphics',
      'Thumbnail Design',
      'Graphic Design & Carousel Posts',
      'Ad Creatives',
      'Script Writing & Copywriting'
    ]
  },
  {
    id: 'performance',
    title: 'Performance Marketing',
    description: 'Meta Ads, Google Ads, YouTube campaigns, lead generation & retargeting',
    icon: Target,
    services: [
      'Meta Ads',
      'Google Ads',
      'YouTube Ads',
      'Lead Generation Campaigns',
      'Retargeting Campaigns',
      'Landing Page Strategy',
      'Conversion Tracking & Pixel Setup'
    ]
  },
  {
    id: 'email',
    title: 'Email Marketing',
    description: 'Campaign strategy, newsletter design, automation & list segmentation',
    icon: Mail,
    services: [
      'Email Campaign Strategy',
      'Newsletter Design & Setup',
      'Automated Email Sequences',
      'List Building & Segmentation'
    ]
  },
  {
    id: 'influencer',
    title: 'Influencer Marketing',
    description: 'Influencer discovery, campaign management, UGC creators & ROI tracking',
    icon: Award,
    services: [
      'Influencer Discovery & Outreach',
      'Campaign Planning & Negotiation',
      'Brand Collaboration Management',
      'UGC Creator Management',
      'Product Seeding',
      'Campaign Reporting & ROI Tracking'
    ]
  }
]
