import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Generate Google Review QR Code Free',
  description:
    'Create your Google Review QR code in under 60 seconds. Search your business on Google Maps, customize colors, and download PNG or a print-ready review standee PDF.',
  path: '/generate',
  keywords: [
    'generate google review qr code',
    'create google review qr code',
    'google review qr code maker',
    'free qr code generator google reviews',
    'google place id qr code',
    'download google review qr code',
  ],
});

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
