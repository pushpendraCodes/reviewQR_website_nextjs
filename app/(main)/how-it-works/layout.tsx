import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'How Google Review QR Codes Work',
  description:
    'Step-by-step guide: find your Google Place ID, generate a review QR code, and place standees at your counter, tables, or reception to collect more 5-star Google reviews.',
  path: '/how-it-works',
  keywords: [
    'how google review qr code works',
    'google review qr code setup',
    'where to place review qr code',
    'google place id review link',
    'get customers to leave google reviews',
  ],
});

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
