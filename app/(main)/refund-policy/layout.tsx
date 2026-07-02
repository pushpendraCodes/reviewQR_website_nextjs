import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Refund Policy',
  description: 'GetReviewQR refund policy for paid plans and standee orders.',
  path: '/refund-policy',
});

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
