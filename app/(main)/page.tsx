// app/page.tsx
import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Free Google Review QR Code Generator | GetReviewQR',
  description:
    'Generate a free Google review QR code in seconds. Instantly direct customers to your Google review page — no app needed. Perfect for restaurants, salons, shops & more.',
  alternates: {
    canonical: 'https://getreviewqr.com/',
  },
  openGraph: {
    title: 'Get More Google Reviews with a Free QR Code | GetReviewQR',
    description:
      'Create your custom Google review QR code in seconds. Print it, share it, and watch 5-star reviews roll in. Free forever.',
    url: 'https://getreviewqr.com/',
    siteName: 'GetReviewQR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GetReviewQR — Free Google Review QR Code Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get More Google Reviews with a Free QR Code | GetReviewQR',
    description:
      'Create your custom Google review QR code in seconds. Print it, share it, and watch 5-star reviews roll in. Free forever.',
  },
  keywords: [
    'google review qr code',
    'google review qr code generator',
    'free qr code for google reviews',
    'get more google reviews',
    'google review standee',
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GetReviewQR',
  url: 'https://getreviewqr.com',
  operatingSystem: 'All',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient />
    </>
  );
}