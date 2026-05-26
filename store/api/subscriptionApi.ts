'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export type PaymentRegion = "india" | "international";
export type PaymentCurrency = "INR" | "USD";

export interface PricingRegionResponse {
  region: PaymentRegion;
  currency: PaymentCurrency;
  country: string;
  lemonSqueezyEnabled: boolean;
}

export interface CreateOrderRequest {
  plan: string;
  billingCycle: "monthly" | "annual";
  /** User-selected currency; overrides geo-based routing on the backend. */
  currency?: PaymentCurrency;
}

export interface RazorpayOrderResponse {
  provider: "razorpay";
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  resumed?: boolean;
}

export interface LemonCheckoutResponse {
  provider: "lemon_squeezy";
  checkoutId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  resumed?: boolean;
}

export type CreateOrderResponse = RazorpayOrderResponse | LemonCheckoutResponse;

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
  razorpayOrderId?: string;
  lemonSqueezyCheckoutId?: string;
}

export interface PaymentFailedResponse {
  message: string;
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPricingRegion: builder.query<PricingRegionResponse, void>({
      query: () => "/subscription/pricing-region",
    }),
    createOrder: builder.mutation<RazorpayOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/subscription/create-order",
        method: "POST",
        body: data,
      }),
    }),
    createLemonCheckout: builder.mutation<LemonCheckoutResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/subscription/create-lemon-checkout",
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
  useGetPricingRegionQuery,
  useCreateOrderMutation,
  useCreateLemonCheckoutMutation,
  useVerifyPaymentMutation,
  usePaymentFailedMutation,
} = subscriptionApi;
