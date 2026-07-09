'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Check, Sparkles, Copy, Smartphone } from 'lucide-react';
import HowItWorksSteps from '@/components/HowItWorksSteps';
import TestimonialCard from '@/components/TestimonialCard';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import FaqSection from '@/components/FaqSection';
import { TESTIMONIALS } from '@/utils/mockData';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import BusinessSearchBar from '@/components/BusinessSearchBar';
import { SEO_GUIDE_LINKS } from '@/lib/seo/internal-links';

import standeeCafe from '@/assets/standee-cafe.jpg';
import standeeCounter from '@/assets/standee-counter.jpg';
import stickerDoor from '@/assets/sticker-door.jpg';

const AI_DEMO_REVIEWS = [
  'Great service and friendly staff. Highly recommend this place for anyone nearby!',
  'Clean, quick, and professional. Will definitely come back again.',
  'Excellent experience from start to finish. Five stars well deserved.',
];

const HomePageClient = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/google-review-qr-code-generator?q=${encodeURIComponent(query)}`);
  };

  const OAuthHandler = () => {
    const { isProcessing } = useOAuthCallback();
    if (isProcessing) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Signing you in...</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="overflow-hidden bg-[#f7faf8]">
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>

      {/* ══════════════════════════════════════════
          HERO — brand + one line + search + standee
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(29,158,117,0.12),transparent_50%),radial-gradient(ellipse_at_90%_10%,rgba(24,95,165,0.08),transparent_45%),linear-gradient(180deg,#f7faf8_0%,#eef6f2_55%,#f7faf8_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
              backgroundSize: '180px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            {/* Copy + search */}
            <div className="text-center lg:text-left">
              <p className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-gray-900 leading-none mb-5 animate-fade-in-up">
                Review<span className="text-primary">QR</span>
              </p>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug tracking-tight mb-3 animate-fade-in-up [animation-delay:80ms]">
                More Google reviews from your counter
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in-up [animation-delay:140ms]">
                Print a QR standee — customers scan, pick an AI-written review, and post on Google in seconds.
              </p>

              <div
                id="search-section"
                className="animate-fade-in-up [animation-delay:200ms] max-w-xl mx-auto lg:mx-0"
              >
                <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-2 sm:p-3 shadow-[0_20px_50px_-24px_rgba(29,158,117,0.45)] border border-white/80 ring-1 ring-primary/10">
                  <BusinessSearchBar
                    query={query}
                    setQuery={setQuery}
                    isLoading={false}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onSearch={handleSearch}
                  />
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-500 animate-fade-in-up [animation-delay:280ms] flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI review suggestions
                </span>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <span>Free forever plan</span>
                <span className="text-gray-300 hidden sm:inline">·</span>
                <span>Works worldwide</span>
              </p>
            </div>

            {/* Dominant standee visual */}
            <div className="relative animate-fade-in-up [animation-delay:180ms] lg:min-h-[520px]">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:absolute lg:inset-0 lg:aspect-auto rounded-[1.75rem] overflow-hidden shadow-[0_32px_64px_-28px_rgba(15,40,30,0.45)]">
                <Image
                  src={standeeCounter}
                  alt="Google review QR standee on a billing counter"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover animate-hero-ken"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="font-display text-white text-xl sm:text-2xl font-semibold leading-snug drop-shadow-sm">
                    Print. Place. Collect 5-star reviews.
                  </p>
                  <p className="text-white/80 text-sm mt-1.5">
                    Counter standees customers actually scan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW TO DISPLAY — real product photos
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
              Download. Print. Get reviews.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              High-res designs for paper, acrylic, or vinyl — put them where customers already pause.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                img: standeeCafe,
                alt: 'Google Review Standee on Cafe Table',
                title: 'Table standees',
                desc: '4×6 acrylic on tables. Guests scan while they wait.',
              },
              {
                img: standeeCounter,
                alt: 'Google Review Standee on Billing Counter',
                title: 'Counter display',
                desc: 'Checkout is the highest-intent moment for a review.',
              },
              {
                img: stickerDoor,
                alt: 'Google Review Sticker on Glass Door',
                title: 'Window stickers',
                desc: 'Show your rating before customers even walk in.',
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/5] bg-gray-100">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AI REVIEWS — key differentiator
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#0f3d2e] text-white overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 15% 20%, rgba(43,184,137,0.45), transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(24,95,165,0.25), transparent 45%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 mb-4">
                <Sparkles className="w-4 h-4" />
                AI-powered customer reviews
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-snug">
                Customers don&apos;t stare at a blank review box
              </h2>
              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
                After they scan your QR, ReviewQR shows ready-to-use review text.
                They tap to copy, open Google, and paste — reviews finish in under a minute.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'AI writes 3 natural review options for your business',
                  'One tap to copy — then paste on Google Reviews',
                  'Included on Starter and above with your branded landing page',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-white/90">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-white transition-colors group"
              >
                See plans with AI reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Phone-style preview of AI suggestions */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-[1.75rem] bg-white text-gray-900 shadow-2xl shadow-black/40 p-5 sm:p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">AI review suggestions</p>
                    <p className="text-xs text-gray-400">Tap one to copy &amp; paste</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {AI_DEMO_REVIEWS.map((text, i) => (
                    <div
                      key={text}
                      className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                        i === 0
                          ? 'border-primary bg-primary-light/40'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <p className="text-sm text-gray-700 leading-relaxed pr-7">
                        &ldquo;{text}&rdquo;
                      </p>
                      <Copy
                        className={`absolute top-3.5 right-3.5 w-4 h-4 ${
                          i === 0 ? 'text-primary' : 'text-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                  <Smartphone className="w-3.5 h-3.5 text-primary" />
                  What customers see after scanning your QR
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#f0f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-gray-600 text-lg">
              Search, print, and let AI help customers finish the review.
            </p>
          </div>
          <HowItWorksSteps />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY — compact proof strip (not icon cards)
      ══════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
            {[
              'Search Google Maps → get a 1-tap review link',
              'AI review suggestions so customers finish faster',
              'Print-ready PNG & PDF standee downloads',
              'Works for any business on Google Maps, worldwide',
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-gray-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                  <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                </span>
                <span className="text-[15px] leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GUIDES — internal links for crawl priority
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-[#f7faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                Guides to get more Google reviews
              </h2>
              <p className="text-gray-600">
                Practical playbooks for restaurants, salons, standees, and Place IDs — plus the free generator.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark shrink-0"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEO_GUIDE_LINKS.map((guide) => (
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

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#f7faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
              Loved by business owners
            </h2>
            <p className="text-gray-600">
              Local shops using ReviewQR to grow their Google reputation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1.75rem] px-8 py-14 sm:py-16 text-center bg-[linear-gradient(135deg,#0f3d2e_0%,#1D9E75_55%,#2bb889_100%)]">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%)',
              }}
            />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-white" />
                ))}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
                Ready for more reviews?
              </h2>
              <p className="text-white/85 mb-8 max-w-md mx-auto leading-relaxed">
                Free QR to start. Upgrade for AI review suggestions that help customers post faster.
              </p>
              <Link
                href="/google-review-qr-code-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary text-base font-bold rounded-xl transition-all duration-200 hover:bg-primary-light hover:shadow-lg active:scale-[0.98] group"
              >
                Generate my free QR
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-white/70 mt-4">No credit card · Free forever plan</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageClient;
