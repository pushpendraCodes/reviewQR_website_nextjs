'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
/**
 * Downloads a printable A5 standee PDF with:
 * - Business name at top
 * - QR code in center
 * - "Scan to Review Us on Google" text
 * - Star rating display
 * - Address at bottom
 */
export const downloadStandeePDF = async (
  standeeElementId: string,
  businessName: string
): Promise<void> => {
  const element = document.getElementById(standeeElementId);
  if (!element) {
    throw new Error('Standee element not found');
  }
  // Capture the standee preview as an image
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 3,
    useCORS: true,
    logging: false,
  });
  // A5 size in mm: 148 x 210
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });
  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = 148;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  // Center the content vertically if it's shorter than A5
  const yOffset = Math.max(0, (210 - pdfHeight) / 2);
  pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
  const safeName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  pdf.save(`reviewqr_standee_${safeName}.pdf`);
};