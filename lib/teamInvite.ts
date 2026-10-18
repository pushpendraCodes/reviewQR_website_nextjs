/** Survives the Google OAuth round-trip, which drops query params. */
export const PENDING_INVITE_KEY = "pendingTeamInvite";

export const pendingInvitePath = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(PENDING_INVITE_KEY);
  return token ? `/team/accept?token=${encodeURIComponent(token)}` : null;
};
