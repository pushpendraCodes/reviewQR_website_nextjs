'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type Plan = 'free' | 'starter' | 'pro' | 'agency';

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
};

export function usePlan() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const user = useSelector((state: any) => state.auth?.user);
  const authPlan: Plan = (user?.plan as Plan) || 'free';
  const planExpiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;

  // Match SSR until mount so Redux rehydration does not cause hydration mismatches
  const plan: Plan = hydrated ? authPlan : 'free';
  const planExpiredNotifSent = hydrated && !!user?.planExpiredNotifSent;
  const isPaidActive =
    hydrated &&
    authPlan !== 'free' &&
    (!planExpiresAt || planExpiresAt.getTime() > Date.now());

  /** Returns true if the user's plan is at least `required` */
  const hasAccess = (required: Plan): boolean =>
    PLAN_RANK[plan] >= PLAN_RANK[required];

  return { plan, authPlan, hydrated, hasAccess, planExpiredNotifSent, isPaidActive };
}

/** URL encoded in QR / NFC / copy — paid: tracking link; free: Google write-review */
export function getScanLink(
  isPaidActive: boolean,
  shortURL?: string | null,
  reviewURL?: string | null,
): string {
  if (isPaidActive && shortURL) return shortURL;
  return reviewURL || '';
}

/** Backend JSON uses reviewUrl; some UI types use reviewURL */
export function reviewUrlFromQr(qr: {
  reviewURL?: string | null;
  reviewUrl?: string | null;
}): string {
  return qr.reviewURL || qr.reviewUrl || '';
}