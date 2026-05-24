'use client';

import React from "react";

type AlertType = "success" | "warning" | "danger";

interface Alert {
    type: AlertType;
    message: string;
}

const alerts: Alert[] = [
    {
        type: "success",
        message: "Main entrance standee hit 743 scans — your best performer!",
    },
    {
        type: "warning",
        message: "Counter card at Saket was never downloaded. Deploy it to start getting reviews.",
    },
    {
        type: "danger",
        message: "Lajpat Nagar scans dropped 8% this week. Try moving the standee.",
    },
];

const dotColor: Record<AlertType, string> = {
    success: "bg-[#1A6B45]",
    warning: "bg-amber-400",
    danger: "bg-orange-400",
};

const bgColor: Record<AlertType, string> = {
    success: "bg-[#F0FBF5] border-[#C8E8D6]",
    warning: "bg-[#FFFBEB] border-[#FDE68A]",
    danger: "bg-[#FFF7ED] border-[#FED7AA]",
};

const SmartAlerts: React.FC = () => {
    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 h-full">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Smart alerts</h2>
            <div className="flex flex-col gap-3">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-2.5 border rounded-lg px-3 py-2.5 ${bgColor[alert.type]}`}
                    >
                        <span
                            className={`mt-1 w-2 h-2 rounded-full shrink-0 ${dotColor[alert.type]}`}
                        />
                        <p className="text-xs text-gray-600 leading-relaxed">{alert.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartAlerts;