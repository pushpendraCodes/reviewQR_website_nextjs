'use client';

import { MapPin, Star, Phone, ChevronRight } from 'lucide-react';
import type { Business } from '../store/api/placesApi';
/**
 * BusinessResultCard — Displays a single business search result
 * Clickable card that selects the business for QR generation
 */
interface BusinessResultCardProps {
  business: Business;
 onSelect: (business: Business) => void; // sync — no Promise
  isSelected?: boolean;
  index: number;
}
const BusinessResultCard = ({ business, onSelect, isSelected, index }: BusinessResultCardProps) => {
  return (
    <button
      onClick={() => onSelect(business)}
      className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 group hover:shadow-lg ${
        isSelected
          ? 'border-primary bg-primary-light shadow-md'
          : 'border-gray-100 bg-white hover:border-primary/50'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Business Name & Type */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-secondary-light text-secondary rounded-full">
              {business.type}
            </span>
          </div>
          {/* Address */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
              <span className="text-sm text-gray-400">· {business.totalReviews} reviews</span>
            </div>
            {business.phone && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{business.phone}</span>
              </div>
            )}
          </div>
          {/* Place ID Preview */}
          <div className="mt-2 text-xs text-gray-400 font-mono truncate">
            Place ID: {business.placeId}
          </div>
        </div>
        {/* Select Arrow */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
        }`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};
export default BusinessResultCard;