'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  twitterHandle?: string;
  keywords?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Generate QR codes for Google Reviews instantly. Help local businesses in India get more 5-star reviews with custom ReviewQR codes.",
  canonical,
  ogType = 'website',
  ogImage = '/og-image.png', // Fallback OG image
  twitterHandle = '@ReviewQR',
  keywords = "google review qr code, google reviews generator, qr code for business, local business seo india, get more google reviews",
  structuredData,
}) => {
  const siteName = "ReviewQR";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Get More Google Reviews Instantly`;
  const url = window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
