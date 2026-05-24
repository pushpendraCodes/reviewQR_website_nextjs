'use client';


import { Mail, RefreshCcw } from 'lucide-react';

/**
 * RefundPolicy — Mandatory legal page for Razorpay compliance.
 * Updated to reflect a strict No Refund and No Cancellation policy.
 */
const RefundPolicy = () => {
  const lastUpdated = "May 4, 2026";

  return (
    <div>
      
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <RefreshCcw className="w-4 h-4" />
            Policy Update
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Refund & Cancellation
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 shadow-sm prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. No Refund Policy</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At ReviewQR, we maintain a strict <strong>"No Refund"</strong> policy for all our subscription plans (Starter, Pro, and Agency). 
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Since our services are digital and provide instant access to premium features including high-resolution downloads, AI-powered suggestions, and customization tools, <strong>all sales are final</strong>. We do not offer refunds once a transaction is completed and the subscription is activated.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. No Cancellation Policy</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Once an order is placed and the payment is processed, we do not support cancellations of the order. As the delivery of our digital product is instantaneous, the transaction cannot be reversed or cancelled.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Try Before You Buy</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We highly encourage all users to try our <strong>Free Plan</strong> before upgrading to a paid subscription. The Free Plan allows you to test the core functionality of our QR generator and standee builder to ensure it meets your business requirements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If you have any questions about our Refund & Cancellation Policy, please reach out to us:
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:contact@getreviewqr.com" className="text-gray-900 font-semibold hover:text-primary transition-colors">
                  contact@getreviewqr.com
                </a>
              </div>
              <div className="text-gray-500 text-sm">
                Rewa, Madhya Pradesh 486001, India
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
