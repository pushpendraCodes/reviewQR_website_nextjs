'use client';

/**
 * Generates a Google Review URL from a Place ID
 * This URL directly opens the Google review form for the business.
 * Never encode it in a QR or share it: printed codes must use the /r/ short link.
 */
export const generateReviewURL = (placeId: string): string => {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
};
