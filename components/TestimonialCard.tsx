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
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary/20 h-full flex flex-col">
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-primary/20 mb-4" />
      {/* Quote Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
        "{quote}"
      </p>
      {/* Rating Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
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