'use client';

/**
 * Mock business data for demo purposes
 * TODO: In production, replace with Google Places API integration
 */
export interface Business {
  id: number;
  name: string;
  address: string;
  placeId: string;
  rating: number;
  totalReviews: number;
  
  type: string;
  phone: string;
}
export const MOCK_BUSINESSES: Business[] = [
  {
    id: 1,
    name: "Sharma Medical Store",
    address: "MG Road, Rewa, Madhya Pradesh 486001",
    placeId: "ChIJSharma_Medical_Rewa001",
    rating: 4.2,
    totalReviews: 47,
    type: "Pharmacy",
    phone: "+91 98765 43210"
  },
  {
    id: 2,
    name: "Royal Dental Clinic",
    address: "Civil Lines, Rewa, MP 486002",
    placeId: "ChIJRoyal_Dental_Rewa002",
    rating: 4.7,
    totalReviews: 123,
    type: "Dental Clinic",
    phone: "+91 98765 43211"
  },
  {
    id: 3,
    name: "Kapoor Sweet House",
    address: "Station Road, Rewa, MP 486003",
    placeId: "ChIJKapoor_Sweets_Rewa003",
    rating: 4.5,
    totalReviews: 89,
    type: "Sweet Shop",
    phone: "+91 98765 43212"
  },
  {
    id: 4,
    name: "Elite Beauty Parlour",
    address: "Collectorate Chowk, Rewa, MP 486001",
    placeId: "ChIJElite_Beauty_Rewa004",
    rating: 4.1,
    totalReviews: 34,
    type: "Beauty Parlour",
    phone: "+91 98765 43213"
  },
  {
    id: 5,
    name: "Rewa Coaching Academy",
    address: "Gandhi Nagar, Rewa, MP 486001",
    placeId: "ChIJRewa_Coaching_Rewa005",
    rating: 4.6,
    totalReviews: 201,
    type: "Coaching Institute",
    phone: "+91 98765 43214"
  },
  {
    id: 6,
    name: "Gupta Electronics",
    address: "Jawahar Chowk, Rewa, MP 486001",
    placeId: "ChIJGupta_Electronics_Rewa006",
    rating: 4.3,
    totalReviews: 78,
    type: "Electronics",
    phone: "+91 98765 43215"
  },
  {
    id: 7,
    name: "Namaste Yoga Studio",
    address: "Vindhya Nagar, Rewa, MP 486001",
    placeId: "ChIJNamaste_Yoga_Rewa007",
    rating: 4.8,
    totalReviews: 56,
    type: "Fitness",
    phone: "+91 98765 43216"
  },
  {
    id: 8,
    name: "Tandoori Nights Restaurant",
    address: "Bypass Road, Rewa, MP 486001",
    placeId: "ChIJTandoori_Nights_Rewa008",
    rating: 4.4,
    totalReviews: 312,
    type: "Restaurant",
    phone: "+91 98765 43217"
  }
];
export const BUSINESS_CATEGORIES = [
  "All",
  "Pharmacy",
  "Dental Clinic",
  "Sweet Shop",
  "Beauty Parlour",
  "Coaching Institute",
  "Electronics",
  "Fitness",
  "Restaurant"
];
export const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    business: "Sharma Medical Store, Rewa",
    quote: "ReviewQR helped us go from 12 to 85 Google reviews in just 2 months! Customers find it so easy to scan and review. Our business visibility on Google Maps has improved dramatically.",
    avatar: "RS",
    rating: 5
  },
  {
    name: "Dr. Priya Kapoor",
    business: "Royal Dental Clinic, Rewa",
    quote: "As a doctor, I don't have time for marketing. ReviewQR made it effortless — we printed the standee, put it at reception, and reviews started flowing in. Best investment for our clinic!",
    avatar: "PK",
    rating: 5
  },
  {
    name: "Amit Verma",
    business: "Tandoori Nights Restaurant, Rewa",
    quote: "We placed the QR standee on every table. Now our customers review us while waiting for their food! Our rating went from 3.9 to 4.4 stars in just 6 weeks. Incredible tool!",
    avatar: "AV",
    rating: 5
  }
];
export const FAQ_DATA = [
  {
    question: "What is ReviewQR?",
    answer: "ReviewQR is a free tool that helps local businesses generate QR codes linked directly to their Google review page. Paid plans add printable standees and AI review suggestions so customers can finish a review in seconds."
  },
  {
    question: "How does the QR code work?",
    answer: "The QR code contains a direct link to your business's Google review form. When a customer scans it with their phone camera, it opens the review page directly — no searching needed."
  },
  {
    question: "What are AI review suggestions?",
    answer: "On Starter and above, scanners land on your branded page with AI-written review options. They tap to copy, open Google, and paste — which removes writer's block and gets more reviews completed."
  },
  {
    question: "Is ReviewQR really free?",
    answer: "Yes! Generating a QR code and downloading it as a PNG is completely free. Premium plans unlock PDF standees, AI review suggestions, custom branding, analytics, and white-labeling."
  },
  {
    question: "Do I need a Google My Business listing?",
    answer: "Yes, your business needs to be listed on Google Maps to generate a review QR code. If you don't have a listing yet, you can create one for free at business.google.com."
  },
  {
    question: "Where should I place the QR code?",
    answer: "Popular places include: reception desk, billing counter, dining tables, product packaging, visiting cards, WhatsApp status, and social media. The more visible it is, the more reviews you'll get!"
  },
  {
    question: "Can customers review without a Google account?",
    answer: "Customers need a Google account to leave a review. However, since most smartphone users (especially on Android) already have a signed-in Google account, this is rarely an issue."
  },
  {
    question: "How many reviews can I expect?",
    answer: "This depends on your foot traffic and QR placement. On average, businesses see a 3-5x increase in reviews within the first month of using ReviewQR — especially when AI suggestions make posting faster."
  },
  {
    question: "Can I customize the QR code design?",
    answer: "The free version generates a standard QR code. Pro and Agency plans include customization like logo embedding, color changes, and branded standee templates."
  },
  {
    question: "Is this available for businesses globally?",
    answer: "Yes, absolutely! ReviewQR works for any business listed on Google Maps anywhere in the world. The review URL and QR code format are universal."
  },
  {
    question: "How do I get more reviews from the QR code?",
    answer: "Pro tips: 1) Ask customers politely to scan after a positive experience. 2) Place the standee where customers wait (billing counter, reception). 3) Use AI suggestions so they don't have to write from scratch. 4) Share the link on WhatsApp after each transaction."
  }
];