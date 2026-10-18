'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export interface AnalyticsSummaryResponse {
  period: {
    range: string;
    days: number;
    since: string;
  };
  /** Set when the response is filtered to one QR. */
  selectedQrId: string | null;
  /** Every QR the user can see, for the QR filter. */
  qrOptions: { id: string; businessName: string; placeAddress: string }[];
  totalQRCodes: number;
  totalScans: number;
  dailyScanData: { _id: string; count: number }[];
  trends: {
    date: string;
    reviews: number;
    rating: number;
  }[];
  geography: { city: string; count: number }[];
  devices: { type: string; count: number }[];
  qrCodes: {
    id: string;
    businessName: string;
    totalScanCount: number;
    currentRating: number;
    totalReviews: number;
    googleSyncedAt?: string | null;
    latestReviews: {
      authorName: string;
      rating: number;
      text: string;
      time: number;
    }[];
  }[];
}

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Analytics"],
  endpoints: (builder) => ({
    getSummary: builder.query<AnalyticsSummaryResponse, { range: string; qrId?: string }>({
      query: ({ range, qrId }) => `/analytics/summary?range=${range}${qrId ? `&qrId=${encodeURIComponent(qrId)}` : ""}`,
      providesTags: ["Analytics"],
    }),
    syncAnalytics: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/analytics/sync",
        method: "POST",
      }),
      invalidatesTags: ["Analytics"],
    }),
  }),
});

export const { useGetSummaryQuery, useSyncAnalyticsMutation } = analyticsApi;
