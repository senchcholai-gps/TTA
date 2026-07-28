export interface Industry {
  id: string
  name: string
  icon: string
  description: string
  accent: string // tailwind gradient classes
}

export const industries: Industry[] = [
  {
    id: 'startups',
    name: 'Startups & Small Businesses',
    icon: 'Rocket',
    description: 'Launch fast with lean, high-impact marketing that scales with your growth.',
    accent: 'from-brand-red/20 to-brand-magenta/20',
  },
  {
    id: 'ecommerce',
    name: 'Retail & E-commerce',
    icon: 'ShoppingBag',
    description: 'Drive conversions, reduce CAC, and scale online sales with performance-first strategies.',
    accent: 'from-brand-magenta/20 to-brand-purple/20',
  },
  {
    id: 'education',
    name: 'Education & Study Abroad',
    icon: 'GraduationCap',
    description: 'Attract students globally with targeted campaigns and enrollment funnels.',
    accent: 'from-brand-purple/20 to-brand-red/20',
  },
  {
    id: 'food',
    name: 'Food & Beverage',
    icon: 'UtensilsCrossed',
    description: 'Build craveable brands with mouthwatering content and local reach.',
    accent: 'from-brand-red/20 to-brand-magenta/20',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'TrendingUp',
    description: 'Build trust and authority with compliant, data-driven financial marketing.',
    accent: 'from-brand-magenta/20 to-brand-purple/20',
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: 'Building2',
    description: 'Generate qualified leads and showcase properties with premium visuals.',
    accent: 'from-brand-purple/20 to-brand-red/20',
  },
  {
    id: 'coaches',
    name: 'Coaches & Consultants',
    icon: 'Mic',
    description: 'Establish thought leadership and fill your calendar with high-ticket clients.',
    accent: 'from-brand-red/20 to-brand-purple/20',
  },
  {
    id: 'personal',
    name: 'Personal Brands',
    icon: 'User',
    description: 'Grow your audience, monetise your expertise, and build a lasting digital presence.',
    accent: 'from-brand-magenta/20 to-brand-red/20',
  },
  {
    id: 'corporate',
    name: 'Corporate Companies',
    icon: 'Briefcase',
    description: 'Enterprise marketing, employer branding, and B2B lead generation at scale.',
    accent: 'from-brand-purple/20 to-brand-magenta/20',
  },
]
