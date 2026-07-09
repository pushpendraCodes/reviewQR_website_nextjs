import { blogPosts, type BlogPost } from '@/data/blogData';

/**
 * Pages Google has discovered but not indexed yet (GSC).
 * Keep these linked from high-authority pages (home, how-it-works, blog).
 */
export const SEO_PRIORITY_BLOG_SLUGS = [
  'free-google-review-qr-code-generator',
  'google-review-qr-code-for-restaurants',
  'google-review-qr-code-for-salons-and-spas',
  'how-to-print-google-review-qr-code-standee',
  'static-vs-dynamic-google-review-qr-code',
  'what-is-a-google-place-id-and-how-to-find-it',
] as const;

export const GENERATOR_PATH = '/google-review-qr-code-generator';

export function getSeoPriorityPosts(limit = 6): BlogPost[] {
  const bySlug = new Map(blogPosts.map((p) => [p.slug, p]));
  return SEO_PRIORITY_BLOG_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is BlogPost => Boolean(p)
  ).slice(0, limit);
}

/** Prefer SEO-priority posts for related-article sidebars. */
export function getRelatedPosts(currentSlug: string, limit = 4): BlogPost[] {
  const priority = getSeoPriorityPosts().filter((p) => p.slug !== currentSlug);
  if (priority.length >= limit) return priority.slice(0, limit);

  const rest = blogPosts.filter(
    (p) => p.slug !== currentSlug && !priority.some((x) => x.slug === p.slug)
  );
  return [...priority, ...rest].slice(0, limit);
}

export const SEO_GUIDE_LINKS: { href: string; label: string; blurb: string }[] = [
  {
    href: GENERATOR_PATH,
    label: 'Free Google Review QR Code Generator',
    blurb: 'Create a print-ready review QR in under a minute.',
  },
  {
    href: '/blog/free-google-review-qr-code-generator',
    label: 'Free Google Review QR guide',
    blurb: 'How free QR codes work and when to upgrade.',
  },
  {
    href: '/blog/google-review-qr-code-for-restaurants',
    label: 'QR codes for restaurants',
    blurb: 'Table tents, billing folders, and staff prompts.',
  },
  {
    href: '/blog/google-review-qr-code-for-salons-and-spas',
    label: 'QR codes for salons & spas',
    blurb: 'Reception and checkout placements that convert.',
  },
  {
    href: '/blog/how-to-print-google-review-qr-code-standee',
    label: 'How to print a review standee',
    blurb: 'Sizes, materials, and counter display tips.',
  },
  {
    href: '/blog/static-vs-dynamic-google-review-qr-code',
    label: 'Static vs dynamic review QR codes',
    blurb: 'Which type to use for Google reviews.',
  },
  {
    href: '/blog/what-is-a-google-place-id-and-how-to-find-it',
    label: 'What is a Google Place ID?',
    blurb: 'Find your Place ID and build a direct review link.',
  },
];
