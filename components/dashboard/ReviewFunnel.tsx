'use client';

import React from "react";
import { useGetSummaryQuery } from "../../store/api/analyticsApi";

const ReviewFunnel: React.FC = () => {
    const { data: analytics } = useGetSummaryQuery({ range: "30d" });

    const totalScans = analytics?.totalScans || 0;
    const totalReviews = analytics?.qrCodes.reduce((acc, curr) => acc + curr.totalReviews, 0) || 0;
    
    // For the funnel, we'll estimate "Opened Google" as 100% of scans (since it's a direct redirect)
    // and "Left a review" as total reviews (which is a snapshot). 
    // In a mature system, we'd use the growth over the period.
    const conversionRate = totalScans > 0 ? Math.round((totalReviews / totalScans) * 100) : 0;

    const steps = [
        { label: "Scanned QR", count: totalScans, pct: 100, color: "bg-[#1A6B45]" },
        { label: "Opened Google", count: totalScans, pct: 100, color: "bg-[#5AAF8A]" },
        { label: "Reviews on G", count: totalReviews, pct: Math.min(conversionRate, 100), color: "bg-[#A8D8BC]" },
    ];

    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Review funnel</h2>
                <button className="text-xs text-[#1A6B45] font-medium hover:underline whitespace-nowrap ml-2">
                    How it works
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {steps.map((step) => (
                    <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm text-gray-600 w-[90px] sm:w-[110px] shrink-0 leading-tight">
                            {step.label}
                        </span>
                        <div className="flex-1 h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${step.color} transition-all duration-700`}
                                style={{ width: `${step.pct}%` }}
                            />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 w-10 sm:w-12 text-right tabular-nums">
                            {step.count.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 w-7 sm:w-8 text-right">{step.pct}%</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 bg-[#E8F5EE] rounded-lg px-3 py-2">
                <p className="text-xs text-[#1A6B45] font-medium">
                    {conversionRate > 20 
                        ? "Great! Your conversion rate is above industry average." 
                        : "Tip: Ask users personally after service to increase scans."}
                </p>
            </div>
        </div>
    );
};


export default ReviewFunnel;