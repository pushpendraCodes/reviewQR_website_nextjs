import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogData';
import { SITE_URL } from '@/lib/seo/site';
import { isoDate } from '@/lib/seo/dates';

type Page = {
  path: string;
  /** Bump when the page content changes meaningfully — Google ignores lastmod that changes on every build. */
  updated: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

const STATIC_PAGES: Page[] = [
  { path: '', updated: '2026-10-24', changeFrequency: 'weekly', priority: 1 },
  { path: '/google-review-qr-code-generator', updated: '2026-10-24', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/how-it-works', updated: '2026-10-24', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/pricing', updated: '2026-10-24', changeFrequency: 'monthly', priority: 0.85 },
  { path: '/about-us', updated: '2026-10-24', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/services', updated: '2026-07-09', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/contact', updated: '2026-07-09', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy-policy', updated: '2026-07-09', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/terms-and-conditions', updated: '2026-07-09', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/refund-policy', updated: '2026-07-09', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/shipping-policy', updated: '2026-07-09', changeFrequency: 'yearly', priority: 0.4 },
];

const PRIORITY_SLUGS = new Set([
  'leave-us-a-review-qr-code',
  'free-google-review-qr-code-generator',
  'google-review-qr-code-for-restaurants',
  'google-review-qr-code-for-salons-and-spas',
  'how-to-print-google-review-qr-code-standee',
  'static-vs-dynamic-google-review-qr-code',
  'what-is-a-google-place-id-and-how-to-find-it',
]);

const postModified = (post: (typeof blogPosts)[number]) => isoDate(post.updated ?? post.date);

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: postModified(post),
    changeFrequency: 'monthly',
    priority: PRIORITY_SLUGS.has(post.slug) ? 0.8 : 0.65,
  }));

  const latestPost = blogPosts.reduce<string | null>((latest, post) => {
    const d = postModified(post);
    return !latest || d > latest ? d : latest;
  }, null);

  return [
    ...STATIC_PAGES.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: page.updated,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestPost ?? '2026-07-09',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
