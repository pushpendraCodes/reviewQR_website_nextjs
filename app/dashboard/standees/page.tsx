'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import { QrCode, Plus, Search, Download, Pencil, Trash2, Loader2, Link } from "lucide-react";
import { useListQRCodesQuery, useDeleteQRCodeMutation } from '@/store/api/qrApi';
;

const StatusBadge: React.FC<{ status: string }> = ({ status }) =>
    status === "active" ? (
        <span className="flex items-center gap-1 text-xs text-[#1A6B45] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" /> Active
        </span>
    ) : (
        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Pending
        </span>
    );

const StandeesPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const navigate = useRouter();
    const { data: qrData, isLoading, refetch } = useListQRCodesQuery();
    const [deleteQR] = useDeleteQRCodeMutation();

    const allStandees = qrData?.qrCodes || [];
    const filtered = allStandees.filter(
        (s) =>
            s.businessName.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this QR standee?")) {
            await deleteQR(id);
            refetch();
        }
    };

    /** Navigate to the edit page with full preview & customization */
    const handleEditOrDownload = (id: string) => {
        navigate.push(`/dashboard/generate/${id}`);
    };

    if (isLoading) {
        return (
            <>
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="animate-spin text-[#1A6B45]" size={32} />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
                    <div>
                        <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800">My QR Standees</h1>
                        <p className="text-gray-400 text-sm mt-0.5">Manage and download your live QR code standees</p>
                    </div>
                    <button
                        onClick={() => navigate.push("/generate")}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1A6B45] text-white text-sm font-medium rounded-lg hover:bg-[#165a3a] transition-colors shadow-sm shrink-0"
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">New standee</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                {/* Search bar */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search standees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45]"
                        />
                    </div>
                    <span className="text-sm text-gray-400 shrink-0">{filtered.length} active standees</span>
                </div>

                {/* Desktop table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Standee</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Short Link</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total scans</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Sync</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((qr, idx) => (
                                    <tr
                                        key={qr.id}
                                        className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors ${idx === filtered.length - 1 ? "border-0" : ""}`}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] flex items-center justify-center shrink-0">
                                                    <QrCode size={16} className="text-[#1A6B45]" />
                                                </div>
                                                <span className="font-medium text-gray-800">{qr.businessName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 cursor-pointer">
                                                <Link size={12} />
                                                <span className="text-xs font-mono">{qr.shortCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-gray-700">{qr.scanCount.toLocaleString()}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(qr.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status="active" />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEditOrDownload(qr.id)}
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="Edit & Customize"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditOrDownload(qr.id)}
                                                    className="p-1.5 rounded-lg hover:bg-[#E8F5EE] text-gray-400 hover:text-[#1A6B45] transition-colors"
                                                    title="Preview & Re-download"
                                                >
                                                    <Download size={14} />
                                                </button>
                                                {/* <button 
                                                    onClick={() => handleDelete(qr.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <QrCode size={32} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No active standees found</p>
                            <button
                                onClick={() => navigate.push("/dashboard/generate-qr")}
                                className="mt-4 text-sm font-medium text-[#1A6B45] hover:underline"
                            >
                                Generate your first QR code
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StandeesPage;
