'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';;
import { QRCodeSVG } from 'qrcode.react';
import { Star, ArrowLeft, ExternalLink } from 'lucide-react';

import { MOCK_BUSINESSES } from '@/utils/mockData';
import { generateReviewURL } from '@/utils/generateReviewURL';

/**
 * SharePage — Shareable page that shows just the QR code for a specific placeId
 * URL format: /share/:placeId
 */
const SharePage = () => {
  const { placeId } = useParams<{ placeId: string }>();
  // Find the business by placeId
  const business = MOCK_BUSINESSES.find((b) => b.placeId === placeId);

  if (!business) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-500 mb-6">
            The business you're looking for doesn't exist or the link may be incorrect.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Generate New QR Code
          </Link>
        </div>
      </div>
    );
  }

  const reviewURL = generateReviewURL(business.placeId);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 via-white to-secondary-light/20 flex items-center justify-center px-4 py-12">
      
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
        {/* Google Logo Hint */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          <span className="text-xl font-bold text-[#EA4335]">o</span>
          <span className="text-xl font-bold text-[#FBBC05]">o</span>
          <span className="text-xl font-bold text-[#4285F4]">g</span>
          <span className="text-xl font-bold text-[#34A853]">l</span>
          <span className="text-xl font-bold text-[#EA4335]">e</span>
          <span className="text-sm text-gray-400 ml-2">Reviews</span>
        </div>
        {/* Business Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h1>
        <p className="text-sm text-gray-500 mb-3">{business.address}</p>
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.floor(business.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200'
                }`}
            />
          ))}
          <span className="text-sm font-semibold text-gray-700 ml-1">
            {business.rating} · {business.totalReviews} reviews
          </span>
        </div>
        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl border-2 border-primary/20 inline-block mb-6">
          <QRCodeSVG
            value={reviewURL}
            size={180}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#1D9E75"
          />
        </div>
        {/* CTA */}
        <div className="mb-6">
          <p className="text-lg font-bold text-primary mb-2">Scan to Review Us!</p>
          <p className="text-sm text-gray-500">
            Point your phone camera at the QR code to leave a review
          </p>
        </div>
        {/* Direct Review Link */}
        <a
          href={reviewURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all active:scale-95"
        >
          Leave a Review
          <ExternalLink className="w-4 h-4" />
        </a>
        {/* Powered by */}
        <p className="text-xs text-gray-300 mt-8">
          Powered by{' '}
          <Link href="/" className="text-primary hover:underline">
            getreviewqr.com
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SharePage;