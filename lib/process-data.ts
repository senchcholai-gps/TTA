export interface ProcessStep {
  step: number
  title: string
  description: string
  details?: string
  icon: string
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Discover',
    description: 'We keep things lean and collaborative — so ideas go from concept to launch without the chaos.',
    details: 'Deep-dive into brand audit, SEO/GEO signals, and competitor gaps.',
    icon: 'Search',
  },
  {
    step: 2,
    title: 'Design',
    description: 'Shape powerful experiences with purpose-driven creativity and thoughtful visual execution.',
    icon: 'Palette',
  },
  {
    step: 3,
    title: 'Develop',
    description: 'Build scalable solutions that bring your vision to life with precision and performance.',
    icon: 'Code',
  },
  {
    step: 4,
    title: 'Launch & Grow',
    description: 'Introduce your brand with impact through strategic rollouts that captivate and convert.',
    icon: 'Rocket',
  },
]
