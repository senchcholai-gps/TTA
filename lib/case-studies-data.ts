export interface CaseStudy {
  id: string
  client: string
  industry: string
  tag: string
  tagColor: string
  challenge: string
  solution: string
  heroMetric: string
  results: { value: string; label: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs1',
    client: 'Client Case Study Placeholder 1',
    industry: 'Industry Sector',
    tag: 'Campaign Tag',
    tagColor: 'text-brand-purple',
    challenge: 'This section will contain the client case study challenge outline describing baseline traffic, conversion benchmarks, and client bottlenecks.',
    solution: 'This section will outline the custom growth solution, integration pipelines, and channels deployed by TTA to address target bottlenecks.',
    heroMetric: '+XX%',
    results: [
      { value: '+XX%', label: 'Metric Improvement' },
      { value: '-XX%', label: 'Cost Reduction' },
      { value: 'X.Xx', label: 'Campaign Return' },
    ],
  },
  {
    id: 'cs2',
    client: 'Client Case Study Placeholder 2',
    industry: 'Industry Sector',
    tag: 'Campaign Tag',
    tagColor: 'text-brand-red',
    challenge: 'This section will contain the client case study challenge outline describing baseline traffic, conversion benchmarks, and client bottlenecks.',
    solution: 'This section will outline the custom growth solution, integration pipelines, and channels deployed by TTA to address target bottlenecks.',
    heroMetric: 'XXM+',
    results: [
      { value: 'XXM+', label: 'Organic Views' },
      { value: '+XX%', label: 'Engagement Rate' },
      { value: 'XXK+', label: 'Follower Growth' },
    ],
  },
  {
    id: 'cs3',
    client: 'Client Case Study Placeholder 3',
    industry: 'Industry Sector',
    tag: 'Campaign Tag',
    tagColor: 'text-brand-magenta',
    challenge: 'This section will contain the client case study challenge outline describing baseline traffic, conversion benchmarks, and client bottlenecks.',
    solution: 'This section will outline the custom growth solution, integration pipelines, and channels deployed by TTA to address target bottlenecks.',
    heroMetric: 'X.Xx',
    results: [
      { value: '+XX%', label: 'Lead Volume Increase' },
      { value: 'XX%', label: 'Automation Coverage' },
      { value: 'Xx', label: 'Conversion Lift' },
    ],
  },
]
