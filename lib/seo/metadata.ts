import type { Metadata } from 'next';
import {
  DEFAULT_OG_IMAGE,
  PRIMARY_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_HANDLE,
} from './site';

export type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
};

/** Build absolute page URL */
export function pageUrl(path = ''): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '',
  keywords = [...PRIMARY_KEYWORDS],
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = pageUrl(path);
  const displayTitle =
    path === '' || path === '/' ? title : `${title} | ${SITE_NAME}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  return {
    title: path === '' || path === '/' ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: displayTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: displayTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TAGLINE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...PRIMARY_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  category: 'technology',
};
