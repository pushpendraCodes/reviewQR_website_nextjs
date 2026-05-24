'use client';

import React from "react";
import { Star, RefreshCw } from "lucide-react";
import { useGetSummaryQuery, useSyncAnalyticsMutation } from "../../store/api/analyticsApi";
import toast from "react-hot-toast";

const RecentReviews: React.FC = () => {
    const { data: analytics, isLoading: isDataLoading } = useGetSummaryQuery({ range: "30d" });
    const [sync, { isLoading: isSyncing }] = useSyncAnalyticsMutation();

    const handleSync = async () => {
        try {
            await sync().unwrap();
            toast.success("Reviews synced with Google!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to sync reviews");
        }
    };

    // Collect all latestReviews from all QR codes and sort by time
    const allReviews = analytics?.qrCodes
        .flatMap(qr => qr.latestReviews.map(r => ({ ...r, businessName: qr.businessName })))
        .sort((a, b) => b.time - a.time)
        .slice(0, 5) || [];
    console.log(allReviews, "allReviews")
    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Latest Google Reviews</h2>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1A6B45] transition-colors disabled:opacity-50"
                    title="Sync with Google"
                >
                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {allReviews.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-xs text-gray-400">No reviews fetched yet.</p>
                        <p className="text-[10px] text-gray-300">Run the analytics job to sync from Google.</p>
                    </div>
                ) : (
                    allReviews.map((review, idx) => (
                        <div key={idx} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-800">{review.authorName}</span>
                                <div className="flex items-center gap-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={10}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                            className={i < review.rating ? "text-amber-400" : "text-gray-200"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 italic line-clamp-2">"{review.text}"</p>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">via {review.businessName}</p>
                        </div>
                    ))
                )}
            </div>
            {allReviews.length > 0 && (
                <button className="w-full mt-4 py-2 text-[11px] font-medium text-[#1A6B45] hover:bg-[#F0FBF5] rounded-lg transition-colors border border-[#E8F5EE]">
                    View all reviews
                </button>
            )}
        </div>
    );
};

export default RecentReviews;
