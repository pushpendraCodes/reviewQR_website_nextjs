/** Canonical site URL — used for metadata, sitemap, and JSON-LD */
export const SITE_URL = 'https://www.getreviewqr.com';

export const SITE_NAME = 'GetReviewQR';
/** Names people search for the brand ("reviewqr", "review qr"). */
export const SITE_ALT_NAMES = ['ReviewQR', 'Review QR'];
export const SITE_TAGLINE = 'Free Review QR Code Generator for Google Reviews';
export const SITE_DESCRIPTION =
  'Free review QR code generator. Make a "leave us a review" QR code that opens your Google review page in one scan, and print it as a "scan to leave a review" standee. Free for 15 days.';

export const DEFAULT_OG_IMAGE = '/og-image.png';

/** Raster logo for structured data (served by app/logo.png/route.tsx). */
export const LOGO_URL = `${SITE_URL}/logo.png`;

/** Official brand profiles (LinkedIn, Instagram, YouTube, X, Product Hunt…) — used as Organization `sameAs`. */
export const SOCIAL_PROFILES: string[] = [];

export const TWITTER_HANDLE = '@GetReviewQR';

export const PRIMARY_KEYWORDS = [
  'review qr code',
  'review qr code generator',
  'qr code for business reviews',
  'leave us a review qr code',
  'scan to leave a review',
  'google review qr code generator',
  'free google review qr code',
  'qr code for google reviews',
  'google review qr code',
  'get more google reviews',
  'google review standee',
  'google business review link',
  'google maps review qr code',
  'increase google reviews',
  'local business reviews',
  "Get Review QR",
  "Review Qr",
  "Review QR Code Generator",
  "Google Review Link",
] as const;
