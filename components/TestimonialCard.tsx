'use client';

import { Star, Quote } from 'lucide-react';
/**
 * TestimonialCard — Displays a customer testimonial
 * Shows initials avatar, name, business, quote, and star rating
 */
interface TestimonialCardProps {
  name: string;
  business: string;
  quote: string;
  rating: number;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const TestimonialCard = ({ name, business, quote, rating }: TestimonialCardProps) => {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="h-full flex flex-col border-t border-primary/25 pt-6">
      <Quote className="w-7 h-7 text-primary/30 mb-3" />
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-primary fill-primary" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
          {initialsOf(name)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          {business && <p className="text-xs text-gray-400">{business}</p>}
        </div>
      </div>
    </div>
  );
};
export default TestimonialCard;
