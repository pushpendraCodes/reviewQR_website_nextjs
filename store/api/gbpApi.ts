'use client';

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface GbpLocation {
  locationResourceName: string;
  title: string;
  placeId?: string;
  address?: string;
}

export interface GbpReview {
  _id: string;
  googleReviewId: string;
  reviewResourceName: string;
  reviewerDisplayName: string;
  reviewerProfilePhotoUrl?: string;
  starRating: number;
  comment: string;
  createTime?: string;
  updateTime?: string;
  replyComment?: string;
  replyUpdateTime?: string;
  replyStatus: 'replied' | 'unreplied';
}

export interface GbpStatusResponse {
  success: boolean;
  connected: boolean;
  accountDisplayName?: string;
  locations: GbpLocation[];
  selectedLocationResourceName?: string;
  lastSyncAt?: string;
  connectedAt?: string;
  lastError?: string;
}

export interface GbpReviewsResponse extends GbpStatusResponse {
  reviews: GbpReview[];
  pagination: { page: number; limit: number; total: number; pages: number };
  stats: {
    averageRating: number;
    totalReviewCount: number;
    repliedCount: number;
    unrepliedCount: number;
  };
}

export const gbpApi = createApi({
  reducerPath: 'gbpApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GbpStatus', 'GbpReviews'],
  endpoints: (builder) => ({
    getGbpStatus: builder.query<GbpStatusResponse, void>({
      query: () => '/gbp/status',
      providesTags: ['GbpStatus'],
    }),
    getConnectUrl: builder.query<{ success: boolean; url: string }, void>({
      query: () => '/gbp/connect-url',
    }),
    selectGbpLocation: builder.mutation<GbpStatusResponse, { locationResourceName: string }>({
      query: (body) => ({
        url: '/gbp/location',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GbpStatus', 'GbpReviews'],
    }),
    refreshGbpLocations: builder.mutation<GbpStatusResponse & { message?: string }, void>({
      query: () => ({
        url: '/gbp/refresh-locations',
        method: 'POST',
      }),
      invalidatesTags: ['GbpStatus', 'GbpReviews'],
    }),
    syncGbpReviews: builder.mutation<
      { success: boolean; message: string; synced: number },
      void
    >({
      query: () => ({ url: '/gbp/sync', method: 'POST' }),
      invalidatesTags: ['GbpReviews', 'GbpStatus'],
    }),
    getGbpReviews: builder.query<
      GbpReviewsResponse,
      { stars?: string; replyStatus?: string; page?: number; limit?: number }
    >({
      query: ({ stars, replyStatus, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (stars) params.set('stars', stars);
        if (replyStatus) params.set('replyStatus', replyStatus);
        return `/gbp/reviews?${params.toString()}`;
      },
      providesTags: ['GbpReviews'],
    }),
    postGbpReply: builder.mutation<
      { success: boolean; message: string },
      { reviewId: string; comment: string }
    >({
      query: ({ reviewId, comment }) => ({
        url: `/gbp/reviews/${reviewId}/reply`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: ['GbpReviews'],
    }),
    generateGbpAiReply: builder.mutation<
      { success: boolean; suggestion: string },
      { reviewId: string }
    >({
      query: ({ reviewId }) => ({
        url: `/gbp/reviews/${reviewId}/ai-reply`,
        method: 'POST',
      }),
    }),
    disconnectGbp: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: '/gbp/disconnect', method: 'DELETE' }),
      invalidatesTags: ['GbpStatus', 'GbpReviews'],
    }),
  }),
});

export const {
  useGetGbpStatusQuery,
  useLazyGetConnectUrlQuery,
  useSelectGbpLocationMutation,
  useRefreshGbpLocationsMutation,
  useSyncGbpReviewsMutation,
  useGetGbpReviewsQuery,
  usePostGbpReplyMutation,
  useGenerateGbpAiReplyMutation,
  useDisconnectGbpMutation,
} = gbpApi;
