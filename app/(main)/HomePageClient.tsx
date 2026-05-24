'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Globe, Smartphone, Users, TrendingUp, Shield, Star, Check, HelpCircle, Package, Award } from 'lucide-react';
import HowItWorksSteps from '@/components/HowItWorksSteps';
import TestimonialCard from '@/components/TestimonialCard';
import { Suspense } from 'react';
import Accordion from '@/components/Accordion';
import { TESTIMONIALS } from '@/utils/mockData';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';

// Real-world visuals
import standeeCafe from '@/assets/standee-cafe.jpg';
import standeeCounter from '@/assets/standee-counter.jpg';
import stickerDoor from '@/assets/sticker-door.jpg';

/**
 * HomePage — Landing page with hero, how it works, benefits, testimonials
 * Designed to convert visitors into QR code generators
 */
const HomePageClient = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ReviewQR",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "500"
        }
    };

    // ← Extract into separate component so Suspense can wrap it
    const OAuthHandler = () => {
        const { isProcessing } = useOAuthCallback();

        if (isProcessing) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Signing you in...</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="overflow-hidden">
            {/* ← Wrap only OAuthHandler in Suspense */}
            <Suspense fallback={null}>
                <OAuthHandler />
            </Suspense>

            {/* ==================== HERO SECTION ==================== */}
            {/* ==================== HERO SECTION ==================== */}
            <section className="relative bg-gradient-to-br from-white via-primary-light/30 to-secondary-light/20 pt-16 pb-20 lg:pt-24 lg:pb-32">
                {/* Background decorations */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6 animate-fade-in-up">
                            <Zap className="w-4 h-4" />
                            Free for Local Businesses Worldwide
                        </div>
                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Boost Your Business with
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Google Review Standees
                            </span>
                        </h1>
                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Search your business, generate a QR code, print it and start getting
                            <span className="text-amber-500 font-semibold"> 5-star reviews</span> today.
                            No technical skills needed.
                        </p>
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Link
                                href="/generate"
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                Generate My Free QR Code
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
                            >
                                See How It Works
                            </Link>
                        </div>
                        {/* Social Proof */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {['RS', 'PK', 'AV', 'SG'].map((initials, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                                <span>500+ businesses trust us</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                                <span className="ml-1">4.9/5 rating</span>
                            </div>
                        </div>
                    </div>
                    {/* Hero Image/Mockup */}
                    <div className="mt-16 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                <span className="ml-2 text-xs text-gray-400">getreviewqr.com/generate</span>
                            </div>
                            <div className="bg-surface rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                {/* Mock QR */}
                                <div className="w-32 h-32 bg-white rounded-xl border-2 border-primary/20 flex items-center justify-center p-3">
                                    <div className="grid grid-cols-5 gap-1 w-full h-full">
                                        {Array.from({ length: 25 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`rounded-sm ${[0, 1, 2, 4, 5, 6, 9, 10, 12, 14, 15, 18, 19, 20, 22, 23, 24].includes(i)
                                                    ? 'bg-primary'
                                                    : 'bg-gray-100'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-lg font-bold text-gray-900">Sharma Medical Store</p>
                                    <p className="text-sm text-gray-500">MG Road, Rewa, MP</p>
                                    <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                                        {[1, 2, 3, 4].map(i => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                        <Star className="w-4 h-4 text-gray-300" />
                                        <span className="text-sm text-gray-500 ml-1">4.2 · 47 reviews</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-lg">Download PNG</span>
                                        <span className="px-3 py-1 bg-secondary text-white text-xs font-medium rounded-lg">PDF Standee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== HOW TO USE YOUR QR CODE ==================== */}
            <section className="py-16 lg:py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">How to Display</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            Download. Print. Get Reviews.
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            We provide the high-resolution digital designs. You can print them on anything — from standard paper to premium acrylic standees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Cafe Standee */}
                        <div className="group">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6 aspect-[4/5]">
                                <img
                                    src={standeeCafe.src}
                                    alt="Google Review Standee on Cafe Table"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white text-sm font-medium">Perfect for Cafes & Restaurants</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Table Standees</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Download our PDF and place it in a 4x6 inch acrylic stand. Perfect for restaurant tables and cafes to get reviews while customers eat.
                            </p>
                        </div>

                        {/* Counter Standee */}
                        <div className="group">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6 aspect-[4/5]">
                                <img
                                    src={standeeCounter.src}
                                    alt="Google Review Standee on Billing Counter"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white text-sm font-medium">Ideal for Billing Counters</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Billing Counter Display</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Print our high-res designs for your reception or billing desk. Remind customers to leave a review right as they complete their purchase.
                            </p>
                        </div>

                        {/* Door Sticker */}
                        <div className="group">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6 aspect-[4/5]">
                                <img
                                    src={stickerDoor.src}
                                    alt="Google Review Sticker on Glass Door"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white text-sm font-medium">Glass Door & Window Stickers</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Window & Door Stickers</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Use our digital templates to print vinyl stickers. Showcase your 5-star reputation on your shop's glass door or windows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== HOW IT WORKS ==================== */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Simple Process</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Get your Google Review QR code in 3 simple steps. No sign-up required.
                        </p>
                    </div>
                    <HowItWorksSteps />
                </div>
            </section>
            {/* ==================== BENEFITS ==================== */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why ReviewQR</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            Built for Local Businesses Worldwide
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Whether you run a medical store, restaurant, salon, or coaching institute —
                            ReviewQR helps you get more customers through Google reviews.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: 'No Technical Knowledge Needed',
                                description: 'Search, select, download. That\'s it. Anyone can generate a QR code in under 60 seconds.',
                                color: 'bg-amber-50 text-amber-600',
                            },
                            {
                                icon: Globe,
                                title: 'Works for Any Business',
                                description: 'From chai stalls to hospitals — if your business is on Google Maps, ReviewQR works for you.',
                                color: 'bg-blue-50 text-blue-600',
                            },
                            {
                                icon: Smartphone,
                                title: 'Scan & Review in 1 Tap',
                                description: 'Customers scan the QR code and go directly to the review form. No searching, no hassle.',
                                color: 'bg-green-50 text-green-600',
                            },
                            {
                                icon: Globe,
                                title: 'Free to Generate',
                                description: 'Generate your first QR code absolutely free. Download as PNG instantly, no payment needed.',
                                color: 'bg-purple-50 text-purple-600',
                            },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ==================== STATS ==================== */}
            <section className="py-16 lg:py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '500+', label: 'Businesses Served', icon: Users },
                            { value: '15,000+', label: 'QR Codes Generated', icon: Shield },
                            { value: '4.8x', label: 'Avg. Review Increase', icon: TrendingUp },
                            { value: 'Free', label: 'To Get Started', icon: Globe },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <stat.icon className="w-6 h-6 mb-2 text-white/70" />
                                <p className="text-3xl sm:text-4xl font-extrabold mb-1">{stat.value}</p>
                                <p className="text-sm text-white/80">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== COMPARISON SECTION ==================== */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">The Difference</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            Why Choose ReviewQR?
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-gray-100 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-6 text-sm font-bold text-gray-900 border-b">Feature</th>
                                    <th className="p-6 text-sm font-bold text-gray-400 border-b">Normal QR</th>
                                    <th className="p-6 text-sm font-bold text-primary border-b bg-primary/5">ReviewQR Pro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-6 text-sm font-semibold text-gray-900">1-Tap Review Link</td>
                                    <td className="p-6 text-sm text-gray-400"><Check className="w-5 h-5 text-green-500 inline mr-2" /> Yes</td>
                                    <td className="p-6 text-sm text-gray-900 bg-primary/5"><Check className="w-5 h-5 text-primary inline mr-2" /> Yes</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-semibold text-gray-900">Custom Branding</td>
                                    <td className="p-6 text-sm text-gray-400">❌ No</td>
                                    <td className="p-6 text-sm text-gray-900 bg-primary/5"><Check className="w-5 h-5 text-primary inline mr-2" /> Yes</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-semibold text-gray-900">Print-Ready Standee PDF</td>
                                    <td className="p-6 text-sm text-gray-400">❌ No</td>
                                    <td className="p-6 text-sm text-gray-900 bg-primary/5"><Check className="w-5 h-5 text-primary inline mr-2" /> Yes</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-semibold text-gray-900">Scan Tracking</td>
                                    <td className="p-6 text-sm text-gray-400">❌ No</td>
                                    <td className="p-6 text-sm text-gray-900 bg-primary/5"><Check className="w-5 h-5 text-primary inline mr-2" /> Yes</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-semibold text-gray-900">Logo Integration</td>
                                    <td className="p-6 text-sm text-gray-400">❌ No</td>
                                    <td className="p-6 text-sm text-gray-900 bg-primary/5"><Check className="w-5 h-5 text-primary inline mr-2" /> Yes</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ==================== FAQ SECTION ==================== */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Common Questions</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            Everything You Need to Know
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <Accordion title="How does the Google Review QR code work?">
                            Our tool generates a direct link to your business's "Write a Review" page on Google Maps. We then convert this link into a high-quality QR code that customers can scan with any smartphone camera.
                        </Accordion>
                        <Accordion title="Is the QR code generator really free?">
                            Yes! You can search for your business and generate a basic high-quality QR code for free. We also offer Pro plans that give you access to premium, high-resolution digital standee designs and custom-branded PDF templates.
                        </Accordion>
                        <Accordion title="How can I get more 5-star reviews?">
                            The best way is to make it easy for customers. By placing a physical standee at your billing counter or on restaurant tables, you remind customers to leave a review while they are still at your business.
                        </Accordion>
                        <Accordion title="Do I need any technical skills?">
                            Not at all. If you can search for your business on Google, you can create a QR code. It takes less than 60 seconds from search to download.
                        </Accordion>
                        <Accordion title="Will this help my local SEO ranking?">
                            Absolutely. Google uses the number and quality of reviews as a key ranking factor for local search. More positive reviews usually lead to a higher position in the "Map Pack."
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* ==================== TESTIMONIALS ==================== */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                            Loved by Business Owners
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            See how ReviewQR is helping local businesses worldwide grow their online reputation.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} />
                        ))}
                    </div>
                </div>
            </section>
            {/* ==================== CTA SECTION ==================== */}
            <section className="py-16 lg:py-24 bg-surface">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Ready to Get More Reviews?
                    </h2>
                    <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                        Join 500+ businesses worldwide already using ReviewQR to boost their Google ratings.
                        It's free, fast, and takes less than a minute.
                    </p>
                    <Link
                        href="/generate"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-95 group"
                    >
                        Generate My Free QR Code
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
export default HomePageClient