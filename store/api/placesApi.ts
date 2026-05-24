'use client';

// src/store/placesApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export interface Business {
  id?: string;
  placeId: string;
  name: string;
  address: string;
  type?: string;
  rating?: number;
  totalRatings?: number;
    totalReviews?: number;
  phone?: string;
  website?: string;
  isOpen?: boolean;
}

export interface SearchResponse {
  success: boolean;
  results: Business[];
  total: number;
}

export interface PlaceDetailsResponse {
  success: boolean;
  business: Business;
}

export const placesApi = createApi({
  reducerPath: "placesApi",
  baseQuery: baseQueryWithReauth, // ← auto-refresh on 401
  endpoints: (builder) => ({
    searchBusinesses: builder.query<SearchResponse, { q: string; category?: string }>({
      query: ({ q, category }) => ({
        url: "/places/search",
        params: {
          q,
          ...(category && category !== "All" ? { category } : {}),
        },
      }),
    }),
    getPlaceDetails: builder.query<PlaceDetailsResponse, string>({
      query: (placeId) => `/places/details/${placeId}`,
    }),
  }),
});

export const { useLazySearchBusinessesQuery, useGetPlaceDetailsQuery } = placesApi;