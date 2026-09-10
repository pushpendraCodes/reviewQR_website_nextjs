/**
 * Display pricing — keep in sync with be/src/utils/helpers.js (PLAN_PRICES, PLAN_PRICES_USD).
 * Amounts are in smallest currency units (paise / cents).
 */
export const PLAN_PRICES_INR = {
  starter: { monthly: 19900, annual: 19900 },
  pro: { monthly: 29900, annual: 29900 },
  agency: { monthly: 99900, annual: 99900 },
} as const;

export type PaidPlanKey = keyof typeof PLAN_PRICES_INR;

/** INR rupees → USD dollars (₹199 → $2, ₹299 → $3, ₹999 → $10). */
function inrPaiseToUsdCents(paise: number): number {
  return Math.round(paise / 100 / 100) * 100;
}

function buildUsdPrices() {
  return (Object.keys(PLAN_PRICES_INR) as PaidPlanKey[]).reduce(
    (acc, plan) => {
      acc[plan] = {
        monthly: inrPaiseToUsdCents(PLAN_PRICES_INR[plan].monthly),
        annual: inrPaiseToUsdCents(PLAN_PRICES_INR[plan].annual),
      };
      return acc;
    },
    {} as Record<PaidPlanKey, { monthly: number; annual: number }>
  );
}

export const PLAN_PRICES_USD = buildUsdPrices();

function formatInr(amountPaise: number): string {
  const rupees = amountPaise / 100;
  return rupees >= 1000
    ? `₹${rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    : `₹${rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function formatUsd(amountCents: number): string {
  const dollars = amountCents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

function formatInrNumber(amountPaise: number): string {
  return (amountPaise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatUsdNumber(amountCents: number): string {
  const dollars = amountCents / 100;
  return dollars % 1 === 0 ? String(dollars) : dollars.toFixed(2);
}

/** Approximate monthly cost when paying the annual lump sum. */
export function annualMonthlyEquivalent(
  monthlyAmount: number,
  annualAmount: number
): number {
  return annualAmount / 12;
}

/** Percent saved vs paying monthly for 12 months. */
export function annualSavingsPercent(
  monthlyAmount: number,
  annualAmount: number
): number {
  const yearlyIfMonthly = monthlyAmount * 12;
  if (yearlyIfMonthly <= annualAmount) return 0;
  return Math.round(((yearlyIfMonthly - annualAmount) / yearlyIfMonthly) * 100);
}

export function getPlanDisplayPrices(
  plan: PaidPlanKey,
  currency: 'INR' | 'USD'
) {
  const prices = currency === 'INR' ? PLAN_PRICES_INR[plan] : PLAN_PRICES_USD[plan];
  const format = currency === 'INR' ? formatInr : formatUsd;
  const formatNum = currency === 'INR' ? formatInrNumber : formatUsdNumber;
  const symbol = currency === 'INR' ? '₹' : '$';
  const monthlyEq = annualMonthlyEquivalent(prices.monthly, prices.annual);

  return {
    monthlyPrice: format(prices.monthly),
    annualMonthly:
      currency === 'INR'
        ? `₹${Math.round(monthlyEq).toLocaleString('en-IN')}`
        : `$${monthlyEq.toFixed(2)}`,
    annualPrice: formatNum(prices.annual),
    annualTotal: format(prices.annual),
    savingsPercent: annualSavingsPercent(prices.monthly, prices.annual),
    currencySymbol: symbol,
  };
}

/** Lowest paid plan monthly price for marketing copy. */
export const STARTER_MONTHLY_INR = formatInr(PLAN_PRICES_INR.starter.monthly);
export const STARTER_MONTHLY_USD = formatUsd(PLAN_PRICES_USD.starter.monthly);
export const PRO_MONTHLY_USD = formatUsd(PLAN_PRICES_USD.pro.monthly);
