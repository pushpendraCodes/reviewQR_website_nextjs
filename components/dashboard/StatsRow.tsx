'use client';

import React from "react";
import StatsCard from "./StatsCard";
import { Eye, Star, MessageSquare, Layers } from "lucide-react";
import { useGetSummaryQuery } from "../../store/api/analyticsApi";

const StatsRow: React.FC = () => {
    const { data: analytics } = useGetSummaryQuery({ range: "30d" });

    const totalScans = analytics?.totalScans || 0;
    const avgRating = (analytics?.qrCodes.reduce((acc, curr) => acc + curr.currentRating, 0) || 0) / (analytics?.qrCodes.length || 1);
    const totalReviews = analytics?.qrCodes.reduce((acc, curr) => acc + curr.totalReviews, 0) || 0;
    const activeQRs = analytics?.totalQRCodes || 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard
                icon={<Eye size={13} />}
                label="Total QR scans"
                value={totalScans.toLocaleString()}
                trend="Last 30 days"
                trendUp={true}

                trendColor="green"
            />
            <StatsCard
                icon={<Star size={13} />}
                label="Avg Google rating"
                value={avgRating.toFixed(1)}
                trend="Across all locations"
                trendUp={true}
                trendColor="green"
            />
            <StatsCard
                icon={<MessageSquare size={13} />}
                label="Total Reviews"
                value={totalReviews.toLocaleString()}
                subValue={`${totalScans > 0 ? Math.round((totalReviews / totalScans) * 100) : 0}% conversion`}
                trend="Live from Google"
                trendUp={true}
                trendColor="green"
            />
            <StatsCard
                icon={<Layers size={13} />}
                label="Active Business QRs"
                value={activeQRs.toString()}
                trend="Managed in dashboard"
                trendUp={true}
                trendColor="green"
            />
        </div>
    );
};


export default StatsRow;