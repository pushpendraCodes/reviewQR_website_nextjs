'use client';


import { Mail, Info, Target, Users, MapPin } from 'lucide-react';

/**
 * AboutUs — Mandatory informational page for Razorpay compliance
 */
const AboutUs = () => {
  return (
    <div>
      
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-white via-primary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <Info className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Helping Businesses Shine Online
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            ReviewQR is dedicated to empowering local businesses in India by making it incredibly easy for their customers to leave 5-star Google reviews.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                In today's digital world, a business's online reputation is its most valuable asset. However, most happy customers simply forget to leave a review.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to bridge this gap. We provide smart, beautifully designed QR code solutions and standees that turn a physical interaction into a digital 5-star review in seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-8 rounded-2xl border border-gray-100 text-center">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900">Focus</h3>
                <p className="text-sm text-gray-500 mt-2">Simplicity first</p>
              </div>
              <div className="bg-surface p-8 rounded-2xl border border-gray-100 text-center">
                <div className="w-12 h-12 bg-secondary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-gray-900">Impact</h3>
                <p className="text-sm text-gray-500 mt-2">1000+ businesses</p>
              </div>
              <div className="bg-surface p-8 rounded-2xl border border-gray-100 text-center col-span-2">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="font-bold text-gray-900">Proudly Indian</h3>
                <p className="text-sm text-gray-500 mt-2">Based in Rewa, Madhya Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-surface border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-500 mb-10">
            Have a question or want to collaborate? We're always open to chat.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 text-left shadow-sm">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Email Us</p>
                <a href="mailto:contact@getreviewqr.com" className="text-gray-900 font-bold hover:text-primary transition-colors">
                  contact@getreviewqr.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 text-left shadow-sm">
              <div className="w-12 h-12 bg-secondary-light rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Our Office</p>
                <p className="text-gray-900 font-bold">
                  Rewa, Madhya Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
