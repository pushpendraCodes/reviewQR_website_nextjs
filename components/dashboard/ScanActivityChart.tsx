'use client';

import React from "react";
import { useGetSummaryQuery } from "../../store/api/analyticsApi";
import Link from 'next/link';;

const ScanActivityChart: React.FC = () => {
    const { data: analytics, isLoading } = useGetSummaryQuery({ range: "30d" });

    if (isLoading) return <div className="h-[130px] bg-gray-50 animate-pulse rounded-xl" />;

    const data = analytics?.dailyScanData || [];
    const maxVal = Math.max(...(data.map((d) => d.count) || [1]));

    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-sm font-semibold text-gray-700">
                    Scan activity
                    <span className="hidden sm:inline"> — last 30 days</span>
                </h2>
                <Link href="/dashboard/analytics" className="text-xs text-[#1A6B45] font-medium hover:underline whitespace-nowrap ml-2">
                    View detailed analytics
                </Link>
            </div>
            <div className="flex items-end gap-1.5 sm:gap-2 h-[110px] sm:h-[130px]">
                {data.map((d, i) => {
                    const heightPct = (d.count / (maxVal || 1)) * 100;
                    const isLast = i === data.length - 1;
                    return (
                        <div key={d._id} className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1 min-w-0 group relative">
                            <div className="w-full flex items-end" style={{ height: "90px" }}>
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 ${isLast ? "bg-[#1A6B45]" : "bg-[#B8DEC9] hover:bg-[#97cfb0]"
                                        }`}
                                    style={{ height: `${Math.max(heightPct, 3)}%` }}
                                />
                            </div>
                            {/* Simple tooltip */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                                {d.count} scans
                            </div>
                            <span className="hidden sm:inline text-[9px] text-gray-400">
                                {i % 5 === 0 ? d._id.split('-')[2] : ""}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default ScanActivityChart;