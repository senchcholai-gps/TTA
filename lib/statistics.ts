/**
 * statistics.ts
 *
 * Single source of truth for the Live Metrics / Statistics section.
 * To update any number, label, or icon — edit ONLY this file.
 * The StatisticsSection component will re-render automatically from this data.
 *
 * Available Lucide icon names:
 * Users | TrendingUp | BarChart3 | Rocket | Star | Award | Globe | Zap | Eye | Heart
 */

export interface Statistic {
  /** Display label shown beneath the number */
  title: string
  /** Raw numeric value the counter animates to */
  value: number
  /** String appended after the number, e.g. "+", "M+", "%" */
  suffix: string
  /** Lucide icon name (see comment above for available options) */
  icon: string
  /** Optional sub-label for extra context */
  description?: string
}

export const statistics: Statistic[] = [
  {
    title: 'Clients Served',
    value: 150,
    suffix: '+',
    icon: 'Users',
    description: 'Across 12+ industries',
  },
  {
    title: 'Views Generated',
    value: 20,
    suffix: 'M+',
    icon: 'TrendingUp',
    description: 'Organic + paid combined',
  },
  {
    title: 'Avg. Engagement Growth',
    value: 40,
    suffix: '%',
    icon: 'BarChart3',
    description: 'Month-over-month average',
  },
  {
    title: 'Campaigns Delivered',
    value: 150,
    suffix: '+',
    icon: 'Rocket',
    description: 'On time & on budget',
  },
]
