'use client';

import React from "react";
import { useRouter } from 'next/navigation';;
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Plan } from "../../hooks/Useplan";

const PLAN_RANK: Record<Plan, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    agency: 3,
};

interface PlanGateProps {
    requiredPlan: Plan;
    featureName: string;
    children: React.ReactNode;
}

/**
 * Wraps a page that requires a minimum plan.
 * If user has access → renders children normally.
 * If not → renders children blurred behind a glassmorphic upgrade overlay.
 */
const PlanGate: React.FC<PlanGateProps> = ({ requiredPlan, featureName, children }) => {
    const navigate = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const userPlan: Plan = (user?.plan as Plan) || "free";
    const hasAccess = PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];
    const planExpired = !!user?.planExpiredNotifSent;

    if (hasAccess) {
        return <>{children}</>;
    }

    const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

    return (
        <div className="relative min-h-[80vh]">
            {/* Blurred page content — visible enough to tease */}
            <div
                className="pointer-events-none select-none"
                style={{ filter: "blur(3px)", opacity: 0.85 }}
            >
                {children}
            </div>

            {/* Upgrade overlay */}
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
                {/* Glassmorphic card */}
                <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center">
                    {/* Animated icon */}
                    <div className="relative mx-auto mb-5 w-16 h-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] rounded-2xl rotate-6 opacity-20" />
                        <div className="relative w-full h-full bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1A6B45]/25">
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Unlock {featureName}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {featureName} is available on the{" "}
                        <span className="font-semibold text-[#1A6B45]">{planLabel}</span>{" "}
                        plan and above. {planExpired ? "Renew your plan now" : "Upgrade now"} to access detailed insights, analytics, and more.
                    </p>

                    {/* Feature bullets */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                            What you'll get
                        </p>
                        <ul className="space-y-2">
                            {[
                                "Advanced scan analytics & charts",
                                "Live Google rating monitoring",
                                "Geographic & device breakdown",
                                "Rating trends over time",
                                "Export data to CSV",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA buttons */}
                    <button
                        onClick={() => navigate.push("/pricing")}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#1A6B45]/25 transition-all active:scale-[0.98]"
                    >
                        {planExpired ? "Renew Plan" : `Upgrade to ${planLabel}`}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-400 mt-3">
                        Plans start at just ₹299/month
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlanGate;
