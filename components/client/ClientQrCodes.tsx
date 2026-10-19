'use client';

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import QRCodeStyling from "qr-code-styling";
import { Copy, Download, ExternalLink, FileImage, FileText, Loader2, MapPin, QrCode, X } from "lucide-react";
import StandeePreview from "@/components/StandeePreview";
import { useStandeeDownload } from "@/hooks/useStandeeDownload";
import type { ClientQrSummary } from "@/store/api/clientPortalApi";

const DEFAULT_COLOR = "#1D9E75";

const slug = (name: string) => name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

/** Same styling rules as the standee QR, so downloads match what's printed. */
const buildQr = (qr: ClientQrSummary, size: number) => {
    const shape = qr.qrConfig.shape || "square";
    const color = qr.qrConfig.color || DEFAULT_COLOR;
    return new QRCodeStyling({
        width: size,
        height: size,
        data: qr.shortUrl,
        margin: Math.round(size * 0.04),
        dotsOptions: { type: shape, color },
        cornersSquareOptions: { type: shape === "extra-rounded" || shape === "rounded" ? "extra-rounded" : "square", color },
        cornersDotOptions: { type: shape === "dots" ? "dot" : "square", color },
        backgroundOptions: { color: "#ffffff" },
        image: qr.qrConfig.logoUrl || undefined,
        imageOptions: { crossOrigin: "anonymous", margin: 4, hideBackgroundDots: true, imageSize: 0.32 },
        qrOptions: { errorCorrectionLevel: "H" },
    });
};

const QrThumb: React.FC<{ qr: ClientQrSummary }> = ({ qr }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.innerHTML = "";
        buildQr(qr, 132).append(ref.current);
    }, [qr]);
    return <div ref={ref} className="h-[132px] w-[132px] [&>canvas]:h-full [&>canvas]:w-full [&>svg]:h-full [&>svg]:w-full" />;
};

const DownloadDialog: React.FC<{ qr: ClientQrSummary; onClose: () => void }> = ({ qr, onClose }) => {
    const { standeeRef, downloading, downloadPNG, downloadPDF } = useStandeeDownload(qr.businessName);
    const [qrBusy, setQrBusy] = useState<"png" | "svg" | null>(null);

    const run = async (fn: () => Promise<void>) => {
        try {
            await fn();
        } catch {
            toast.error("Download failed. Please try again.");
        }
    };

    const downloadQrOnly = (extension: "png" | "svg") =>
        run(async () => {
            setQrBusy(extension);
            try {
                await buildQr(qr, 1200).download({ name: `${slug(qr.businessName)}_qr`, extension });
            } finally {
                setQrBusy(null);
            }
        });

    const btn =
        "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-gray-900">{qr.businessName}</h3>
                        <p className="text-xs text-gray-400">Download your QR code or the full printable standee</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-[1fr_260px]">
                    <div className="rounded-2xl bg-gray-50 p-4">
                        <div ref={standeeRef}>
                            <StandeePreview
                                business={{
                                    placeId: qr.placeId,
                                    name: qr.businessName,
                                    address: qr.placeAddress || "",
                                    rating: qr.rating,
                                    totalReviews: qr.totalReviews,
                                }}
                                shortURL={qr.shortUrl}
                                plan="agency"
                                logo={qr.qrConfig.logoUrl || null}
                                qrColor={qr.qrConfig.color || undefined}
                                qrShape={qr.qrConfig.shape}
                                template={qr.standeeConfig.template}
                                standeeBgColor={qr.standeeConfig.bgColor || undefined}
                                socialProof={qr.standeeConfig.socialProof}
                                language={qr.standeeConfig.language}
                                whiteLabel={qr.standeeConfig.whiteLabel}
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Printable standee</p>
                            <div className="grid gap-2">
                                <button onClick={() => run(downloadPDF)} disabled={!!downloading} className={`${btn} bg-[#1A6B45] text-white hover:bg-[#165a3a]`}>
                                    {downloading === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                                    PDF (A5, print-ready)
                                </button>
                                <button onClick={() => run(downloadPNG)} disabled={!!downloading} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
                                    {downloading === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
                                    PNG image
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">QR code only</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => downloadQrOnly("png")} disabled={!!qrBusy} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
                                    {qrBusy === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    PNG
                                </button>
                                <button onClick={() => downloadQrOnly("svg")} disabled={!!qrBusy} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
                                    {qrBusy === "svg" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    SVG
                                </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-gray-400">High resolution (1200 px). SVG scales to any size for big prints.</p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Review link</p>
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                                <code className="min-w-0 flex-1 truncate text-xs text-gray-700">{qr.shortUrl}</code>
                                <button
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(qr.shortUrl);
                                            toast.success("Link copied");
                                        } catch {
                                            toast.error("Couldn't copy the link");
                                        }
                                    }}
                                    aria-label="Copy link"
                                    className="rounded-md p-1 text-gray-400 hover:bg-white hover:text-[#1A6B45]"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-gray-400">Share it on WhatsApp, SMS or your bills. Scans through this link are counted.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientQrCodes: React.FC<{ qrCodes: ClientQrSummary[] }> = ({ qrCodes }) => {
    const [open, setOpen] = useState<ClientQrSummary | null>(null);

    if (qrCodes.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <QrCode className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                <p className="text-sm text-gray-400">No QR codes are shared with you yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {qrCodes.map((qr) => (
                    <div key={qr.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex justify-center rounded-xl bg-gray-50 p-4">
                            <QrThumb qr={qr} />
                        </div>
                        <p className="truncate text-sm font-semibold text-gray-900">{qr.businessName}</p>
                        {qr.placeAddress && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-400">
                                <MapPin className="h-3 w-3 shrink-0" /> {qr.placeAddress}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">{qr.allTimeScans.toLocaleString()} scans all time</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setOpen(qr)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1A6B45] py-2 text-xs font-semibold text-white hover:bg-[#165a3a]"
                            >
                                <Download className="h-3.5 w-3.5" /> Download
                            </button>
                            <a
                                href={qr.reviewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open Google review page"
                                className="flex items-center justify-center rounded-xl border border-gray-200 px-3 text-gray-500 hover:bg-gray-50 hover:text-[#1A6B45]"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {open && <DownloadDialog key={open.id} qr={open} onClose={() => setOpen(null)} />}
        </>
    );
};

export default ClientQrCodes;
