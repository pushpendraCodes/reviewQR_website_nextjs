import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { buildPageMetadata } from '@/lib/seo/metadata';
import {
  faqPageSchema,
  organizationSchema,
  webApplicationSchema,
  webSiteSchema,
} from '@/lib/seo/schema';
import { SITE_TAGLINE } from '@/lib/seo/site';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_TAGLINE} — Get More Google Reviews Instantly`,
  description:
    'Generate a free Google review QR code in seconds. Instantly direct customers to your Google review page — no app needed. Perfect for restaurants, salons, shops, clinics & local businesses in India.',
  path: '/',
  keywords: [
    'google review qr code generator',
    'free google review qr code',
    'qr code for google reviews',
    'get more google reviews',
    'google review standee',
    'google business review link',
    'google maps review qr code',
    'increase google reviews',
    'local seo reviews',
    'review qr code india',
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          webSiteSchema(),
          webApplicationSchema(),
          faqPageSchema(),
        ]}
      />
      <HomePageClient />
    </>
  );
}
