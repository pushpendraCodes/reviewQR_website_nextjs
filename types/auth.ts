export interface User {
  picture: string | undefined;
  id: string;
  name: string;
  email: string;
  mobile?: string;
  businessName?: string;
  plan?: string;
  planExpiresAt?: string;
  avatar?: string;
  isVerified?: boolean;
  emailNotifications?: boolean;
  weeklyReportEnabled?: boolean;
  firstLogin?: boolean;
  inactivityReminderSent?: boolean;
  planExpiredNotifSent?: boolean;
}
