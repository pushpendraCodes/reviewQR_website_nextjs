import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, howToCreateQrSchema } from '@/lib/seo/schema';

export const metadata: Metadata = buildPageMetadata({
  title: 'Review QR Code Generator: Free QR Code for Google Reviews',
  description:
    'Generate a free QR code for Google reviews in 60 seconds. Search your business, then download a "review us" QR code or a print-ready standee. Customers scan and land on your review page.',
  path: '/google-review-qr-code-generator',
  keywords: [
    'review qr code generator',
    'qr code for reviews',
    'free qr code for google review',
    'generate qr code for google review',
    'review us qr code',
    'Google Review QR Code Generator',
    'Free Google Review QR Code Generator',
    'QR Code for Google Reviews',
    'Google Review Link Generator',
    'Get More Google Reviews',
    'google review qr code maker',
    'how to get more google reviews',
  ],
});

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          howToCreateQrSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Review QR code generator', path: '/google-review-qr-code-generator' },
          ]),
        ]}
      />
      {children}
    </>
  );
}
