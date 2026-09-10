'use client';

import Link from 'next/link';
import { ArrowUpRight, Code2, Sparkles } from 'lucide-react';
import { ONE9TECH, ONE9TECH_PORTFOLIO_URL } from '@/lib/one9tech';

type Variant = 'footer' | 'card' | 'section';

interface One9TechPortfolioPromoProps {
  variant?: Variant;
  className?: string;
}

const portfolioLinkProps = {
  href: ONE9TECH_PORTFOLIO_URL,
  target: '_blank' as const,
  rel: 'noopener noreferrer',
};

export default function One9TechPortfolioPromo({
  variant = 'card',
  className = '',
}: One9TechPortfolioPromoProps) {
  if (variant === 'footer') {
    return (
      <p className={`text-sm text-gray-500 ${className}`}>
        Need a custom website or app?{' '}
        <Link href="/services" className="text-primary hover:text-primary-dark font-medium transition-colors">
          Custom development
        </Link>
        {' · '}
        <a
          {...portfolioLinkProps}
          className="text-primary hover:text-primary-dark font-medium transition-colors inline-flex items-center gap-0.5"
        >
          {ONE9TECH.name} portfolio
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </p>
    );
  }

  if (variant === 'section') {
    return (
      <section className={`py-16 lg:py-20 bg-white border-t border-gray-100 ${className}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              aria-hidden
              style={{
                backgroundImage:
                  'radial-gradient(circle at 10% 20%, rgba(29,158,117,0.35) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(99,102,241,0.25) 0%, transparent 40%)',
              }}
            />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Freelance development
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Need something built like ReviewQR?
                </h2>
                <p className="text-slate-300 leading-relaxed mb-5 max-w-xl">
                  {ONE9TECH.name} builds fast, modern websites and web apps for startups and local
                  businesses — from landing pages to full SaaS products.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
                  {ONE9TECH.services.map((service) => (
                    <li key={service} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 self-start md:self-center">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition-all"
                >
                  View services
                </Link>
                <a
                  {...portfolioLinkProps}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
                >
                  Portfolio
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <Code2 className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
            Custom development
          </p>
          <h3 className="font-bold text-gray-900 mb-1.5">
            Hire {ONE9TECH.name} for your next project
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{ONE9TECH.tagline}.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/services"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              All services →
            </Link>
            <a
              {...portfolioLinkProps}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              one9tech.online
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
