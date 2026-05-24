'use client';


import { Mail, FileText } from 'lucide-react';

/**
 * TermsConditions — Mandatory legal page for Razorpay compliance
 */
const TermsConditions = () => {
  const lastUpdated = "May 4, 2026";

  return (
    <div>
      
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Terms & Conditions
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              By accessing and using ReviewQR ("Website," "we," "us," or "our"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ReviewQR provides a platform for businesses to generate Google Review QR codes and standees. Our services include both free and premium subscription plans as detailed on our Pricing page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To use certain features, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Providing accurate and complete information during registration.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Subscription and Payments</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Certain services are available only through paid subscriptions. 
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>All payments are processed securely via Razorpay.</li>
              <li>Subscription fees are billed in advance according to the chosen plan (monthly or annual).</li>
              <li>We reserve the right to change our pricing at any time, with notice provided to existing subscribers.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              All content on this website, including text, graphics, logos, and software, is the property of ReviewQR or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Use the service for any illegal or unauthorized purpose.</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
              <li>Interfere with or disrupt the integrity or performance of the service.</li>
              <li>Use the service to spam or harass others.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              To the maximum extent permitted by law, ReviewQR shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Termination</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users or our business.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Governing Law</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Rewa, Madhya Pradesh.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If you have any questions regarding these Terms and Conditions, please contact us:
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

export default TermsConditions;
