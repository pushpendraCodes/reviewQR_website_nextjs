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
  reviewURL: string;
  shortCode: string;
  shortURL: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
  qrImageUrl?: string;

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

export const qrApi = createApi({
  reducerPath: "qrApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["QRCode"],
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
    listQRCodes: builder.query<ListQRResponse, void>({
      query: () => "/qr",
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
      invalidatesTags: (_r, _e, { id }) => [{ type: "QRCode", id }],
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
} = qrApi;