import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: 'GetReviewQR privacy policy — how we collect, use, and protect your data when you use our Google Review QR code generator.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
