'use client';

import Link from 'next/link';;
import { QrCode, Mail, Phone, MapPin } from 'lucide-react';
/**
 * Footer — Site-wide footer with links, contact info, and branding
 */
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                {/* <QrCode className="w-5 h-5 text-white" /> */}
                <img src="/favicon.svg" alt="Logo" className="w-9 h-9" />
              </div>
              <span className="text-xl font-bold text-white">
                Review<span className="text-primary">QR</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Help local businesses in India get more Google reviews with simple QR codes.
              Free, fast, and incredibly effective.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/google-review-qr-code-generator', label: 'Generate QR Code' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Use Cases */}
          <div>
            <h4 className="text-white font-semibold mb-4">Use Cases</h4>
            <ul className="space-y-3">
              {[
                'Restaurants & Cafés',
                'Medical Clinics',
                'Salons & Spas',
                'Coaching Institutes',
                'Retail Stores',
                'Hotels & Lodges',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:contact@getreviewqr.com" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  contact@getreviewqr.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+918516064332" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  +91 8516064332
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  Rewa, Madhya Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ReviewQR. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link href="/about-us" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              About Us
            </Link>
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Refund & Cancellation Policy
            </Link>
            <Link href="/shipping-policy" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;