'use client';


import { Mail, Truck } from 'lucide-react';

/**
 * ShippingPolicy — Mandatory legal page for Razorpay compliance (even for digital services)
 */
const ShippingPolicy = () => {
  const lastUpdated = "May 4, 2026";

  return (
    <div>
      
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-secondary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <Truck className="w-4 h-4" />
            Instant Digital Delivery
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Shipping & Delivery
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Digital Delivery</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ReviewQR provides digital services and products. We do not ship physical products to your doorstep. All our "products" (generated QR codes, standee designs, and dashboard access) are delivered digitally through our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Delivery Timeline</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>Instant Access:</strong> Upon successful payment and subscription activation, your premium features are enabled instantly. You can immediately:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Download your high-resolution QR codes (PNG, SVG).</li>
              <li>Access premium standee templates and customization tools.</li>
              <li>View your analytics dashboard.</li>
            </ul>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The digital files are generated in real-time and are available for download directly from your dashboard after you input your business details.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Delivery Confirmation</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              After a successful transaction, you will receive an email confirmation containing your transaction details and a link to access your account. Your premium status will be reflected in your profile settings immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Technical Issues</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              In rare cases, technical delays may occur. If you have completed a payment but do not see your premium features active within 30 minutes, please contact our support team immediately with your transaction ID.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If you have any questions about how our services are delivered, please reach out to us:
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

export default ShippingPolicy;
