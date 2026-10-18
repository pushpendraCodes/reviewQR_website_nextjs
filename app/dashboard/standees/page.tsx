'use client';

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import { QrCode, Plus, Search, Download, Pencil, Trash2, Loader2, Link, Nfc, Users, AlertTriangle } from "lucide-react";
import TapScanSetup from '@/components/TapScanSetup';
import toast from 'react-hot-toast';
import { useListQRCodesQuery, useDeleteQRCodeMutation, useUpdateQRCodeMutation } from '@/store/api/qrApi';
import { useGetTeamQuery } from '@/store/api/teamApi';
import { useAppSelector } from '@/store/hooks';
import { usePlan, getScanLink, reviewUrlFromQr } from '@/hooks/Useplan';

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

const StandeesPageInner: React.FC = () => {
    const [search, setSearch] = useState("");
    const [nfcQR, setNfcQR] = useState<any>(null);
    const navigate = useRouter();
    const searchParams = useSearchParams();

    const user = useAppSelector((state) => state.auth.user);
    const isAgency = user?.plan === 'agency';
    const isStaff = user?.team?.role === 'staff';
    const isAgencyOwner = isAgency && !isStaff;
    const { isPaidActive } = usePlan();

    const member = isAgencyOwner ? searchParams.get('member') || '' : '';
    const setMember = (value: string) =>
        navigate.replace(value ? `/dashboard/standees?member=${value}` : '/dashboard/standees');

    const { data: team } = useGetTeamQuery(undefined, { skip: !isAgencyOwner });
    const members = team?.role === 'owner' ? team.members : [];
    const showCreator = isAgencyOwner && members.length > 0;

    const { data: qrData, isLoading, refetch } = useListQRCodesQuery(member ? { member } : undefined);
    const [deleteQR] = useDeleteQRCodeMutation();
    const [updateQR] = useUpdateQRCodeMutation();

    const creatorLabel = (qr: { createdBy?: { _id: string; name: string } | null }) =>
        !qr.createdBy || qr.createdBy._id === (user?._id || user?.id) ? 'You' : qr.createdBy.name;

    const allStandees = qrData?.qrCodes || [];
    const pausedCount = allStandees.filter((q) => q.planPaused).length;
    const grace = !isStaff ? user?.planGrace : null;
    const willPause = grace ? Math.max(0, (qrData?.total ?? allStandees.length) - grace.freeQrLimit) : 0;
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

    const handleToggle = async (qr: any) => {
        try {
            const newIsActive = qr.isActive === false ? true : false;
            await updateQR({ id: qr.id, data: { isActive: newIsActive } });
        } catch (error) {
            console.error("Failed to update QR status", error);
        }
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
                        <p className="text-gray-400 text-sm mt-0.5">
                            {isStaff
                                ? `QR codes you've created for your clients · ${user?.team?.role === 'staff' ? user.team.owner?.businessName || user.team.owner?.name || 'agency' : ''} team`
                                : showCreator
                                    ? "Every QR in your agency, including your team's"
                                    : 'Manage and download your live QR code standees'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate.push("/google-review-qr-code-generator")}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1A6B45] text-white text-sm font-medium rounded-lg hover:bg-[#165a3a] transition-colors shadow-sm shrink-0"
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">New standee</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>

                {pausedCount > 0 ? (
                    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-start gap-2">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>
                                <span className="font-semibold">{pausedCount} QR code{pausedCount === 1 ? " is" : "s are"} paused because your plan expired.</span>{" "}
                                Customers scanning {pausedCount === 1 ? "it" : "them"} see a &quot;temporarily unavailable&quot; page. Renew to bring every QR back instantly.
                            </span>
                        </p>
                        <button onClick={() => navigate.push("/pricing")} className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
                            Renew plan
                        </button>
                    </div>
                ) : grace && willPause > 0 ? (
                    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-start gap-2">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>
                                <span className="font-semibold">Your plan has expired.</span> The Free plan includes {grace.freeQrLimit} QR code, so{" "}
                                {willPause} QR code{willPause === 1 ? "" : "s"} will stop working on{" "}
                                <span className="font-semibold">{new Date(grace.pauseOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>{" "}
                                unless you renew. Your most-scanned QR keeps working.
                            </span>
                        </p>
                        <button onClick={() => navigate.push("/pricing")} className="shrink-0 rounded-lg bg-[#1A6B45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#165a3a]">
                            Renew plan
                        </button>
                    </div>
                ) : null}

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
                    {showCreator && (
                        <div className="relative">
                            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <select
                                value={member}
                                onChange={(e) => setMember(e.target.value)}
                                className="appearance-none pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45]"
                            >
                                <option value="">Whole team</option>
                                <option value="me">Created by me</option>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <span className="text-sm text-gray-400 shrink-0">{filtered.length} active standees</span>
                </div>

                {/* Desktop table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Standee</th>
                                    {showCreator && (
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created by</th>
                                    )}
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Scan link</th>
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
                                        {showCreator && (
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${creatorLabel(qr) === 'You' ? 'bg-gray-100 text-gray-600' : 'bg-[#E8F5EE] text-[#1A6B45]'}`}>
                                                    {creatorLabel(qr)}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-5 py-3.5">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const url = getScanLink(isPaidActive, qr.shortURL, reviewUrlFromQr(qr));
                                                    if (url) {
                                                        await navigator.clipboard.writeText(url);
                                                        toast.success('Scan link copied');
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700"
                                                title="Copy tap + scan URL"
                                            >
                                                <Link size={12} />
                                                <span className="text-xs font-mono">{qr.shortCode}</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-gray-700">{qr.scanCount.toLocaleString()}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(qr.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3.5 flex items-center gap-2">
                                            <button 
                                                onClick={() => handleToggle(qr)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${qr.isActive !== false ? 'bg-[#1A6B45]' : 'bg-gray-200'}`}
                                                title={qr.isActive !== false ? "Disable QR Code" : "Enable QR Code"}
                                            >
                                                <span className="sr-only">Toggle QR</span>
                                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${qr.isActive !== false ? 'translate-x-2' : '-translate-x-2'}`} />
                                            </button>
                                            {qr.planPaused ? (
                                                <span className="flex items-center gap-1 text-xs text-red-600 font-medium" title="Paused because your plan expired. Renew to restore it.">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Paused · plan expired
                                                </span>
                                            ) : qr.isActive !== false ? (
                                                <span className="flex items-center gap-1 text-xs text-[#1A6B45] font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => setNfcQR(qr)}
                                                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-[#1A6B45] transition-colors"
                                                    title="Tap + Scan (NFC)"
                                                >
                                                    <Nfc size={14} />
                                                </button>
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
            
            {nfcQR && getScanLink(isPaidActive, nfcQR.shortURL, reviewUrlFromQr(nfcQR)) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setNfcQR(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900">{nfcQR.businessName}</h2>
                            <button type="button" onClick={() => setNfcQR(null)} className="text-sm text-gray-400 hover:text-gray-700">Close</button>
                        </div>
                        <TapScanSetup tapUrl={nfcQR.shortURL || reviewUrlFromQr(nfcQR)} />
                    </div>
                </div>
            )}
        </>
    );
};

const StandeesPage: React.FC = () => (
    <Suspense fallback={null}>
        <StandeesPageInner />
    </Suspense>
);

export default StandeesPage;
