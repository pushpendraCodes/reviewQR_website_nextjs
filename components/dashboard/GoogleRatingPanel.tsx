'use client';

import React from "react";
import { Star } from "lucide-react";
import { useGetSummaryQuery } from "../../store/api/analyticsApi";

const GoogleRatingPanel: React.FC = () => {
    const { data: analytics } = useGetSummaryQuery({ range: "30d" });

    const avgRating = (analytics?.qrCodes.reduce((acc, curr) => acc + curr.currentRating, 0) || 0) / (analytics?.qrCodes.length || 1);
    const totalReviews = analytics?.qrCodes.reduce((acc, curr) => acc + curr.totalReviews, 0) || 0;

    const rating = parseFloat(avgRating.toFixed(1));
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 h-full">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Google rating</h2>

            <div className="text-[38px] sm:text-[42px] font-bold text-gray-800 leading-none">{rating || "0.0"}</div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < fullStars;
                    const half = !filled && i === fullStars && hasHalf;
                    return (
                        <Star
                            key={i}
                            size={16}
                            className={
                                filled || half
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200 fill-gray-200"
                            }
                        />
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 mt-2">Based on {totalReviews.toLocaleString()} reviews on Google</p>

            <div className="mt-3 inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A6B45] text-xs font-medium px-2.5 py-1 rounded-full">
                Live dashboard sync
            </div>
        </div>
    );
};


export default GoogleRatingPanel;