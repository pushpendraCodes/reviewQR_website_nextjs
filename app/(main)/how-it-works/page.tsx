'use client';

import { useState } from 'react';
import Link from 'next/link';;
import { ArrowRight, ChevronDown, Play, QrCode, Printer, Star, MessageSquare } from 'lucide-react';
import HowItWorksSteps from '@/components/HowItWorksSteps';

import { FAQ_DATA } from '@/utils/mockData';

/**
 * HowItWorksPage — Detailed guide + FAQ + video placeholder
 */
const HowItWorksPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  return (
    <div>
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Step-by-step guide</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            How ReviewQR Works
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about generating Google Review QR codes 
            and growing your business ratings.
          </p>
        </div>
      </section>
      {/* ==================== DETAILED STEPS ==================== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksSteps detailed />
        </div>
      </section>
      {/* ==================== WHERE TO PLACE QR ==================== */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Pro Tips</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
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
                icon: Star,
                title: 'Packaging & Bags',
                description: 'Add a small QR sticker on your product packaging or carry bags with a friendly message.',
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
      {/* ==================== VIDEO PLACEHOLDER ==================== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Watch & Learn</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              See It in Action
            </h2>
          </div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl aspect-video flex items-center justify-center overflow-hidden group cursor-pointer">
            {/* Play Button */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <p className="absolute bottom-6 text-white/50 text-sm">
              Video tutorial coming soon
            </p>
            {/* Decorative elements */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
          </div>
        </div>
      </section>
      {/* ==================== FAQ ==================== */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
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
      {/* ==================== CTA ==================== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Generate your first Google Review QR code in under 60 seconds. Completely free.
          </p>
          <Link
            href="/generate"
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