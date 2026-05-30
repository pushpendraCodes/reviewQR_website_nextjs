import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Free Google Review QR Code Generator (Instant Setup)',
  description:
    'Free Google Review QR Code Generator and Google Review Link Generator. Easily create a custom QR code for Google reviews in under 60 seconds and download your print-ready PDF standee. No expiry.',
  path: '/google-review-qr-code-generator',
  keywords: [
    'Google Review QR Code Generator',
    'Free Google Review QR Code Generator',
    'QR Code for Google Reviews',
    'Google Review Link Generator',
    'Get More Google Reviews',
    'google review qr code maker',
    'how to get more google reviews',
  ],
});

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
