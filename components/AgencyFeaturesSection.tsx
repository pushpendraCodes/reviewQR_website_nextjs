import Link from 'next/link';
import {
  ArrowRight,
  BarChart2,
  Bell,
  Briefcase,
  CreditCard,
  Headphones,
  Infinity as InfinityIcon,
  Lock,
  Palette,
  Receipt,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { AGENCY_FEATURES, type AgencyFeatureKey } from '@/lib/agencyFeatures';

const ICONS: Record<AgencyFeatureKey, LucideIcon> = {
  unlimited: InfinityIcon,
  team: Users,
  clientLogins: UserRound,
  billing: Receipt,
  payments: CreditCard,
  autoBlock: Lock,
  alerts: Bell,
  qrFilter: BarChart2,
  whiteLabel: Palette,
  support: Headphones,
};

interface Props {
  /** Visual background of the section. */
  tone?: 'light' | 'white';
  showCta?: boolean;
}

const AgencyFeaturesSection = ({ tone = 'white', showCta = true }: Props) => (
  <section
    id="agency"
    className={`py-20 lg:py-28 border-y border-gray-100 ${tone === 'light' ? 'bg-[#f7faf8]' : 'bg-white'}`}
    aria-labelledby="agency-heading"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          Agency plan
        </span>
        <h2 id="agency-heading" className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
          Run review QR codes for all your clients
        </h2>
        <p className="text-gray-600">
          Everything in Pro, plus team logins, client dashboards, billing and payment collection, built for marketing
          agencies and resellers.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENCY_FEATURES.map((feature) => {
          const Icon = ICONS[feature.key];
          return (
            <div
              key={feature.key}
              className="rounded-2xl border border-gray-100 bg-white p-5 hover:border-rose-200 hover:shadow-md transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5 leading-snug">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {showCta && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all active:scale-95 group"
          >
            See Agency pricing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            Talk to sales
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default AgencyFeaturesSection;
