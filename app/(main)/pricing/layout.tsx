import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, pricingSchema } from '@/lib/seo/schema';
import { getLivePlans } from '@/lib/seo/livePricing';

export const revalidate = 3600;

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

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  const plans = await getLivePlans();
  return (
    <>
      <JsonLd
        data={[
          pricingSchema(plans),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
        ]}
      />
      {children}
    </>
  );
}
