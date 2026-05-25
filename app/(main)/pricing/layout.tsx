import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Pricing — Google Review QR Code Plans',
  description:
    'Free Google Review QR code generation plus affordable plans for branded standees, analytics, and unlimited downloads. Plans for restaurants, salons, clinics, and agencies.',
  path: '/pricing',
  keywords: [
    'google review qr code pricing',
    'review standee plans',
    'google review qr code subscription',
    'business review qr code plans india',
  ],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
