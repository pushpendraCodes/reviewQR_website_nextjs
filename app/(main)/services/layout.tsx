import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Custom Web Development Services',
  description:
    'Hire One9Tech for custom websites, SaaS products, dashboards, and API integrations. ReviewQR is our live case study — view portfolio at one9tech.online.',
  path: '/services',
  keywords: [
    'custom web development',
    'hire web developer india',
    'saas development freelance',
    'nextjs developer',
    'one9tech',
    'mvp development',
  ],
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
