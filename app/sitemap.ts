import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogData';
import { SITE_URL } from '@/lib/seo/site';

const LAST_MOD = '2026-05-25';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: LAST_MOD, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/google-review-qr-code-generator`, lastModified: LAST_MOD, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE_URL}/how-it-works`, lastModified: LAST_MOD, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/pricing`, lastModified: LAST_MOD, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog`, lastModified: LAST_MOD, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about-us`, lastModified: LAST_MOD, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: LAST_MOD, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: LAST_MOD, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, lastModified: LAST_MOD, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, lastModified: LAST_MOD, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, lastModified: LAST_MOD, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [...staticPages, ...blogEntries];
}
