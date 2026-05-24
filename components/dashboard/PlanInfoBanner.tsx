'use client';

import React from "react";
import { Info, ArrowRight, Zap } from "lucide-react";
import { useRouter } from 'next/navigation';;
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const PlanInfoBanner: React.FC = () => {
    const navigate = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    // Only show if user is on free plan
    // if (user?.plan !== "free") return null;

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8 mb-6">
            <div className="relative overflow-hidden bg-white rounded-3xl border border-emerald-100 shadow-sm group">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-100/50 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -ml-12 -mb-12"></div>

                <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                        <Zap size={22} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center md:justify-start">
                            <h3 className="text-gray-900 font-bold text-base">Maximize Your Reviews</h3>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100 mx-auto sm:mx-0 w-fit">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                Tip for Growth
                            </div>
                        </div>
                        <p className="mt-1 text-gray-500 text-sm leading-relaxed max-w-2xl">
                            If you ever pause your plan, your QR still works — customers are redirected directly to your Google review page Instead Of Your Business Page.
                            <span className="text-gray-900 font-semibold ml-1">Resubscribe anytime to get AI Review Generation & Smart suggestions and Business Page features.</span>
                        </p>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => navigate.push("/pricing")}
                        className="group/btn flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        {user?.planExpiredNotifSent ? "Renew Plan" : "Explore Pro Features"}
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanInfoBanner;
