import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { buildPageMetadata } from '@/lib/seo/metadata';
import {
  faqPageSchema,
  organizationSchema,
  webApplicationSchema,
  webSiteSchema,
} from '@/lib/seo/schema';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'ReviewQR: Free Review QR Code Generator for Google Reviews',
  description:
    'Create a free review QR code in 60 seconds. Customers scan and land straight on your Google review page. Print a "leave us a review" standee for restaurants, salons, clinics and shops.',
  path: '/',
  keywords: [
    'review qr code',
    'review qr code generator',
    'reviewqr',
    'qr code for business reviews',
    'leave us a review qr code',
    'qr code for reviews',
    'scan to leave a review',
    'google review qr code generator',
    'free google review qr code',
    'qr code for google reviews',
    'get more google reviews',
    'how to get google reviews',
    'create qr code for google review',
    'how to create a qr code for google reviews',
    'google review standee',
    'google business review link',
    'google maps review qr code',
    'increase google reviews',
    'local seo reviews',
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
