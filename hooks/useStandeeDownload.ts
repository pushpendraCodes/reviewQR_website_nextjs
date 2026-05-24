'use client';

import { useRef, useCallback, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

type DownloadFormat = 'png' | 'svg' | 'pdf' | null;

/**
 * Captures the standee DOM node exactly as rendered and downloads it
 * in the requested format. Attach `standeeRef` to the wrapper div
 * that wraps <StandeePreview />.
 */
export const useStandeeDownload = (businessName: string) => {
    const standeeRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState<DownloadFormat>(null);

    // ── helpers ────────────────────────────────────────────────────────
    const slug = (name: string) =>
        name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const triggerLink = (href: string, filename: string) => {
        const a = document.createElement('a');
        a.href = href;
        a.download = filename;
        a.click();
    };

    // Shared capture options — 3× pixel ratio for print-quality output
    // Note: useCORS/allowTaint are html2canvas options; html-to-image does not use them.
    // Logos uploaded as data-URLs are already inline, so no CORS handling is needed.
    const captureOptions = {
        backgroundColor: '#ffffff',
        pixelRatio: 3,
    };

    // ── PNG ─────────────────────────────────────────────────────────────
    const downloadPNG = useCallback(async () => {
        if (!standeeRef.current) return;
        setDownloading('png');
        try {
            // ✅ Wait for all child canvases to finish painting
            await new Promise(r => setTimeout(r, 300));

            const dataUrl = await htmlToImage.toPng(standeeRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 4,          // ← bump to 4× for print-quality (300 DPI at A5)
                // ✅ Force re-draw of canvas elements (critical for qr-code-styling)
                filter: (node) => {
                    if (node instanceof HTMLCanvasElement) {
                        node.getContext('2d'); // ensure context is active
                    }
                    return true;
                },
            });
            triggerLink(dataUrl, `${slug(businessName)}_standee.png`);
        } finally {
            setDownloading(null);
        }
    }, [businessName]);

    // ── SVG ─────────────────────────────────────────────────────────────
    // html-to-image's toSvg embeds a <foreignObject> so the output is a
    // valid SVG that preserves every CSS style exactly as rendered.
    const downloadSVG = useCallback(async () => {
        if (!standeeRef.current) return;
        setDownloading('svg');
        try {
            const dataUrl = await htmlToImage.toSvg(standeeRef.current, {
                backgroundColor: '#ffffff',
            });
            triggerLink(dataUrl, `${slug(businessName)}_standee.svg`);
        } catch (err) {
            console.error('SVG export failed:', err);
            throw err;
        } finally {
            setDownloading(null);
        }
    }, [businessName]);

    // ── PDF ─────────────────────────────────────────────────────────────
    // Renders at 3× → places on A5 page with 10 mm margins.
    // A5 is ideal for table tent cards and counter standees.
    const downloadPDF = useCallback(async () => {
        if (!standeeRef.current) return;
        setDownloading('pdf');
        try {
            // 1. Capture as high-res canvas
            const canvas = await htmlToImage.toCanvas(standeeRef.current, captureOptions);

            // 2. Create A5 PDF (148 × 210 mm)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a5',
            });

            const pageW = pdf.internal.pageSize.getWidth();   // 148 mm
            const pageH = pdf.internal.pageSize.getHeight();  // 210 mm
            const margin = 10; // mm

            // 3. Fit image proportionally inside the margins
            const maxW = pageW - margin * 2;
            const maxH = pageH - margin * 2;
            const ratio = canvas.width / canvas.height;

            let imgW = maxW;
            let imgH = imgW / ratio;

            if (imgH > maxH) {
                imgH = maxH;
                imgW = imgH * ratio;
            }

            const xOff = (pageW - imgW) / 2;
            const yOff = (pageH - imgH) / 2;

            // 4. Embed & save
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                xOff, yOff,
                imgW, imgH,
                undefined,
                'FAST', // compression
            );

            pdf.save(`${slug(businessName)}_standee.pdf`);
        } catch (err) {
            console.error('PDF export failed:', err);
            throw err;
        } finally {
            setDownloading(null);
        }
    }, [businessName]);

    return {
        standeeRef,
        downloading,
        downloadPNG,
        downloadSVG,
        downloadPDF,
    };
};