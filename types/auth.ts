export interface TeamOwnerSummary {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  businessName?: string;
}

/** `owner` for normal accounts; `staff` for Agency team members working inside an owner's account. */
export type UserTeam =
  | { role: "owner" }
  | {
      role: "staff";
      /** False when the agency owner's plan lapsed — staff can't work until it's renewed. */
      active: boolean;
      joinedAt?: string;
      owner: TeamOwnerSummary | null;
    };

export interface User {
  picture: string | undefined;
  id: string;
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  businessName?: string;
  /** For staff this is the agency owner's plan. */
  plan?: string;
  planExpiresAt?: string;
  avatar?: string;
  isVerified?: boolean;
  emailNotifications?: boolean;
  weeklyReportEnabled?: boolean;
  firstLogin?: boolean;
  inactivityReminderSent?: boolean;
  planExpiredNotifSent?: boolean;
  /** Owners not on a paid plan: every QR pauses on `pauseOn`. */
  planGrace?: {
    reason: 'trial' | 'lapsed';
    lapsedAt: string | null;
    pauseOn: string;
    graceDays: number;
    trialDays: number;
  } | null;
  teamOwner?: string | null;
  team?: UserTeam;
}
