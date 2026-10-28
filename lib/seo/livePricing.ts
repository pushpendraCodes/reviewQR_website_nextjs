import { PLAN_PRICES_INR, PLAN_PRICES_USD, type PaidPlanKey } from '@/lib/pricing';

export type Currency = 'INR' | 'USD';
type Cycle = 'monthly' | 'annual';
export type LivePlans = Record<PaidPlanKey, Record<Cycle, Record<Currency, number>>>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const PAID_PLANS: PaidPlanKey[] = ['starter', 'pro', 'agency'];

export const PLAN_SUMMARIES: Record<PaidPlanKey | 'free', { name: string; summary: string }> = {
  free: { name: 'Free', summary: '1 Google review QR code (PNG), works for 15 days' },
  starter: { name: 'Starter', summary: '3 QR codes, no watermark, branded landing page with AI review suggestions, PDF standees' },
  pro: {
    name: 'Pro',
    summary:
      '10 QR codes, personalised AI reviews (services, staff, 21 languages), custom logo and colours, analytics and Google rating tracking',
  },
  agency: {
    name: 'Agency',
    summary: 'Unlimited QR codes, team logins, client logins and dashboards, client billing, white-label standees',
  },
};

const fallbackPlans = (): LivePlans =>
  PAID_PLANS.reduce((acc, plan) => {
    acc[plan] = {
      monthly: { INR: PLAN_PRICES_INR[plan].monthly, USD: PLAN_PRICES_USD[plan].monthly },
      annual: { INR: PLAN_PRICES_INR[plan].annual, USD: PLAN_PRICES_USD[plan].annual },
    };
    return acc;
  }, {} as LivePlans);

/** Admin-configured prices (paise / cents), refreshed hourly; defaults if the API is unreachable (e.g. at build time). */
export async function getLivePlans(): Promise<LivePlans> {
  try {
    const res = await fetch(`${API_BASE}/subscription/pricing`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return fallbackPlans();
    const data = (await res.json()) as { plans?: LivePlans };
    return data.plans?.starter?.monthly ? data.plans : fallbackPlans();
  } catch {
    return fallbackPlans();
  }
}

export const toMajor = (amount: number) => (amount / 100).toFixed(2).replace(/\.00$/, '');

export const formatMoney = (amount: number, currency: Currency) =>
  `${currency === 'INR' ? '₹' : '$'}${toMajor(amount)}`;
