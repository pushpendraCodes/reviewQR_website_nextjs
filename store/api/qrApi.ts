'use client';

// src/store/qrApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export interface QRCode {
  id: string;
  placeId: string;
  businessName: string;
  placeAddress: string;
  placeRating: number;
  totalReviews: number;
  reviewURL?: string;
  reviewUrl?: string;
  shortCode: string;
  shortURL: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
  qrImageUrl?: string;
  isActive: boolean;
  /** Paused because the Free period or the plan's grace period ended. */
  planPaused?: boolean;
  /** Who created the QR (populated). Null on QRs created before Agency teams existed. */
  createdBy?: { _id: string; name: string; email: string; picture?: string } | null;

  // Configuration
  qrConfig: {
    color: string;
    shape: 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
    logoUrl?: string;
  };
  standeeConfig: {
    template: 'minimal' | 'luxury' | 'bold' | 'festive';
    bgColor?: string;
    socialProof?: string;
    language: 'en' | 'hi' | 'mr' | 'ta' | 'te';
    whiteLabel: { enabled: boolean; clientName: string };
  };
  agencyBilling?: {
    planType: 'monthly' | 'yearly' | 'none';
    price: number;
    nextPaymentDate: string | null;
    history: {
      _id?: string;
      amount: number;
      date: string;
      notes: string;
    }[];
  };
}

export interface GenerateQRRequest {
  // Place
  placeId: string;
  businessName: string;
  placeAddress?: string;
  placeRating?: number;
  totalReviews?: number;
  label?: string;

  // Download format (for analytics logging)
  format?: 'png' | 'svg' | 'pdf';

  // QR config (plan-gated on backend)
  color?: string;
  shape?: 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
  logoData?: string | null; // base64 data-URI

  // Standee config (plan-gated on backend)
  template?: 'minimal' | 'luxury' | 'bold' | 'festive';
  bgColor?: string;
  socialProof?: string;
  language?: 'en' | 'hi' | 'mr' | 'ta' | 'te';
  whiteLabel?: { enabled: boolean; clientName: string };
}

export interface GenerateQRResponse {
  success: boolean;
  message: string;
  isNew: boolean;
  qr: QRCode;
}

export interface CheckPlanResponse {
  message: string;
  success: boolean;
  // qr: QRCode; 
  plan: string;
  qrLimit: number;
  currentCount: number;
}

export interface ListQRResponse {
  success: boolean;
  qrCodes: QRCode[];
  total: number;
  /** Whole-account active / plan-paused QR counts (agency owners and solo users; null for staff). */
  accountTotal: number | null;
  accountPaused: number | null;
  /** When every QR in the account stops (owners not on a paid plan). */
  qrStop: QrStopInfo | null;
  pagination: { total: number; page: number; pages: number };
}

export interface QrStopInfo {
  reason: 'trial' | 'lapsed';
  lapsedAt: string | null;
  pauseOn: string;
  graceDays: number;
  trialDays: number;
}

export interface AnalyticsResponse {
  success: boolean;
  analytics: {
    totalScans: number;
    scansToday: number;
    scansThisWeek: number;
    scansThisMonth: number;
    scansByDate: { date: string; count: number }[];
  };
}

export type ReviewTone = 'friendly' | 'professional' | 'enthusiastic';

export interface ReviewProfile {
  category: string;
  description: string;
  services: { name: string; detail: string }[];
  highlights: string[];
  staff: string[];
  tone: ReviewTone;
}

export interface ReviewProfileResponse {
  success: boolean;
  qr: { _id: string; businessName: string; placeAddress: string; shortCode: string };
  profile: ReviewProfile;
  updatedAt: string | null;
  allowed: boolean;
  limits: { services: number; highlights: number; staff: number };
  defaultLiked: string[];
}

export const qrApi = createApi({
  reducerPath: "qrApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["QRCode", "ReviewProfile"],
  endpoints: (builder) => ({
    generateQR: builder.mutation<GenerateQRResponse, GenerateQRRequest>({
      query: (body) => ({
        url: "/qr/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["QRCode"],
    }),
    checkPlan: builder.mutation<CheckPlanResponse, void>({
      query: () => ({
        url: "/qr/user/check-plan",
        method: "GET",
      }),
      invalidatesTags: ["QRCode"],
    }),
    /** `member` (agency owners only): "me" or a staff user id. */
    listQRCodes: builder.query<ListQRResponse, { member?: string; limit?: number } | void>({
      query: (params) => {
        const query: Record<string, string | number> = {};
        if (params?.member) query.member = params.member;
        if (params?.limit) query.limit = params.limit;
        return { url: "/qr", params: Object.keys(query).length ? query : undefined };
      },
      providesTags: ["QRCode"],
    }),
    getQRCode: builder.query<{ success: boolean; qr: QRCode }, string>({
      query: (id) => `/qr/get/${id}`,
      providesTags: (_r, _e, id) => [{ type: "QRCode", id }],
    }),
    updateQRCode: builder.mutation<{ success: boolean; qr: QRCode }, { id: string; data: Partial<QRCode> }>({
      query: ({ id, data }) => ({
        url: `/qr/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["QRCode"],
    }),
    deleteQRCode: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/qr/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QRCode"],
    }),
    downloadQRCode: builder.query<Blob, string>({
      query: (id) => ({
        url: `/qr/${id}/download`,
        responseHandler: (res) => res.blob(),
      }),
    }),
    getQRAnalytics: builder.query<AnalyticsResponse, string>({
      query: (id) => `/qr/${id}/analytics`,
    }),
    getReviewProfile: builder.query<ReviewProfileResponse, string>({
      query: (id) => `/qr/${id}/review-profile`,
      providesTags: (_r, _e, id) => [{ type: "ReviewProfile", id }],
    }),
    updateReviewProfile: builder.mutation<ReviewProfileResponse & { message: string }, { id: string; profile: ReviewProfile }>({
      query: ({ id, profile }) => ({
        url: `/qr/${id}/review-profile`,
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "ReviewProfile", id }],
    }),
    autofillReviewProfile: builder.mutation<{ success: boolean; profile: ReviewProfile }, string>({
      query: (id) => ({
        url: `/qr/${id}/review-profile/autofill`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGenerateQRMutation,
  useCheckPlanMutation,
  useListQRCodesQuery,
  useGetQRCodeQuery,
  useUpdateQRCodeMutation,
  useDeleteQRCodeMutation,
  useLazyDownloadQRCodeQuery,
  useGetQRAnalyticsQuery,
  useGetReviewProfileQuery,
  useUpdateReviewProfileMutation,
  useAutofillReviewProfileMutation,
} = qrApi;