'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { AgencyPaymentMethods, BillingCurrency, ClientPayments, PaymentClaim } from "./clientPortalApi";

export interface AgencyClientQr {
  _id: string;
  businessName: string;
  label?: string;
  placeAddress?: string;
  status: "active" | "archived";
}

export interface AgencyClient {
  _id: string;
  name: string;
  email: string;
  status: "active" | "disabled";
  billingCurrency: BillingCurrency;
  pendingClaims: number;
  billingBlock: { blocked: boolean; blockedSince: string | null; blocksOn: string | null; overdueAmount: number };
  lastLoginAt: string | null;
  createdAt: string;
  createdBy: { _id: string; name: string; email: string } | null;
  qrCodes: AgencyClientQr[];
}

export interface ClientCredentialsResponse {
  message: string;
  password: string;
  emailed: boolean;
  loginUrl: string;
}

export interface ClientDetails {
  client: AgencyClient;
  billing: ClientPayments;
  claims: PaymentClaim[];
  canManage: boolean;
  /** Owner with an active plan: billing, payments, claim approval, edit/disable/delete. */
  canEdit: boolean;
  loginUrl: string;
}

type BillingResponse = { message: string; billing: ClientPayments };

export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Client", "PaymentMethods"],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<{ methods: AgencyPaymentMethods; canEdit: boolean }, void>({
      query: () => "/clients/payment-methods",
      providesTags: ["PaymentMethods"],
    }),
    updatePaymentMethods: builder.mutation<
      { message: string; methods: AgencyPaymentMethods },
      Omit<AgencyPaymentMethods, "hasAny">
    >({
      query: (body) => ({ url: "/clients/payment-methods", method: "PUT", body }),
      invalidatesTags: ["PaymentMethods"],
    }),
    confirmClaim: builder.mutation<BillingResponse, { id: string; claimId: string; amount?: number; advanceDueDate?: boolean }>({
      query: ({ id, claimId, ...body }) => ({ url: `/clients/${id}/claims/${claimId}/confirm`, method: "POST", body }),
      invalidatesTags: ["Client"],
    }),
    rejectClaim: builder.mutation<{ message: string }, { id: string; claimId: string; reason?: string }>({
      query: ({ id, claimId, reason }) => ({ url: `/clients/${id}/claims/${claimId}/reject`, method: "POST", body: { reason } }),
      invalidatesTags: ["Client"],
    }),
    getClient: builder.query<ClientDetails, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Client", id }],
    }),
    updateClientBilling: builder.mutation<
      BillingResponse,
      { id: string; qrId: string; planType?: "monthly" | "yearly" | "none"; price?: number; nextPaymentDate?: string | null }
    >({
      query: ({ id, qrId, ...body }) => ({ url: `/clients/${id}/billing/${qrId}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Client", id }],
    }),
    recordClientPayment: builder.mutation<
      BillingResponse,
      { id: string; qrId: string; amount: number; date?: string; notes?: string; advanceDueDate?: boolean }
    >({
      query: ({ id, ...body }) => ({ url: `/clients/${id}/payments`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Client", id }],
    }),
    deleteClientPayment: builder.mutation<BillingResponse, { id: string; qrId: string; paymentId: string }>({
      query: ({ id, qrId, paymentId }) => ({ url: `/clients/${id}/payments/${qrId}/${paymentId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Client", id }],
    }),
    listClients: builder.query<{ clients: AgencyClient[]; canManage: boolean; canEdit: boolean; loginUrl: string }, void>({
      query: () => "/clients",
      providesTags: ["Client"],
    }),
    createClient: builder.mutation<
      ClientCredentialsResponse & { client: AgencyClient },
      { name: string; email: string; qrCodeIds: string[]; sendEmail: boolean }
    >({
      query: (body) => ({ url: "/clients", method: "POST", body }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation<
      { message: string; client: AgencyClient },
      { id: string; name?: string; qrCodeIds?: string[]; status?: "active" | "disabled"; billingCurrency?: BillingCurrency }
    >({
      query: ({ id, ...body }) => ({ url: `/clients/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Client"],
    }),
    resetClientPassword: builder.mutation<ClientCredentialsResponse, { id: string; sendEmail: boolean }>({
      query: ({ id, sendEmail }) => ({ url: `/clients/${id}/reset-password`, method: "POST", body: { sendEmail } }),
    }),
    deleteClient: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/clients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useListClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useResetClientPasswordMutation,
  useDeleteClientMutation,
  useGetClientQuery,
  useUpdateClientBillingMutation,
  useRecordClientPaymentMutation,
  useDeleteClientPaymentMutation,
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodsMutation,
  useConfirmClaimMutation,
  useRejectClaimMutation,
} = clientsApi;
