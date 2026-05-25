import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Shipping Policy',
  description: 'GetReviewQR shipping and delivery policy for physical Google Review standee orders.',
  path: '/shipping-policy',
  noIndex: true,
});

export default function ShippingPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
