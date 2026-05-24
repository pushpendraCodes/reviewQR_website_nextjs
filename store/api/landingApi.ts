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

export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
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

export const { useGetLandingDataQuery, useGenerateAIReviewsMutation } = landingApi;
