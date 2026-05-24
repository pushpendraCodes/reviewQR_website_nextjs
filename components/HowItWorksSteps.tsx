'use client';

import { Search, MapPin, QrCode } from 'lucide-react';
/**
 * HowItWorksSteps — Reusable 3-step explanation component
 * Used on both Landing page and How It Works page
 */
interface HowItWorksStepsProps {
  detailed?: boolean;
}
const HowItWorksSteps = ({ detailed = false }: HowItWorksStepsProps) => {
  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Search Your Business',
      description: 'Type your business name and city. We search Google Maps to find your listing automatically.',
      detail: 'Our tool connects to Google Maps to find your exact business listing. Just type your business name and city — we handle the rest. No need to know your Place ID or any technical details.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: MapPin,
      number: '02',
      title: 'We Find Your Place ID',
      description: 'Select your business from results. We automatically extract your unique Google Place ID.',
      detail: 'Every business on Google Maps has a unique identifier called a Place ID. We automatically detect this and use it to generate a direct review link — the shortest path from scan to review.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: QrCode,
      number: '03',
      title: 'Get Your QR Code',
      description: 'Your QR code is generated instantly. Download it as PNG or get a printable standee PDF.',
      detail: 'Your QR code is generated in seconds. Download it as a high-resolution PNG image, or get a beautiful A5-size printable standee PDF with your business name, rating, and Google branding. Perfect for your billing counter or reception desk!',
      color: 'bg-green-50 text-green-600',
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {steps.map((step, index) => (
        <div
          key={step.number}
          className="relative group"
        >
          {/* Connector line (desktop only) */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-gray-100" />
          )}
          <div className={`relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full ${detailed ? 'p-8' : ''}`}>
            {/* Step Number */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-100">{step.number}</span>
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