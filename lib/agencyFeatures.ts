/** Agency plan feature copy, shared by the pricing page, home page, how-it-works and dashboard upsells. */
export type AgencyFeatureKey =
  | 'unlimited'
  | 'team'
  | 'clientLogins'
  | 'billing'
  | 'payments'
  | 'autoBlock'
  | 'alerts'
  | 'qrFilter'
  | 'whiteLabel'
  | 'support';

export interface AgencyFeature {
  key: AgencyFeatureKey;
  title: string;
  description: string;
}

/** Days a client can stay overdue before their dashboard locks (mirrors BLOCK_AFTER_DAYS in the backend). */
export const CLIENT_BLOCK_DAYS = 15;
/** Days an expired paid plan keeps every QR working (mirrors PLAN_GRACE_DAYS default in the backend). */
export const PLAN_GRACE_DAYS = 15;
/** Days a Free account's QRs work after its first QR (mirrors FREE_TRIAL_DAYS default in the backend). */
export const FREE_TRIAL_DAYS = 15;

export const AGENCY_FEATURES: AgencyFeature[] = [
  {
    key: 'unlimited',
    title: 'Unlimited QR codes & standees',
    description: 'Create as many review QR codes as you need, for every client and every location, with all Pro customisation.',
  },
  {
    key: 'team',
    title: 'Team logins with safe permissions',
    description:
      'Staff log in with their own account, add clients and QR codes, and see only what they create. You see everything and filter by team member. Only you can change billing or approve payments.',
  },
  {
    key: 'clientLogins',
    title: 'Client logins & dashboard',
    description:
      'Each client gets their own login to see scans, Google rating and latest reviews for just their QR codes, and download their QR and standee files.',
  },
  {
    key: 'billing',
    title: 'Client billing tracker',
    description:
      'Set a plan, price and due date per QR, bill each client in their own currency, and keep a full payment history in one place.',
  },
  {
    key: 'payments',
    title: 'Get paid by clients',
    description:
      'Add your UPI ID, payment link, PayPal or bank details. Clients see them in their dashboard, pay you directly and tap "I\'ve paid", then you confirm or reject in one click.',
  },
  {
    key: 'autoBlock',
    title: `Auto-block after ${CLIENT_BLOCK_DAYS} days overdue`,
    description: `If a client hasn't paid ${CLIENT_BLOCK_DAYS} days after the due date, their dashboard locks automatically and they get an email with the amount due. Payments stay open so they can settle up.`,
  },
  {
    key: 'alerts',
    title: 'Email alerts for the owner',
    description:
      'Get an email when a client reports a payment, or when a team member adds a new client or QR code, so nothing slips past you.',
  },
  {
    key: 'qrFilter',
    title: 'Per-QR analytics & rating',
    description: 'Filter analytics and Google rating tracking by QR code to see exactly how each client or location is doing.',
  },
  {
    key: 'whiteLabel',
    title: 'White-label standees',
    description: 'Replace "Powered by ReviewQR" with your own brand and put the client\'s name on the standee footer.',
  },
  {
    key: 'support',
    title: 'Phone & WhatsApp support',
    description: 'Talk to a real person when you need help onboarding a client.',
  },
];
