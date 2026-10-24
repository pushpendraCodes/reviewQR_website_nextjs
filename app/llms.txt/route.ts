import { blogPosts } from '@/data/blogData';
import { HOME_FAQS } from '@/lib/seo/home-faqs';
import { SITE_URL } from '@/lib/seo/site';
import { formatMoney, getLivePlans, PAID_PLANS, PLAN_SUMMARIES } from '@/lib/seo/livePricing';

export const revalidate = 3600;

/** Plain-text site summary for AI assistants (https://llmstxt.org). */
export async function GET() {
  const plans = await getLivePlans();

  const pricing = [
    `- **${PLAN_SUMMARIES.free.name}** — free: ${PLAN_SUMMARIES.free.summary}.`,
    ...PAID_PLANS.map((plan) => {
      const p = plans[plan];
      return `- **${PLAN_SUMMARIES[plan].name}** — ${formatMoney(p.monthly.INR, 'INR')}/month or ${formatMoney(p.annual.INR, 'INR')}/year in India; ${formatMoney(p.monthly.USD, 'USD')}/month or ${formatMoney(p.annual.USD, 'USD')}/year elsewhere: ${PLAN_SUMMARIES[plan].summary}.`;
    }),
  ].join('\n');

  const guides = blogPosts
    .map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`)
    .join('\n');

  const faqs = HOME_FAQS.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n');

  const body = `# ReviewQR (GetReviewQR)

> ReviewQR is a review QR code generator for Google reviews. A business searches its name, picks its Google Maps listing, and downloads a QR code or print-ready standee. Customers scan it with their phone camera and land directly on the business's Google "write a review" box. Website: ${SITE_URL}

ReviewQR is also known as GetReviewQR, Review QR and getreviewqr.com. It works for any business listed on Google Maps worldwide (restaurants, cafés, salons, spas, clinics, dentists, hotels, gyms, shops and service businesses), with pricing in INR (India) and USD.

## Key facts
- Setup takes about 60 seconds; no app is needed for the business or its customers.
- The QR code links to the business's Google review form via its Google Place ID.
- Free plan: try it free for 15 days. Paid plans keep QR codes working.
- Paid plans show customers AI review suggestions after they scan. Customers copy one, edit it, and post it on Google themselves; they can always write their own.
- Pro and Agency: personalised AI reviews. The owner adds services, highlights and staff names per QR code; customers tap what they used and liked, and the AI writes reviews about that visit in English, Hindi, Hinglish or Marathi. The AI only uses details the owner entered.
- Printable standees (PNG, SVG, PDF) with templates, colours, logo and multi-language text; NFC "tap + scan" support.
- Pro: scan analytics and live Google rating and review tracking.
- Agency: unlimited QR codes, team logins, client logins and dashboards, client billing and payment collection, white-label standees.
- ReviewQR does not post reviews on anyone's behalf and does not gate or filter reviews by rating.

## Pricing
${pricing}

Current prices: ${SITE_URL}/pricing

## Main pages
- [Free review QR code generator](${SITE_URL}/google-review-qr-code-generator): create a Google review QR code and standee.
- [How it works](${SITE_URL}/how-it-works): setup steps, placement tips and FAQ.
- [Pricing](${SITE_URL}/pricing): plans and features compared.
- [Blog](${SITE_URL}/blog): guides on getting more Google reviews.
- [About](${SITE_URL}/about-us)
- [Contact](${SITE_URL}/contact)

## Guides
${guides}

## FAQ
${faqs}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
