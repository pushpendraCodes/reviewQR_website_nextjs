'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, QrCode, Printer, Star, MessageSquare, Sparkles, Copy } from 'lucide-react';
import HowItWorksSteps from '@/components/HowItWorksSteps';
import { SEO_GUIDE_LINKS } from '@/lib/seo/internal-links';

import { FAQ_DATA } from '@/utils/mockData';

/**
 * HowItWorksPage — Detailed guide + FAQ + video
 */
const HowItWorksPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  return (
    <div>

      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Step-by-step guide</span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-gray-900 mt-3 mb-4 tracking-tight">
            How ReviewQR Works
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Generate a Google Review QR, print a standee, and let AI help customers finish reviews faster.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksSteps detailed />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#0f3d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 mb-4">
                <Sparkles className="w-4 h-4" />
                Starter plan and above
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                AI review suggestions remove writer&apos;s block
              </h2>
              <p className="text-white/75 text-lg leading-relaxed mb-6">
                Most happy customers never leave a review because typing feels like work.
                ReviewQR shows ready-made options on your branded landing page after they scan.
              </p>
              <ol className="space-y-4">
                {[
                  { icon: QrCode, text: 'Customer scans your standee QR' },
                  { icon: Sparkles, text: 'AI shows 3 natural review options' },
                  { icon: Copy, text: 'They copy, open Google, and paste' },
                ].map((step, i) => (
                  <li key={step.text} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                      <step.icon className="w-4 h-4" />
                    </span>
                    <span className="text-white/90">
                      <span className="text-emerald-200 font-semibold mr-2">{i + 1}.</span>
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
              <p className="text-sm font-semibold text-emerald-200 mb-4">Why it converts better</p>
              <ul className="space-y-4 text-white/80 text-[15px] leading-relaxed">
                <li>Blank Google review boxes get abandoned — suggestions get finished.</li>
                <li>Copy-paste takes seconds, even for customers in a hurry.</li>
                <li>Reviews still sound human; customers can edit before posting.</li>
                <li>You keep the QR + standee workflow you already know.</li>
              </ul>
              <Link
                href="/pricing"
                className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary-light transition-colors"
              >
                Unlock AI reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Pro Tips</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mt-2 mb-4 tracking-tight">
              Where to Place Your QR Code
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Maximize your reviews by placing QR codes where customers can easily scan them.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Printer,
                title: 'Billing Counter',
                description: 'Place a standee next to your billing/cash counter. Customers can scan while waiting for the bill.',
              },
              {
                icon: QrCode,
                title: 'Reception Desk',
                description: 'Perfect for clinics, salons, and offices. Patients/clients see it while waiting.',
              },
              {
                icon: Star,
                title: 'Dining Tables',
                description: 'Restaurants can place QR tent cards on each table. Customers review while waiting for food.',
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp Messages',
                description: 'Share the review link after every transaction via WhatsApp. Quick and personal.',
              },
              {
                icon: QrCode,
                title: 'Visiting Cards',
                description: 'Print the QR code on the back of your business card. Professional and functional.',
              },
              {
                icon: Sparkles,
                title: 'After great service',
                description: 'Ask right after a happy moment — then AI suggestions make posting almost effortless.',
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                  <tip.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Watch &amp; Learn</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mt-2 mb-4 tracking-tight">
              See It in Action
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Watch how to generate your Google Review QR code in under 60 seconds.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ padding: '46.98% 0 0 0', position: 'relative' }}>
            <iframe
              src="https://player.vimeo.com/video/1196897057?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="How ReviewQR Works – Generate a Google Review QR Code"
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mt-2 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-[#f0f5f2] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-gray-900 tracking-tight mb-3">
              Keep learning
            </h2>
            <p className="text-gray-600">
              Deep-dive guides Google is still discovering — linked here so crawlers (and customers) can find them.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEO_GUIDE_LINKS.filter((g) => g.href !== '/google-review-qr-code-generator').map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-2xl border border-gray-100 bg-white p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1.5 leading-snug">
                  {guide.label}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">{guide.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Generate your first Google Review QR free — upgrade anytime for AI suggestions that speed up reviews.
          </p>
          <Link
            href="/google-review-qr-code-generator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-95 group"
          >
            Generate My QR Code
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};
export default HowItWorksPage;
