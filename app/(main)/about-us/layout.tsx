import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'About Us',
  description:
    'GetReviewQR helps local businesses in India and worldwide collect more Google reviews with free QR codes and professional review standees.',
  path: '/about-us',
  keywords: ['about getreviewqr', 'review qr code company', 'google review tools india'],
});

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
