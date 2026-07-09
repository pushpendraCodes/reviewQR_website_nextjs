'use client';

import { Star, Quote } from 'lucide-react';
/**
 * TestimonialCard — Displays a customer testimonial
 * Shows avatar placeholder, name, business, quote, and star rating
 */
interface TestimonialCardProps {
  name: string;
  business: string;
  quote: string;
  avatar: string;
  rating: number;
}
const TestimonialCard = ({ name, business, quote, avatar, rating }: TestimonialCardProps) => {
  return (
    <div className="h-full flex flex-col border-t border-primary/25 pt-6">
      <Quote className="w-7 h-7 text-primary/30 mb-3" />
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-primary fill-primary" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-400">{business}</p>
        </div>
      </div>
    </div>
  );
};
export default TestimonialCard;