'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Globe,
  HelpCircle,
  MessageCircle,
  QrCode,
  Sparkles,
  Star,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { HOME_FAQS } from '@/lib/seo/home-faqs';

const FAQ_ICONS: LucideIcon[] = [QrCode, Sparkles, HelpCircle, Star, TrendingUp, Globe, MessageCircle];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden" aria-labelledby="faq-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-light/30 to-[#f0f5f2] pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-14 items-start">
          <div className="lg:sticky lg:top-24 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-md uppercase tracking-wider mb-5">
              <MessageCircle className="w-3.5 h-3.5" />
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 leading-tight tracking-tight"
            >
              Questions?{' '}
              <span className="text-primary">We&apos;ve got answers.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
              Everything about Google Review QR codes, pricing, and getting more 5-star reviews for your business.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group"
            >
              Read the full guide
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <ul className="space-y-3 list-none p-0 m-0">
            {HOME_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              const Icon = FAQ_ICONS[index] ?? HelpCircle;

              return (
                <li key={faq.question}>
                  <div
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? 'border-primary/25 bg-white shadow-lg shadow-primary/5 ring-1 ring-primary/10'
                        : 'border-gray-200/80 bg-white/80 hover:border-primary/20 hover:shadow-md hover:shadow-gray-100/80'
                    }`}
                  >
                    <button
                      type="button"
                      id={`faq-trigger-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => toggle(index)}
                      className="w-full flex items-start gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                    >
                      <span
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                          isOpen
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-primary-light text-primary'
                        }`}
                        aria-hidden
                      >
                        <Icon className="w-5 h-5" />
                      </span>

                      <span className="flex-1 min-w-0 pt-0.5">
                        <span className="block text-base sm:text-lg font-bold text-gray-900 pr-2">
                          {faq.question}
                        </span>
                      </span>

                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mt-0.5 ${
                          isOpen ? 'bg-primary-light rotate-180' : 'bg-gray-100'
                        }`}
                        aria-hidden
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-colors ${
                            isOpen ? 'text-primary' : 'text-gray-400'
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.25rem] sm:pl-[4.75rem] text-gray-600 text-sm sm:text-base leading-relaxed border-t border-primary/10 pt-4 -mt-1">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
            <span className="font-semibold text-gray-900">Still stuck?</span>{' '}
            Our team usually replies within a few hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            Contact support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
