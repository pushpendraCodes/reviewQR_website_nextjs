'use client';

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearClientToken, getClientToken } from "@/lib/clientSession";
import type { QRDotShape, StandeeLanguage, StandeeTemplate } from "@/components/StandeePreview";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/client-portal`,
  prepareHeaders: (headers) => {
    const token = getClientToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/** A 401 means the client session is gone (expired, password reset, or deleted). */
const clientBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status === 401 && url !== "/login") clearClientToken();
  return result;
};

export interface ClientInfo {
  _id: string;
  name: string;
  email: string;
}

export interface ClientAgencyInfo {
  name: string;
  contactName: string;
  email: string;
  picture: string;
}

/** Dashboard is blocked once a paid plan is `blockAfterDays` past due; payments stay available. */
export interface BillingBlock {
  blockAfterDays: number;
  blocked: boolean;
  blockedSince: string | null;
  blocksOn: string | null;
  overdueAmount: number;
  overdueLocations: string[];
}

export interface ClientSession {
  client: ClientInfo;
  agency: ClientAgencyInfo;
  agencyActive: boolean;
  billingBlock: BillingBlock & { currency: BillingCurrency };
}

export type ClientRange = "7d" | "30d" | "90d";

export interface ClientReview {
  authorName?: string;
  rating?: number;
  text?: string;
  time?: number;
}

export interface ClientQrSummary {
  id: string;
  businessName: string;
  label?: string;
  placeAddress?: string;
  rating: number;
  totalReviews: number;
  allTimeScans: number;
  scans: number;
  reviewUrl: string;
  placeId: string;
  shortUrl: string;
  qrConfig: { color: string; shape: QRDotShape; logoUrl: string };
  standeeConfig: {
    template: StandeeTemplate;
    bgColor: string;
    socialProof: string;
    language: StandeeLanguage;
    whiteLabel: { enabled: boolean; clientName: string };
  };
  latestReviews: ClientReview[];
  googleSyncedAt?: string | null;
}

export interface ClientSummary {
  range: ClientRange;
  days: number;
  totals: { qrCodes: number; scans: number; allTimeScans: number; avgRating: number; totalReviews: number };
  dailyScans: { date: string; count: number }[];
  trends: { date: string; reviews: number; rating: number }[];
  geography: { city: string; count: number }[];
  devices: { type: string; count: number }[];
  qrCodes: ClientQrSummary[];
}

export type ClientBillingStatus = "overdue" | "due_soon" | "upcoming" | "no_date" | "none";

export interface ClientBillingPlan {
  id: string;
  businessName: string;
  placeAddress?: string;
  planType: "monthly" | "yearly" | "none";
  price: number;
  nextPaymentDate: string | null;
  status: ClientBillingStatus;
  daysUntilDue: number | null;
  totalPaid: number;
  paymentsCount: number;
  lastPaymentAt: string | null;
}

export interface ClientPayment {
  id: string;
  qrId: string;
  businessName: string;
  amount: number;
  date: string;
  notes: string;
}

export type BillingCurrency = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "AED" | "SGD";
export type PaymentClaimMethod = "upi" | "link" | "paypal" | "bank" | "other";

export interface AgencyPaymentMethods {
  upiId: string;
  upiName: string;
  paymentLink: string;
  paymentLinkLabel: string;
  paypalMe: string;
  bankDetails: string;
  instructions: string;
  hasAny: boolean;
}

export interface PaymentClaim {
  id: string;
  qrId: string;
  businessName: string;
  amount: number;
  currency: BillingCurrency;
  method: PaymentClaimMethod;
  reference: string;
  note: string;
  paidAt: string;
  status: "pending" | "confirmed" | "rejected";
  rejectReason: string;
  createdAt: string;
  reviewedAt: string | null;
}

export interface ClientPayments {
  currency: BillingCurrency;
  totals: {
    totalPaid: number;
    paidThisYear: number;
    paymentsCount: number;
    amountDue: number;
    overdueAmount: number;
    overdueCount: number;
    nextDue: { date: string; amount: number; businessName: string; status: ClientBillingStatus } | null;
    lastPayment: ClientPayment | null;
  };
  block: BillingBlock;
  plans: ClientBillingPlan[];
  payments: ClientPayment[];
}

export const clientPortalApi = createApi({
  reducerPath: "clientPortalApi",
  baseQuery: clientBaseQuery,
  tagTypes: ["ClientSession", "ClientSummary", "ClientPayments"],
  endpoints: (builder) => ({
    clientLogin: builder.mutation<ClientSession & { token: string }, { email: string; password: string }>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    getClientMe: builder.query<ClientSession, void>({
      query: () => "/me",
      providesTags: ["ClientSession"],
    }),
    getClientSummary: builder.query<ClientSummary, ClientRange>({
      query: (range) => `/summary?range=${range}`,
      providesTags: ["ClientSummary"],
    }),
    getClientPayments: builder.query<
      ClientPayments & { paymentMethods: AgencyPaymentMethods; claims: PaymentClaim[] },
      void
    >({
      query: () => "/payments",
      providesTags: ["ClientPayments"],
    }),
    createPaymentClaim: builder.mutation<
      { message: string; claim: PaymentClaim },
      { qrId: string; amount: number; method: PaymentClaimMethod; reference?: string; note?: string; paidAt?: string }
    >({
      query: (body) => ({ url: "/payment-claims", method: "POST", body }),
      invalidatesTags: ["ClientPayments"],
    }),
    changeClientPassword: builder.mutation<{ message: string; token: string }, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useClientLoginMutation,
  useGetClientMeQuery,
  useGetClientSummaryQuery,
  useGetClientPaymentsQuery,
  useCreatePaymentClaimMutation,
  useChangeClientPasswordMutation,
} = clientPortalApi;
