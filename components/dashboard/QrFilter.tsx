'use client';

import React from "react";
import { QrCode } from "lucide-react";
import type { AnalyticsSummaryResponse } from "@/store/api/analyticsApi";

/** Picks "All QR codes" (empty string) or a single QR. Hidden when there's nothing to choose between. */
const QrFilter: React.FC<{
    options: AnalyticsSummaryResponse["qrOptions"] | undefined;
    value: string;
    onChange: (qrId: string) => void;
}> = ({ options, value, onChange }) => {
    if (!options || options.length < 2) return null;

    return (
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white py-1 pl-3 pr-1 shadow-sm">
            <QrCode size={14} className="shrink-0 text-gray-400" />
            <span className="sr-only">Filter by QR code</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="max-w-[220px] cursor-pointer truncate rounded-md bg-transparent py-1 pr-1 text-xs font-medium text-gray-700 focus:outline-none"
            >
                <option value="">All QR codes ({options.length})</option>
                {options.map((q) => (
                    <option key={q.id} value={q.id}>
                        {q.businessName}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default QrFilter;
