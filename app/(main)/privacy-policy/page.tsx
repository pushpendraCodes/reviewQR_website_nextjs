'use client';


import { Mail, ShieldCheck } from 'lucide-react';

/**
 * PrivacyPolicy — Mandatory legal page for Razorpay compliance
 */
const PrivacyPolicy = () => {
  const lastUpdated = "May 4, 2026";

  return (
    <div>
      
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <ShieldCheck className="w-4 h-4" />
            Your privacy is our priority
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to ReviewQR ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information when you use our website and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Information We Collect</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Create an account or sign up for our services.</li>
              <li>Generate QR codes using our platform (including business names and Google Place IDs).</li>
              <li>Contact us for support or inquiries.</li>
              <li>Subscribe to our newsletters or marketing communications.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Providing and maintaining our QR code generation services.</li>
              <li>Processing payments through our payment gateway partners (Razorpay).</li>
              <li>Communicating with you regarding updates, security alerts, and support.</li>
              <li>Improving our website and user experience through analytics.</li>
              <li>Ensuring compliance with legal obligations.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We do not sell your personal data. We may share information with third-party service providers who assist us in operating our business, such as payment processors (Razorpay) and hosting providers. These parties are obligated to keep your information confidential.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Data Security</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We use cookies to enhance your experience, remember your preferences, and analyze our traffic. You can choose to disable cookies through your browser settings, though some features of our site may not function properly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Your Rights</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. To exercise these rights, please contact us at the email provided below.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
