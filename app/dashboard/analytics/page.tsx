'use client';

import React, { useState } from "react";

import { TrendingUp, QrCode, Star, Users, MapPin, Tablet } from "lucide-react";
import { useGetSummaryQuery } from '@/store/api/analyticsApi';

type Range = "7d" | "30d" | "90d";

import PlanGate from '@/components/dashboard/PlanGate';

const AnalyticsPage: React.FC = () => {
    const [range, setRange] = useState<Range>("30d");
    const { data: analytics, isLoading } = useGetSummaryQuery({ range });

    if (isLoading) {
        return (
            <>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A6B45]"></div>
                </div>
            </>
        );
    }

    const summaryData = [
        { label: "Total scans", value: analytics?.totalScans.toLocaleString() || "0", icon: <QrCode size={16} />, color: "text-blue-500" },
        { label: "Reviews Count", value: analytics?.qrCodes.reduce((acc, curr) => acc + curr.totalReviews, 0).toLocaleString() || "0", icon: <Star size={16} />, color: "text-amber-500" },
        { label: "Avg. Rating", value: (analytics?.qrCodes.reduce((acc, curr) => acc + curr.currentRating, 0) || 0 / (analytics?.qrCodes.length || 1)).toFixed(1), icon: <Star size={16} />, color: "text-green-500" },
        { label: "Total QRs", value: analytics?.totalQRCodes || "0", icon: <Users size={16} />, color: "text-purple-500" },
    ];

    const maxScans = Math.max(...(analytics?.dailyScanData.map((d) => d.count) || [1]));

    return (
        <>
            <PlanGate requiredPlan="pro" featureName="Advanced Analytics">
                <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8 mt-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800">Analytics</h1>
                            <p className="text-gray-400 text-sm mt-0.5">Comprehensive performance tracking and breakdowns</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm self-start sm:self-auto">
                            {(["7d", "30d", "90d"] as Range[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r ? "bg-[#1A6B45] text-white" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                        {summaryData.map((card) => (
                            <div key={card.label} className="bg-white rounded-xl px-4 sm:px-5 py-4 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={card.color}>{card.icon}</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Scans Chart */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 mb-4 sm:mb-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-5">QR Scans Trend</h2>
                        <div className="flex items-end gap-1.5 sm:gap-2 h-[140px] sm:h-[160px]">
                            {analytics?.dailyScanData.map((d, i) => (
                                <div key={d._id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                    <div
                                        className="w-full rounded-t-md bg-[#1A6B45] opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ height: `${(d.count / maxScans) * 100}%`, minHeight: '2px' }}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                                        {d.count} scans
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            {analytics?.dailyScanData.filter((_, i) => i % (range === "30d" ? 5 : 1) === 0).map((d) => (
                                <span key={d._id} className="text-[9px] text-gray-400 flex-1 text-center">{d._id.split('-').slice(1).join('/')}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        {/* Geographical Breakdown */}
                        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={16} className="text-red-500" />
                                <h2 className="text-sm font-semibold text-gray-700">Top Locations</h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {analytics?.geography.length === 0 ? (
                                    <p className="text-xs text-gray-400 py-4 text-center">No location data yet</p>
                                ) : (
                                    analytics?.geography.map((g) => (
                                        <div key={g.city} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{g.city}</span>
                                            <div className="flex items-center gap-2 flex-1 max-w-[150px] mx-4">
                                                <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#1A6B45]"
                                                        style={{ width: `${(g.count / analytics.totalScans) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{g.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Device Breakdown */}
                        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Tablet size={16} className="text-blue-500" />
                                <h2 className="text-sm font-semibold text-gray-700">Device Distribution</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {analytics?.devices.map((d) => (
                                    <div key={d.type} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{d.type}</span>
                                        <div className="flex items-center gap-2 flex-1 max-w-[150px] mx-4">
                                            <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${(d.count / analytics.totalScans) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{d.count} scans</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rating Trends and Recent Reviews */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Rating & Review Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-400 mb-3 uppercase font-medium tracking-wider">Rating Trends</p>
                                {analytics?.trends && analytics.trends.length > 0 ? (
                                    <div className="flex items-end gap-1 h-[100px]">
                                        {analytics.trends.map((t, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-amber-400 rounded-t-sm"
                                                style={{ height: `${(t.rating / 5) * 100}%` }}
                                                title={`${t.date}: ${t.rating} stars`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 py-10 text-center bg-gray-50 rounded-lg">Trend data will appear as daily snapshots are recorded.</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-xs text-gray-400 mb-1 uppercase font-medium tracking-wider">Top Performing QR</p>
                                {analytics?.qrCodes.slice(0, 3).map((qr, idx) => (
                                    <div key={qr.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-bold text-gray-300">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{qr.businessName}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                    <Star size={10} fill="currentColor" />
                                                    <span className="text-[10px] font-bold">{qr.currentRating}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400">{qr.totalReviews} reviews</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-[#1A6B45]">{qr.totalScanCount}</p>
                                            <p className="text-[9px] text-gray-400">scans</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PlanGate>
        </>
    );
};

export default AnalyticsPage;


// export default AnalyticsPage;