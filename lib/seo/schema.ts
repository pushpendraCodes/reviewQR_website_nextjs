import { blogPosts } from '@/data/blogData';
import { LOGO_URL, SITE_ALT_NAMES, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from './site';
import { HOME_FAQS } from './home-faqs';
import { isoDate } from './dates';
import { PAID_PLANS, PLAN_SUMMARIES, toMajor, type Currency, type LivePlans } from './livePricing';
import type { PaidPlanKey } from '@/lib/pricing';

const logoObject = {
  '@type': 'ImageObject',
  url: LOGO_URL,
  width: 512,
  height: 512,
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: SITE_URL,
    logo: logoObject,
    description:
      'GetReviewQR helps local businesses collect more Google reviews with QR codes, printable review standees and personalised AI review suggestions.',
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_ALT_NAMES,
    url: SITE_URL,
    description:
      'Free review QR code generator for Google reviews: restaurants, salons, clinics, shops, and local businesses.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free Google Review QR code generation',
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    description:
      'Create a Google Review QR code that links directly to your Google Business Profile review page. Download PNG or print-ready standee PDF.',
  };
}

export function faqPageSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }> = HOME_FAQS
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function blogPostingSchema(post: (typeof blogPosts)[number]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    abstract: post.summary,
    image: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.updated ?? post.date),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: logoObject,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords,
  };
}

/** App + every plan as an Offer, so AI answers and rich results quote real prices. */
export function pricingSchema(plans: LivePlans) {
  const offer = (plan: PaidPlanKey, cycle: 'monthly' | 'annual', currency: Currency) => ({
    '@type': 'Offer',
    name: `${PLAN_SUMMARIES[plan].name} (${cycle === 'monthly' ? 'monthly' : 'yearly'}, ${currency})`,
    description: PLAN_SUMMARIES[plan].summary,
    price: toMajor(plans[plan][cycle][currency]),
    priceCurrency: currency,
    url: `${SITE_URL}/pricing`,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: toMajor(plans[plan][cycle][currency]),
      priceCurrency: currency,
      billingDuration: cycle === 'monthly' ? 'P1M' : 'P1Y',
    },
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ReviewQR',
    url: `${SITE_URL}/pricing`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    publisher: { '@id': `${SITE_URL}/#organization` },
    description:
      'Review QR code generator for Google reviews with printable standees, AI review suggestions, analytics and agency tools.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free (15 days)',
        description: PLAN_SUMMARIES.free.summary,
        price: '0',
        priceCurrency: 'USD',
        url: `${SITE_URL}/google-review-qr-code-generator`,
      },
      ...PAID_PLANS.flatMap((plan) =>
        (['monthly', 'annual'] as const).flatMap((cycle) =>
          (['INR', 'USD'] as const).map((currency) => offer(plan, cycle, currency))
        )
      ),
    ],
  };
}

export const CREATE_QR_STEPS = [
  {
    name: 'Search your business',
    text: 'Open the free ReviewQR generator and type your business name and city.',
  },
  {
    name: 'Pick your Google listing',
    text: 'Select your business from the Google Maps results. ReviewQR builds your direct Google review link from its Place ID.',
  },
  {
    name: 'Download and print',
    text: 'Download the QR code as a PNG or a print-ready standee, and place it on your counter, tables or reception. Customers scan it to open your Google review box.',
  },
] as const;

export function howToCreateQrSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a Google review QR code',
    description: 'Create a free QR code that opens your Google review page in one scan, in about 60 seconds.',
    totalTime: 'PT1M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    tool: [{ '@type': 'HowToTool', name: 'ReviewQR review QR code generator' }],
    step: CREATE_QR_STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/google-review-qr-code-generator`,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
