'use client';

import { useSelector } from 'react-redux';

export type Plan = 'free' | 'starter' | 'pro' | 'agency';

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
};

export function usePlan() {
  const user = useSelector((state: any) => state.auth?.user);
  const plan: Plan = (user?.plan as Plan) || 'free';
  const planExpiredNotifSent = !!user?.planExpiredNotifSent;

  /** Returns true if the user's plan is at least `required` */
  const hasAccess = (required: Plan): boolean =>
    PLAN_RANK[plan] >= PLAN_RANK[required];

  return { plan, hasAccess, planExpiredNotifSent };
}