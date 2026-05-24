'use client';

import React from "react";
import { Download, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';;
import type { RootState } from "../../store/store";
import { useListQRCodesQuery } from "../../store/api/qrApi";
import toast from "react-hot-toast";

const DashboardHeader: React.FC = () => {
    const navigate = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const userName = user?.name?.split(" ")[0] || "User";
    const { data: qrData } = useListQRCodesQuery();

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    const handleExport = () => {
        const standees = qrData?.qrCodes;
        if (!standees || standees.length === 0) {
            toast.error("No QR standees to export");
            return;
        }

        // Build CSV
        const headers = ["Business Name", "Place Address", "Short Code", "Short URL", "Total Scans", "Rating", "Total Reviews", "Template", "Created At"];
        const rows = standees.map((qr) => [
            `"${qr.businessName.replace(/"/g, '""')}"`,
            `"${(qr.placeAddress || "").replace(/"/g, '""')}"`,
            qr.shortCode,
            qr.shortURL,
            qr.scanCount,
            qr.placeRating,
            qr.totalReviews,
            qr.standeeConfig?.template || "minimal",
            new Date(qr.createdAt).toLocaleDateString(),
        ]);

        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ReviewQR_Export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("QR data exported successfully!");
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between px-4 sm:px-8 pt-16 md:pt-7 pb-5">
            {/* Greeting */}
            <div>
                <h1 className="text-[20px] sm:text-[22px] font-semibold text-gray-800">
                    {greeting}, {userName}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Here's how your reviews are growing this month
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 sm:mt-1">
                <button
                    onClick={handleExport}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Download size={15} />
                    <span className="sm:inline">Export</span>
                </button>
                <button
                    onClick={() => navigate.push("/generate")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#1A6B45] text-white text-sm font-medium hover:bg-[#165a3a] transition-colors shadow-sm"
                >
                    <Plus size={15} />
                    New standee
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
