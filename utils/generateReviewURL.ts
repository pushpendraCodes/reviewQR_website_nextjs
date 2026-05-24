'use client';

/**
 * Generates a Google Review URL from a Place ID
 * This URL directly opens the Google review form for the business
 */
export const generateReviewURL = (placeId: string): string => {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
};
/**
 * Generates a shortened display version of the review URL
 */
export const getDisplayURL = (placeId: string): string => {
  const url = generateReviewURL(placeId);
  return url.length > 60 ? url.substring(0, 60) + '...' : url;
};
/**
 * Generates a WhatsApp share URL with pre-filled message
 */
export const getWhatsAppShareURL = (businessName: string, placeId: string): string => {
  const reviewURL = generateReviewURL(placeId);
  const message = encodeURIComponent(
    `Hi! We'd love to hear your feedback. Please leave us a review for ${businessName}: ${reviewURL}`
  );
  return `https://wa.me/?text=${message}`;
};