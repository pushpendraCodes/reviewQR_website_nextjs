'use client';

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    trend?: string;
    trendUp?: boolean;
    trendColor?: "green" | "orange" | "red";
}

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    label,
    value,
    subValue,
    trend,
    trendUp = true,
    trendColor = "green",
}) => {
    const trendColors = {
        green: "text-[#1A6B45]",
        orange: "text-orange-500",
        red: "text-red-500",
    };

    return (
        <div className="bg-white rounded-xl px-4 sm:px-5 py-4 shadow-sm border border-gray-100 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                <span className="text-gray-400">{icon}</span>
                <span className="truncate">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
                    {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
                </div>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColors[trendColor]}`}>
                    {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="leading-tight">{trend}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;