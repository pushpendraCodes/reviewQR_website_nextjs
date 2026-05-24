'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Business } from '../store/api/placesApi';
// import { getWhatsAppShareURL } from '../utils/generateReviewURL';
// import { downloadQRAsPNG } from '../utils/downloadQRAsPNG';
// import { downloadStandeePDF } from '../utils/downloadStandeePDF';
import StandeePreview, { type QRDotShape, type StandeeLanguage, type StandeeTemplate } from './StandeePreview';
// import type { QRCode } from '../store/api/qrApi';
/**
 * QRCodeDisplay — Main QR code output section
 * Shows QR code, download buttons, share options, and standee preview
 */
interface QRCodeDisplayProps {
  business: Business;
  reviewURL: string;
  // generatedQR?: String | null; // ← add
  isGenerating?: boolean;
  onClear: () => void;
  plan: string;
  logo?: string | null;   // ← add
  qrColor?: string; // ← add
  whiteLabel?: { enabled: boolean; clientName: string }; // ← add
  qrShape?: QRDotShape;
  template?: StandeeTemplate;
  standeeBgColor?: string;
  socialProof?: string;
  language?: StandeeLanguage;
}
const QRCodeDisplay = ({
  business, reviewURL, onClear, plan,
  logo, qrColor, whiteLabel,
  qrShape, template, standeeBgColor, socialProof, language,  // ← new
}: QRCodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  // const [setDownloadingPNG] = useState(false);
  // const [setDownloadingPDF] = useState(false);
  // Copy review link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewURL);
      setCopied(true);
      toast.success('Review link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };
  // // Download QR as PNG
  // const handleDownloadPNG = async () => {
  //   setDownloadingPNG(true);
  //   try {
  //     await downloadQRAsPNG('qr-code-container', business.name);
  //     toast.success('QR code downloaded as PNG!');
  //   } catch {
  //     toast.error('Failed to download QR code');
  //   }
  //   setDownloadingPNG(false);
  // };
  // // Download standee as PDF
  // const handleDownloadPDF = async () => {
  //   setDownloadingPDF(true);
  //   try {
  //     await downloadStandeePDF('standee-preview', business.name);
  //     toast.success('Standee PDF downloaded!');
  //   } catch {
  //     toast.error('Failed to download standee PDF');
  //   }
  //   setDownloadingPDF(false);
  // };
  // // WhatsApp share
  // const handleWhatsAppShare = () => {
  //   window.open(getWhatsAppShareURL(business.name, business.placeId), '_blank');
  // };
  return (
    <div className="animate-fade-in-up">
      {/* Selected Business Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-primary-light rounded-xl border border-primary/20">
        <div>
          <h3 className="font-semibold text-gray-900">{business.name}</h3>
          <p className="text-sm text-gray-600">{business.address}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-500">★</span>
            <span className="text-sm font-medium">{business.rating}</span>
            <span className="text-sm text-gray-400">· {business.totalReviews} reviews</span>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Change
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: QR Code */}
        <div className="flex flex-col items-center">
          <div
            id="qr-code-container"
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 inline-block"
          >
            <QRCodeSVG
              value={reviewURL}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1D9E75"
            />
          </div>
          {/* Review URL */}
          <div className="mt-4 w-full max-w-sm">
            <p className="text-xs text-gray-400 text-center mb-1">Review URL:</p>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <code className="flex-1 text-xs text-gray-600 truncate">{reviewURL}</code>
              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          {/* Action Buttons */}
          {/* <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-sm">
            <button
              onClick={handleDownloadPNG}
              disabled={downloadingPNG}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadingPNG ? 'Saving...' : 'PNG'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white text-sm font-semibold rounded-xl hover:bg-secondary-dark transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {downloadingPDF ? 'Saving...' : 'PDF Standee'}
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#20BD5A] transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/25 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div> */}
          {/* Web Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Review ${business.name}`,
                  text: `Please leave a review for ${business.name}`,
                  url: reviewURL,
                });
              } else {
                handleCopyLink();
              }
            }}
            className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share via other apps
          </button>
        </div>
        {/* Right: Standee Preview */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
            Standee Preview
          </h4>
          <StandeePreview
            business={business}
            reviewURL={reviewURL}
            plan={plan}
            logo={logo}
            qrColor={qrColor}
            whiteLabel={whiteLabel}
            qrShape={qrShape}
            template={template}
            standeeBgColor={standeeBgColor}
            socialProof={socialProof}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};
export default QRCodeDisplay;