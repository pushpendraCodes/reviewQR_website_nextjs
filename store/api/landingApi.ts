'use client';

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export interface LandingData {
  success: boolean;
  businessName: string;
  logoUrl: string;
  placeRating: number;
  totalReviews: number;
  reviewUrl: string;
  placeAddress: string;
  aiEnabled: boolean;
}

export interface AIReviewsResponse {
  success: boolean;
  reviews: string[];
}

export interface PublicPlace {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number;
}

export interface FeaturedReview {
  _id: string;
  name: string;
  business: string;
  rating: number;
  text: string;
}

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
    getPublicPlace: builder.query<PublicPlace, string>({
      query: (placeId) => `/places/details/${encodeURIComponent(placeId)}`,
      transformResponse: (res: { place: PublicPlace }) => res.place,
    }),
    getFeaturedReviews: builder.query<FeaturedReview[], void>({
      query: () => "/reviews/featured",
      transformResponse: (res: { reviews: FeaturedReview[] }) => res.reviews,
    }),
    getLandingData: builder.query<LandingData, string>({
      query: (shortCode) => `/qr/landing/${shortCode}`,
    }),
    generateAIReviews: builder.mutation<AIReviewsResponse, string>({
      query: (shortCode) => ({
        url: "/qr/ai-reviews",
        method: "POST",
        body: { shortCode },
      }),
    }),
  }),
});

export const {
  useGetLandingDataQuery,
  useGenerateAIReviewsMutation,
  useGetPublicPlaceQuery,
  useGetFeaturedReviewsQuery,
} = landingApi;
