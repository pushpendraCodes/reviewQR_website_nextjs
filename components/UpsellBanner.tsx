'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * UpsellBanner — Promote AI review suggestions on free plan
 */
const UpsellBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-emerald-50 to-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Help customers finish reviews faster
          </h3>
          <p className="text-sm text-gray-600">
            Upgrade to Starter for a branded landing page with AI review suggestions —
            customers tap to copy, paste on Google, and post in seconds.
          </p>
        </div>
        <Link
          href="/pricing"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95 group"
        >
          Unlock AI reviews
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
export default UpsellBanner;
