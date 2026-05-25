'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Globe, Smartphone, Users, TrendingUp, Shield, Star, Check, QrCode, MapPin, Download, BarChart2, Palette, FileText } from 'lucide-react';
import HowItWorksSteps from '@/components/HowItWorksSteps';
import TestimonialCard from '@/components/TestimonialCard';
import { Suspense, useEffect, useRef, useState } from 'react';
import FaqSection from '@/components/FaqSection';
import { TESTIMONIALS } from '@/utils/mockData';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';

// Real-world visuals
import standeeCafe from '@/assets/standee-cafe.jpg';
import standeeCounter from '@/assets/standee-counter.jpg';
import stickerDoor from '@/assets/sticker-door.jpg';

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

/* ─────────────────────────────────────────────
   Stats Section with animated counters
───────────────────────────────────────────── */
const AnimatedStats = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const businesses = useCountUp(500, 1600, visible);
    const qrCodes = useCountUp(15000, 2000, visible);
    const reviewIncrease = useCountUp(480, 1800, visible);

    return (
        <section ref={ref} className="py-20 bg-amber-50 border-y border-amber-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                        { value: businesses, suffix: '+', label: 'Businesses Served', icon: Users },
                        { value: qrCodes, suffix: '+', label: 'QR Codes Generated', icon: QrCode, formatK: true },
                        { value: reviewIncrease, suffix: '%', label: 'Avg. Review Increase', icon: TrendingUp },
                        { value: null, display: 'Free', label: 'To Get Started', icon: Zap },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-1">
                                <stat.icon className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                                {stat.display
                                    ? stat.display
                                    : stat.formatK
                                        ? `${(stat.value! / 1000).toFixed(1)}K${stat.suffix}`
                                        : `${stat.value}${stat.suffix}`
                                }
                            </p>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ─────────────────────────────────────────────
   Pricing Section
───────────────────────────────────────────── */


/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const HomePageClient = () => {
    const OAuthHandler = () => {
        const { isProcessing } = useOAuthCallback();
        if (isProcessing) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Signing you in...</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="overflow-hidden bg-white">
            <Suspense fallback={null}>
                <OAuthHandler />
            </Suspense>

            {/* ══════════════════════════════════════════
                HERO
            ══════════════════════════════════════════ */}
            <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-36 bg-white overflow-hidden">
                {/* Subtle warm mesh background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 rounded-full blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left: Copy */}
                        <div>
                            {/* Trust badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full mb-7 animate-fade-in-up">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                500+ businesses generating reviews right now
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Free Google Review
                                <br />
                                <span className="text-amber-500">QR Code Generator</span>
                            </h1>

                            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
                                More Google Reviews. More Customers.
                            </p>

                            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                                Generate a print-ready Google review QR code in 60 seconds. Place a standee at your counter — customers scan and leave 5-star reviews instantly.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <Link
                                    href="/generate"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-amber-500 hover:bg-amber-600 text-white text-base font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-200 active:scale-95 group"
                                >
                                    Generate Free QR Code
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-600 text-base font-semibold rounded-xl transition-all duration-200 active:scale-95"
                                >
                                    See How It Works
                                </Link>
                            </div>

                            {/* Social proof row */}
                            <div className="flex flex-wrap items-center gap-5 text-sm animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {['RS', 'PK', 'AV', 'SG'].map((initials, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                                                {initials}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-gray-500">500+ businesses trust us</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                    <span className="text-gray-500 ml-1">4.9/5 rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: App mockup */}
                        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            {/* Floating badge */}
                            <div className="absolute -top-4 -left-4 z-10 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3">
                                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5 text-green-600 fill-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">New review</p>
                                    <p className="text-sm font-bold text-gray-900">★★★★★ Just now</p>
                                </div>
                            </div>

                            {/* Main card */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                                    <div className="w-3 h-3 rounded-full bg-red-300" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-300" />
                                    <div className="w-3 h-3 rounded-full bg-green-300" />
                                    <div className="flex-1 mx-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                                        <span className="text-xs text-gray-400">getreviewqr.com/generate</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                                    {/* QR visual */}
                                    <div className="w-28 h-28 bg-white rounded-xl border-2 border-amber-200 flex items-center justify-center p-3 shadow-sm flex-shrink-0">
                                        <div className="grid grid-cols-5 gap-[3px] w-full h-full">
                                            {Array.from({ length: 25 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-[2px] ${[0, 1, 2, 4, 5, 6, 9, 10, 12, 14, 15, 18, 19, 20, 22, 23, 24].includes(i)
                                                        ? 'bg-gray-900'
                                                        : 'bg-gray-100'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-center sm:text-left flex-1">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium mb-2">
                                            <MapPin className="w-3 h-3" />
                                            Verified on Google Maps
                                        </div>
                                        <p className="text-base font-bold text-gray-900">Sharma Medical Store</p>
                                        <p className="text-xs text-gray-400 mb-2">MG Road, Rewa, MP</p>
                                        <div className="flex items-center gap-1 justify-center sm:justify-start mb-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            ))}
                                            <Star className="w-3.5 h-3.5 text-gray-200 fill-gray-200" />
                                            <span className="text-xs text-gray-400 ml-1">4.2 · 47 reviews</span>
                                        </div>
                                        <div className="flex gap-2 justify-center sm:justify-start">
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg">
                                                <Download className="w-3 h-3" /> PNG
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg">
                                                <FileText className="w-3 h-3" /> PDF Standee
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating scan count */}
                            <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3">
                                <p className="text-xs text-gray-400 mb-0.5">This week</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                    <BarChart2 className="w-4 h-4 text-amber-500" />
                                    248 scans → 31 reviews
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                LOGO / PARTNER TRUST BAR
            ══════════════════════════════════════════ */}
            <section className="py-8 border-y border-gray-100 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">Trusted by businesses in India, UAE, UK, USA & more</p>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-gray-300 text-sm font-semibold">
                        {['Restaurants', 'Medical Stores', 'Salons & Spas', 'Coaching Institutes', 'Hotels', 'Retail Shops'].map((cat, i) => (
                            <span key={i} className="text-gray-400 text-sm">{cat}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                HOW TO DISPLAY
            ══════════════════════════════════════════ */}
            <section className="py-20 lg:py-28 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">How to Display</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                            Download. Print. Get Reviews.
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            We give you high-res digital designs. Print on anything — paper, acrylic, vinyl.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[
                            { img: standeeCafe, alt: 'Google Review Standee on Cafe Table', label: 'Cafes & Restaurants', title: 'Table Standees', desc: 'Place in a 4×6 inch acrylic stand on tables. Customers scan while they wait — effortless reviews.' },
                            { img: standeeCounter, alt: 'Google Review Standee on Billing Counter', label: 'Billing Counters', title: 'Counter Display', desc: 'Place at checkout. Customers scan right after paying — the highest-intent moment for a review.' },
                            { img: stickerDoor, alt: 'Google Review Sticker on Glass Door', label: 'Shops & Clinics', title: 'Window Stickers', desc: 'Print as a vinyl sticker for your door or window. Showcases your rating before customers even enter.' },
                        ].map((item, i) => (
                            <div key={i} className="group">
                                <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/5] bg-gray-100">
                                    <img
                                        src={item.img.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/60">
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                HOW IT WORKS + VIDEO
            ══════════════════════════════════════════ */}
            <section className="py-20 lg:py-28 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Simple Process</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Get your QR code in 3 steps. No sign-up required for the basic version.</p>
                    </div>

                    <HowItWorksSteps />

                    {/* Video embed */}
                    {/* <div className="mt-14 max-w-3xl mx-auto">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                src="https://www.loom.com/embed/51d5520b7c3a40b3ac4c134baba177f6?hideEmbedTopBar=true"
                                title="ReviewQR demo video"
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-3">Watch how ReviewQR works in under 2 minutes</p>
                    </div> */}
                </div>
            </section>

            {/* ══════════════════════════════════════════
                ANIMATED STATS
            ══════════════════════════════════════════ */}
            <AnimatedStats />

            {/* ══════════════════════════════════════════
                BENEFITS
            ══════════════════════════════════════════ */}
            <section className="py-10 lg:py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Why ReviewQR</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Built for Local Businesses Worldwide</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Medical store, restaurant, salon, coaching centre — if you're on Google Maps, ReviewQR works for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: Zap, title: 'No Tech Skills Needed', desc: 'Search, select, download. Done in under 60 seconds.', bg: 'bg-amber-50', icon_color: 'text-amber-600' },
                            { icon: Globe, title: 'Any Business, Any Country', desc: 'From chai stalls to hospitals — if you\'re on Google Maps, it works.', bg: 'bg-blue-50', icon_color: 'text-blue-600' },
                            { icon: Smartphone, title: 'Scan & Review in 1 Tap', desc: 'Customers go straight to the review form. Zero friction.', bg: 'bg-green-50', icon_color: 'text-green-600' },
                            { icon: Download, title: 'Free to Generate', desc: 'Your first QR code is absolutely free. No card required.', bg: 'bg-purple-50', icon_color: 'text-purple-600' },
                        ].map((b, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300 group cursor-default">
                                <div className={`w-11 h-11 ${b.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <b.icon className={`w-5 h-5 ${b.icon_color}`} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{b.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                COMPARISON TABLE
            ══════════════════════════════════════════ */}
            <section className="py-10 lg:py-10 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">The Difference</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Why Choose ReviewQR?</h2>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 bg-gray-50 border-b border-gray-100 w-1/2">Feature</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-400 bg-gray-50 border-b border-gray-100 text-center">Generic QR</th>
                                    <th className="px-6 py-4 text-sm font-bold text-amber-600 bg-amber-50 border-b border-amber-100 text-center">ReviewQR Pro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: '1-Tap Google Review Link', generic: true, pro: true },
                                    { feature: 'Print-Ready PDF Standee', generic: false, pro: true },
                                    { feature: 'Custom Logo & Branding', generic: false, pro: true },
                                    { feature: 'Scan & Review Analytics', generic: false, pro: true },
                                    { feature: 'Multiple Design Templates', generic: false, pro: true },
                                    { feature: 'Multi-location Support', generic: false, pro: true },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.feature}</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.generic
                                                ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                                                : <span className="text-gray-200 font-bold">—</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center bg-amber-50/50">
                                            <Check className="w-4 h-4 text-amber-500 mx-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                PRICING
     

            {/* ══════════════════════════════════════════
                TESTIMONIALS
            ══════════════════════════════════════════ */}
            <section className=" py-10 lg:py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Loved by Business Owners</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">See how ReviewQR is helping businesses worldwide grow their online reputation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} />
                        ))}
                    </div>
                </div>
            </section>

            <FaqSection />

            {/* ══════════════════════════════════════════
                FINAL CTA
            ══════════════════════════════════════════ */}
            <section className="py-10 lg:py-10 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl px-8 py-14">
                        <div className="flex justify-center mb-5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                            Ready to Get More Reviews?
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                            Join 500+ businesses already using ReviewQR. Free to start. Takes less than a minute.
                        </p>
                        <Link
                            href="/generate"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-base font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-200 active:scale-95 group"
                        >
                            Generate My Free QR Code
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-xs text-gray-400 mt-4">No credit card required · Free forever plan available</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePageClient;