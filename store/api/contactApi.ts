'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// ─── Request / Response types ──────────────────────────────────────────────────
export interface EnquiryRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
}

// ─── API slice ─────────────────────────────────────────────────────────────────
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    sendEnquiry: builder.mutation<EnquiryResponse, EnquiryRequest>({
      query: (body) => ({
        url: "/contact/enquiry",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendEnquiryMutation } = contactApi;
