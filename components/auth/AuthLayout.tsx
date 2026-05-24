'use client';

import React from "react";
import { QrCode, Star, Shield, Zap, TrendingUp } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  { icon: <QrCode className="w-4 h-4" />, title: "Instant QR Generation", desc: "Create branded QR codes in seconds" },
  { icon: <Star className="w-4 h-4" />, title: "Boost Your Ratings", desc: "Make it effortless for 5-star reviews" },
  { icon: <Shield className="w-4 h-4" />, title: "Secure & Reliable", desc: "Enterprise-grade security" },
  { icon: <Zap className="w-4 h-4" />, title: "Real-time Analytics", desc: "Track scans and engagement live" },
];

const stats = [
  { value: "10K+", label: "Businesses" },
  { value: "2.4M+", label: "QR Scans" },
  { value: "4.9★", label: "Avg Rating" },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex bg-white overflow-hidden"> {/* ← fixed */}

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10 bg-primary-dark text-white">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-900/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: "28px 28px" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/30">
              <img src="/favicon.svg" alt="Logo" className="w-9 h-9" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Review<span className="text-violet-200">QR</span>
            </span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5">
              <TrendingUp className="w-3 h-3 text-violet-200" />
              <span className="text-white/90 text-xs font-medium tracking-wide">
                Trusted by 10,000+ businesses worldwide
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-[1.15]">
              Turn customers into{" "}
              <span className="text-violet-200 italic">raving fans</span>
            </h1>
            <p className="text-violet-100/80 text-sm leading-relaxed max-w-sm">
              Generate smart QR codes that direct customers straight to your Google review page.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-violet-200/70 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Features — 2 column grid to save vertical space */}
          <div className="grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{f.title}</p>
                  <p className="text-violet-100/65 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 p-3.5 bg-white/10 rounded-2xl border border-white/15">
            <div className="flex -space-x-2.5">
              {["🧑‍💼", "👩‍💼", "👨‍💻", "👩‍💻"].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 border-2 border-white/30 flex items-center justify-center text-xs shadow-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                ))}
                <span className="text-white font-semibold text-xs ml-1">4.9 / 5</span>
              </div>
              <p className="text-violet-100/70 text-xs">From 2,400+ verified customer reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — scrollable internally */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 lg:p-10 bg-gray-50 relative overflow-y-auto"> {/* ← overflow-y-auto */}
        <div className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: `radial-gradient(circle at 80% 20%, #ede9fe 0%, transparent 50%), radial-gradient(circle at 20% 80%, #e0e7ff 0%, transparent 50%)` }}
        />
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">
              ReviewQR<span className="text-violet-500">.</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;