'use client';

import Link from 'next/link';
import { MessageSquare, Sparkles, Filter, Send, ArrowLeft } from 'lucide-react';

// Full feature lives in components/dashboard/GoogleReviewsManager.tsx —
// render it here once Google Business Profile API access is approved.

const UPCOMING = [
  { icon: MessageSquare, label: 'Connect your Google Business Profile' },
  { icon: Filter, label: 'Filter reviews by stars and reply status' },
  { icon: Sparkles, label: 'AI-generated replies you can edit' },
  { icon: Send, label: 'Post replies directly to Google' },
];

export default function GoogleReviewsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-8 mt-10 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center">
          <MessageSquare className="w-7 h-7 text-[#1A6B45]" />
        </div>
        <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
          Coming soon
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Google Reviews Management
        </h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Read and reply to your Google reviews without leaving ReviewQR. We&apos;re finishing
          the Google Business Profile integration — it will be available here shortly.
        </p>

        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {UPCOMING.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
            >
              <Icon className="w-4 h-4 text-[#1A6B45] shrink-0" />
              {label}
            </li>
          ))}
        </ul>

        <Link
          href="/dashboard/google-rating"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#1A6B45] text-white hover:bg-[#155a38]"
        >
          <ArrowLeft className="w-4 h-4" />
          View Google rating instead
        </Link>
      </div>
    </div>
  );
}
