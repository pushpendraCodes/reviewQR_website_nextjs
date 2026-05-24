'use client';

import { MessageCircle, ArrowRight } from 'lucide-react';
/**
 * UpsellBanner — Cross-sell banner for WhatsApp automation
 * Shown below the QR code output section
 */
const UpsellBanner = () => {
  return (
    <div className="bg-gradient-to-r from-secondary/5 via-primary/5 to-secondary/5 border border-secondary/20 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Icon */}
        <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-7 h-7 text-[#25D366]" />
        </div>
        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Want more customers? 🚀
          </h3>
          <p className="text-sm text-gray-600">
            Set up WhatsApp Automation for your shop. Auto-reply to messages, 
            send order updates, and collect reviews — all on autopilot.
          </p>
        </div>
        {/* CTA */}
        <a
          href="#"
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-secondary-dark transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 active:scale-95 group"
        >
          Learn More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};
export default UpsellBanner;