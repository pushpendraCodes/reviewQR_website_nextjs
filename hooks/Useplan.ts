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

/**
 * URL encoded in QR / NFC / copy. Always the /r/ tracking link (paid: opens the business
 * page, free: forwards to Google) so it can be counted and paused; never the raw Google link.
 */
export function getScanLink(shortURL?: string | null): string {
  return shortURL || '';
}