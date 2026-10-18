import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Pricing — Google Review QR Code Plans',
  description:
    'Free Google Review QR code generation plus affordable plans for branded standees, analytics, and unlimited downloads. Agency plan adds team logins, client dashboards, client billing and payment collection.',
  path: '/pricing',
  keywords: [
    'google review qr code pricing',
    'review standee plans',
    'google review qr code subscription',
    'business review qr code plans india',
    'google review qr code for agencies',
    'white label review qr code',
  ],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
