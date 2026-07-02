import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using GetReviewQR Google Review QR code generator and subscription services.',
  path: '/terms-and-conditions',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
