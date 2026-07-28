export interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  featured: boolean
  cta: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 'Contact Us',
    period: '',
    description: 'Perfect for small businesses just getting started with digital marketing.',
    features: [
      'Social Media Management (2 platforms)',
      'Basic Content Calendar',
      'Monthly Analytics Report',
      'Email Support',
      'Profile Optimisation',
    ],
    featured: false,
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: 'Contact Us',
    period: '',
    description: 'For growing brands ready to scale their online presence and engagement.',
    features: [
      'Everything in Starter',
      'Social Media Management (4 platforms)',
      'Video Editing — Reels & Shorts',
      'AI Content Strategy',
      'Email Marketing Setup',
      'Bi-weekly Strategy Calls',
      'Priority Support',
    ],
    featured: false,
    cta: 'Get Started',
  },
  {
    name: 'Premium',
    price: 'Contact Us',
    period: '',
    description: 'Full-stack marketing for brands serious about measurable, aggressive growth.',
    features: [
      'Everything in Growth',
      'Performance Marketing (Meta + Google Ads)',
      'In-House Video Production',
      'Influencer Outreach & Management',
      'AI Marketing Automation',
      'Dedicated Account Manager',
      'Weekly Strategy Calls',
      'Landing Page Strategy',
    ],
    featured: true,
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Fully customised marketing solutions for large-scale brands and organisations.',
    features: [
      'Everything in Premium',
      'On-location Camera Shoots',
      'Advanced AI Automation Suite',
      'Multi-market Campaign Management',
      'Podcast Production & Distribution',
      'Dedicated Creative Team',
      '24/7 Priority Support',
      'Custom Integrations',
    ],
    featured: false,
    cta: 'Contact Sales',
  },
]
