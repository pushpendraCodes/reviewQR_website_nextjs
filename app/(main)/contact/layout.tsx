import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Contact GetReviewQR for support, bulk standee orders, or partnership enquiries. We help businesses set up Google Review QR codes quickly.',
  path: '/contact',
  keywords: ['contact getreviewqr', 'google review qr code support', 'review standee enquiry'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
