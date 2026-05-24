'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';;

/**
 * PricingCard — Reusable pricing tier card
 * Supports highlighted/popular variant and annual/monthly billing
 */
interface PricingCardProps {
  name: string;
  monthlyPrice: string;
  annualPrice?: string;       // Total annual amount (e.g. "₹2,513")
  annualMonthly?: string;     // Per-month when billed annually (e.g. "₹209")
  isAnnual: boolean;
  period?: string;
  description: string;
  features: string[];
  qrLimit: string;
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
  isFree?: boolean;
  onPurchase?: () => void;
  isLoading?: boolean;
}

const PricingCard = ({
  name,
  monthlyPrice,
  annualPrice,
  annualMonthly,
  isAnnual,
  description,
  features,
  qrLimit,
  popular,
  ctaText,
  ctaLink,
  isFree,
  onPurchase,
  isLoading,
}: PricingCardProps) => {
  const displayPrice = isFree
    ? '₹0'
    : isAnnual
    ? annualMonthly!
    : monthlyPrice;

  const subLabel = isFree
    ? 'forever'
    : isAnnual
    ? `₹${annualPrice} billed annually`
    : 'per month';

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 hover:shadow-xl ${
        popular
          ? 'border-primary bg-white shadow-lg scale-105'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      {/* Annual savings badge */}
      {!isFree && isAnnual && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            Save 30%
          </span>
        </div>
      )}

      {/* Plan Name & QR Limit */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            popular
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {qrLimit} QR
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-5">{description}</p>

      {/* Price */}
      <div className="mb-1">
        <span className="text-4xl font-extrabold text-gray-900">{displayPrice}</span>
        {!isFree && (
          <span className="text-sm text-gray-400 ml-1">/mo</span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-6 min-h-[16px]">{subLabel}</p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                popular ? 'bg-primary/10' : 'bg-gray-100'
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  popular ? 'text-primary' : 'text-gray-500'
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {onPurchase ? (
        <button
          onClick={onPurchase}
          disabled={isLoading}
          className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
            popular
              ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isLoading ? 'Processing...' : ctaText}
        </button>
      ) : (
        <Link
          href={ctaLink}
          className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            popular
              ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default PricingCard;