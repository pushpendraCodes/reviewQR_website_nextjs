import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog — Google Reviews & Local SEO Tips',
  description:
    'Expert guides on getting more Google reviews, creating review QR codes, local SEO, standee placement, and growing your Google Maps rating.',
  path: '/blog',
  keywords: [
    'google reviews blog',
    'local seo tips',
    'google review qr code guide',
    'how to get more google reviews',
    'google maps ranking tips',
  ],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
