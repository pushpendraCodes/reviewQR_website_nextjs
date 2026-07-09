'use client';

import { Search, QrCode, Sparkles } from 'lucide-react';

interface HowItWorksStepsProps {
  detailed?: boolean;
}

const HowItWorksSteps = ({ detailed = false }: HowItWorksStepsProps) => {
  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Search Your Business',
      description: 'Type your business name and city. We find your Google Maps listing automatically.',
      detail:
        'Our tool connects to Google Maps to find your exact business listing. Just type your business name and city — we handle the rest. No Place ID or technical setup needed.',
      color: 'bg-secondary-light text-secondary',
    },
    {
      icon: QrCode,
      number: '02',
      title: 'Get Your QR & Standee',
      description: 'Download a print-ready QR or PDF standee for your counter, table, or door.',
      detail:
        'Your QR links customers straight to your Google review page. Download a high-res PNG, or a printable standee PDF with your business name and rating — perfect for the billing counter.',
      color: 'bg-primary-light text-primary',
    },
    {
      icon: Sparkles,
      number: '03',
      title: 'AI Helps Them Review Faster',
      description: 'Customers scan, pick an AI-written review, copy, and paste on Google in seconds.',
      detail:
        'On Starter and above, scanners land on your branded page with AI review suggestions. They tap to copy ready-made text, open Google Reviews, and paste — no blank-box writer’s block. More scans turn into finished reviews.',
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {steps.map((step, index) => (
        <div key={step.number} className="relative group">
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/25 to-transparent" />
          )}
          <div className={`relative h-full ${detailed ? 'pt-2' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-200/80">{step.number}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {detailed ? step.detail : step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HowItWorksSteps;
