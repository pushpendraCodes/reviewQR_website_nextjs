'use client';

import React from "react";
import { QrCode, Download, Pencil } from "lucide-react";
import { useRouter } from 'next/navigation';
import type { QRCode } from "../../store/api/qrApi";
import { useUpdateQRCodeMutation } from "../../store/api/qrApi";

interface QRStandeeCardProps {
    standee: QRCode;
}

const QRStandeeCard: React.FC<QRStandeeCardProps> = ({ standee }) => {
    const navigate = useRouter();
    const [updateQR] = useUpdateQRCodeMutation();

    const handleToggle = async () => {
        try {
            const newIsActive = standee.isActive === false ? true : false;
            await updateQR({ id: standee.id, data: { isActive: newIsActive } });
        } catch (error) {
            console.error("Failed to update QR status", error);
        }
    };

    const handleAction = () => {
        // Both buttons navigate to the edit page
        navigate.push(`/dashboard/generate/${standee.id}`);
    };

    const formattedDate = new Date(standee.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            {/* Top */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center shrink-0">
                    <QrCode size={20} className="text-[#1A6B45]" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-800 truncate" title={standee.businessName}>{standee.businessName}</p>
                        <button 
                            onClick={handleToggle}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${standee.isActive !== false ? 'bg-[#1A6B45]' : 'bg-gray-200'}`}
                            title={standee.isActive !== false ? "Disable QR Code" : "Enable QR Code"}
                        >
                            <span className="sr-only">Toggle QR</span>
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${standee.isActive !== false ? 'translate-x-2' : '-translate-x-2'}`} />
                        </button>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${standee.isActive !== false ? 'bg-[#2ECC71]' : 'bg-gray-400'}`} />
                        <p className="text-[11px] text-gray-400 truncate">
                            {standee.placeAddress} · {standee.standeeConfig.template}
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-300 mt-0.5">Created {formattedDate}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="text-lg font-bold text-gray-800">
                        {standee.scanCount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">Total scans</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">
                        {standee.totalReviews > 0 && standee.scanCount > 0
                            ? `${Math.round((standee.totalReviews / standee.scanCount) * 100)}%`
                            : "—"}
                    </p>
                    <p className="text-[10px] text-gray-400">Conversion</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">4.8</p>
                    <p className="text-[10px] text-gray-400">Avg Rating</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleAction}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <Pencil size={12} />
                    Customize
                </button>
                <button
                    onClick={handleAction}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-white bg-[#1A6B45] hover:bg-[#165a3a] transition-colors"
                >
                    <Download size={12} />
                    Re-download
                </button>
            </div>
        </div>
    );
};

export default QRStandeeCard;
