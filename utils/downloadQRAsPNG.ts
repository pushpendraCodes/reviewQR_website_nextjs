'use client';

import html2canvas from 'html2canvas';
/**
 * Downloads the QR code as a PNG image
 * Uses html2canvas to capture the QR code element
 */
export const downloadQRAsPNG = async (
  elementId: string, 
  businessName: string
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('QR code element not found');
  }
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 3, // High resolution
    useCORS: true,
  });
  const link = document.createElement('a');
  const safeName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  link.download = `reviewqr_${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};