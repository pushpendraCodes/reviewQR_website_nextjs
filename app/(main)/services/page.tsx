'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Code2,
  Globe,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  ShoppingCart,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ONE9TECH, ONE9TECH_PORTFOLIO_URL } from '@/lib/one9tech';

const iconMap = {
  layers: Layers,
  globe: Globe,
  cart: ShoppingCart,
  zap: Zap,
  layout: LayoutDashboard,
  rocket: Rocket,
} as const;

const portfolioLink = {
  href: ONE9TECH_PORTFOLIO_URL,
  target: '_blank' as const,
  rel: 'noopener noreferrer',
};

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-24 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-emerald-300 text-sm font-medium rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            {ONE9TECH.name} · Freelance development
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Custom web development that ships
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {ONE9TECH.tagline}. From landing pages to full SaaS products — built with modern
            stack, clean code, and a focus on results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              {...portfolioLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
            >
              View portfolio
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${ONE9TECH.whatsapp}?text=Hi!%20I%20want%20to%20discuss%20a%20custom%20web%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Discuss your project
            </a>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What I build</h2>
            <p className="text-gray-500">
              End-to-end development — design, frontend, backend, payments, and deployment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ONE9TECH.offerings.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Code2;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-surface p-6 hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="py-16 lg:py-24 bg-surface border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                Live case study
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You're already using my work
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                <strong>{ONE9TECH.caseStudy.name}</strong> — {ONE9TECH.caseStudy.description}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Next.js marketing site with SEO & blog',
                  'User auth, subscriptions & payment gateways',
                  'AI-powered review suggestions',
                  'Admin panel for users, revenue & QR codes',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Explore ReviewQR
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-50 border border-primary/20 p-8 sm:p-10">
              <p className="text-4xl font-display font-semibold text-gray-900 mb-2">
                Review<span className="text-primary">QR</span>
              </p>
              <p className="text-gray-600 mb-6">
                Proof of full-stack delivery — from idea to production SaaS with paying customers.
              </p>
              <a
                {...portfolioLink}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all"
              >
                More projects on one9tech.online
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How we work together</h2>
            <p className="text-gray-500">Simple process, clear communication, no surprises.</p>
          </div>
          <div className="space-y-6">
            {ONE9TECH.process.map((item) => (
              <div
                key={item.step}
                className="flex gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-gray-100 bg-surface"
              >
                <span className="text-2xl font-bold text-primary/40 shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-14 bg-surface border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tech stack</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {ONE9TECH.stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to build something?</h2>
          <p className="text-gray-500 mb-8">
            Tell me about your project — website, app, or MVP. I'll reply within 24 hours with
            next steps and a honest quote.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              {...portfolioLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              one9tech.online
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
            >
              Contact via ReviewQR
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">{ONE9TECH.location}</p>
        </div>
      </section>
    </div>
  );
}
