'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export interface CreateOrderRequest {
  plan: string;
  billingCycle: "monthly" | "annual";
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  resumed?: boolean;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  transaction?: any;
}

export interface PaymentFailedRequest {
  razorpayOrderId: string;
}

export interface PaymentFailedResponse {
  message: string;
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/subscription/create-order",
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (data) => ({
        url: "/subscription/verify-payment",
        method: "POST",
        body: data,
      }),
    }),
    paymentFailed: builder.mutation<PaymentFailedResponse, PaymentFailedRequest>({
      query: (data) => ({
        url: "/subscription/payment-failed",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  usePaymentFailedMutation,
} = subscriptionApi;
