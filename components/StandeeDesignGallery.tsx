'use client';

import Link from 'next/link';
import { Check, Crown, Lock } from 'lucide-react';
import StandeePreview, { DEFAULT_STANDEE_DISPLAY } from './StandeePreview';
import { STANDEE_TEMPLATE_OPTIONS } from './Qrcustomizer';
import { usePlan } from '../hooks/Useplan';
import type { Business } from '../store/api/placesApi';

const THUMB_SCALE = 0.4;

/** Locked preview of every standee design, rendered with the user's own business, for plans below Pro. */
const StandeeDesignGallery = ({ business }: { business: Business }) => {
  const { plan, planExpiredNotifSent } = usePlan();
  const cta = planExpiredNotifSent ? 'Renew' : 'Upgrade';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-50 to-primary/5 border-b border-violet-100">
        <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">
            {STANDEE_TEMPLATE_OPTIONS.length} standee designs for {business.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Google-style Tap &amp; Scan designs, logo, colours, dot shapes and 5 languages on the Pro plan
          </p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all active:scale-95"
        >
          {cta}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
        {STANDEE_TEMPLATE_OPTIONS.map(({ value, label, google, isNew }) => {
          const included = value === 'minimal';
          return (
            <Link
              key={value}
              href={included ? '#standee-preview' : '/pricing'}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-2 hover:border-violet-200 hover:bg-violet-50/40 transition-colors"
              aria-label={included ? `${label} design (included)` : `${label} design, ${cta} to Pro to use it`}
            >
              <div className="relative w-[128px] h-[216px] overflow-hidden rounded-lg bg-gray-50">
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none origin-top-left"
                  style={{ width: 320, transform: `scale(${THUMB_SCALE})` }}
                >
                  <StandeePreview
                    business={business}
                    plan={included ? plan : 'pro'}
                    template={value}
                    display={{ ...DEFAULT_STANDEE_DISPLAY, nfc: Boolean(google) }}
                    thumbnail
                  />
                </div>
                {!included && (
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-violet-700 shadow-sm">
                      <Lock className="w-3 h-3" /> Pro
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">
                {label}
                {isNew && <span className="ml-1 text-[8px] font-bold text-violet-600 uppercase">New</span>}
              </span>
              {included && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                  <Check className="w-3 h-3" /> Your plan
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StandeeDesignGallery;
