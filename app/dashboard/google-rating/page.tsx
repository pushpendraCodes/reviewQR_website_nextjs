'use client';

import React from "react";

import { Star, TrendingUp, ExternalLink } from "lucide-react";
import { useGetSummaryQuery } from '@/store/api/analyticsApi';

const StarRow: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
        ))}
    </div>
);

import PlanGate from '@/components/dashboard/PlanGate';
;

const GoogleRatingPage: React.FC = () => {
    const { data: analytics, isLoading } = useGetSummaryQuery({ range: "30d" });

    if (isLoading) {
        return (
            <>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A6B45]"></div>
                </div>
            </>
        );
    }

    const totalReviews = analytics?.qrCodes.reduce((acc, curr) => acc + curr.totalReviews, 0) || 0;
    const avgRatingRaw = (analytics?.qrCodes.reduce((acc, curr) => acc + (curr.currentRating * curr.totalReviews), 0) || 0) / (totalReviews || 1);
    const avgRating = parseFloat(avgRatingRaw.toFixed(1));

    const recentReviews = analytics?.qrCodes
        .flatMap(qr => qr.latestReviews.map(r => ({ ...r, businessName: qr.businessName })))
        .sort((a, b) => b.time - a.time) || [];

    // Monthly trends from API
    const ratingHistory = analytics?.trends.slice(-7).map(t => ({
        month: t.date.split("-")[2], // Use day for now as trend is daily
        rating: t.rating
    })) || [];

    const maxBar = Math.max(...(ratingHistory.map((r) => r.rating) || [5]));

    return (
        <>
            <PlanGate requiredPlan="pro" featureName="Google Rating Monitor">
                <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8 mt-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800">Google Rating</h1>
                            <p className="text-gray-400 text-sm mt-0.5">Live monitoring of your business reputation</p>
                        </div>
                        {/* <Link to="/dashboard/analytics" className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto">
                            <ExternalLink size={14} />
                            View on Google
                        </Link> */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                        {/* Left column: rating summary */}
                        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-5">
                            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-5 sm:block sm:text-center">
                                    <p className="text-5xl sm:text-6xl font-black text-gray-800">{avgRating || "0.0"}</p>
                                    <div>
                                        <div className="flex gap-0.5 my-2 sm:my-3 sm:justify-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={20} className={i < Math.floor(avgRating) ? "text-amber-400 fill-amber-400" : "text-amber-100 fill-amber-100"} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-400">Weighted average of {totalReviews} reviews</p>
                                        <div className="mt-3 inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A6B45] text-xs font-medium px-3 py-1 rounded-full">
                                            <TrendingUp size={11} />
                                            Live from Google API
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent reviews feed */}
                            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 h-full">
                                <h2 className="text-sm font-semibold text-gray-700 mb-4">Latest Feedback</h2>
                                <div className="flex flex-col divide-y divide-gray-50 max-h-[400px] overflow-y-auto pr-2">
                                    {recentReviews.length === 0 ? (
                                        <p className="text-xs text-gray-400 py-4 text-center">No reviews found yet.</p>
                                    ) : (
                                        recentReviews.map((r, i) => (
                                            <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                                                <div className="flex items-center justify-between mb-1 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-[#E8F5EE] flex items-center justify-center text-xs font-bold text-[#1A6B45] shrink-0">
                                                            {r.authorName[0]}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{r.authorName}</span>
                                                    </div>
                                                </div>
                                                <StarRow count={r.rating} />
                                                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed italic">"{r.text}"</p>
                                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-semibold">@ {r.businessName}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column: trends */}
                        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
                            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-5">Rating Trend (Daily Snapshots)</h2>
                                <div className="flex items-end gap-2 sm:gap-5 h-[140px] sm:h-[180px]">
                                    {ratingHistory.length === 0 ? (
                                        <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg py-10">
                                            <p className="text-xs text-gray-400">Trend data will appear as daily snapshots are recorded.</p>
                                        </div>
                                    ) : (
                                        ratingHistory.map((r, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1 group relative">
                                                <div className="w-full flex items-end" style={{ height: "100px" }}>
                                                    <div
                                                        className={`w-full rounded-t-md transition-all ${i === ratingHistory.length - 1 ? "bg-[#1A6B45]" : "bg-[#B8DEC9]"}`}
                                                        style={{ height: `${((r.rating) / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                    {r.rating} stars
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400">{r.month}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PlanGate>
        </>
    );
};

export default GoogleRatingPage;
