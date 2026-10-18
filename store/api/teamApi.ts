'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { User, UserTeam } from "../../types/auth";

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  teamJoinedAt?: string;
  lastLoginAt?: string;
  status?: string;
  qrCount: number;
  totalScans: number;
}

export interface TeamInvite {
  _id: string;
  email: string;
  expiresAt: string;
  lastSentAt?: string;
  createdAt: string;
}

export type SeatCurrency = "INR" | "USD";

export interface TeamSeatsInfo {
  included: number;
  extra: number;
  max: number;
  maxExtra: number;
  /** Smallest currency unit (paise / cents) per seat per month */
  pricePerMonth: Record<SeatCurrency, number>;
  planExpiresAt?: string | null;
}

export interface SeatQuote {
  seats: number;
  currency: SeatCurrency;
  amount: number;
  days: number;
  perSeatMonthly: number;
  currentExtraSeats: number;
  planExpiresAt?: string | null;
}

export type SeatCheckoutResponse =
  | { provider: "razorpay"; razorpayOrderId: string; amount: number; currency: "INR"; keyId: string; seats: number; label: string }
  | { provider: "lemon_squeezy"; checkoutId: string; checkoutUrl: string; amount: number; currency: "USD"; seats: number; label: string };

export type TeamResponse =
  | {
      role: "owner";
      canManage: boolean;
      seatLimit: number;
      seatsUsed: number;
      seats: TeamSeatsInfo;
      owner: { _id: string; name: string; email: string; picture?: string; qrCount: number; totalScans: number };
      members: TeamMember[];
      invites: TeamInvite[];
    }
  | { role: "staff"; team: UserTeam };

export type InviteStatus = "pending" | "accepted" | "expired" | "unavailable" | "invalid";

export interface InviteInfo {
  status: InviteStatus;
  email?: string;
  ownerName?: string;
  businessName?: string;
  ownerPicture?: string;
  expiresAt?: string;
  message?: string;
}

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getTeam: builder.query<TeamResponse, void>({
      query: () => "/team",
      providesTags: ["Team"],
    }),
    inviteMember: builder.mutation<{ message: string; invite: TeamInvite }, { email: string }>({
      query: (body) => ({ url: "/team/invites", method: "POST", body }),
      invalidatesTags: ["Team"],
    }),
    resendInvite: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/team/invites/${id}/resend`, method: "POST" }),
      invalidatesTags: ["Team"],
    }),
    revokeInvite: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/team/invites/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team"],
    }),
    removeMember: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/team/members/${id}`, method: "DELETE" }),
      invalidatesTags: ["Team"],
    }),
    getInviteInfo: builder.query<InviteInfo, string>({
      query: (token) => `/team/invite/${encodeURIComponent(token)}`,
    }),
    acceptInvite: builder.mutation<{ message: string; user: User }, { token: string }>({
      query: (body) => ({ url: "/team/accept", method: "POST", body }),
      invalidatesTags: ["Team"],
    }),
    leaveTeam: builder.mutation<{ message: string; user: User }, void>({
      query: () => ({ url: "/team/leave", method: "POST" }),
      invalidatesTags: ["Team"],
    }),
    getSeatQuote: builder.query<SeatQuote, { seats: number; currency: SeatCurrency }>({
      query: ({ seats, currency }) => `/team/seats/quote?seats=${seats}&currency=${currency}`,
    }),
    createSeatCheckout: builder.mutation<SeatCheckoutResponse, { seats: number; currency: SeatCurrency }>({
      query: (body) => ({ url: "/team/seats/checkout", method: "POST", body }),
    }),
    reduceSeats: builder.mutation<{ message: string; extraSeats: number; seatLimit: number }, { extraSeats: number }>({
      query: (body) => ({ url: "/team/seats", method: "PATCH", body }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useInviteMemberMutation,
  useResendInviteMutation,
  useRevokeInviteMutation,
  useRemoveMemberMutation,
  useGetInviteInfoQuery,
  useAcceptInviteMutation,
  useLeaveTeamMutation,
  useGetSeatQuoteQuery,
  useCreateSeatCheckoutMutation,
  useReduceSeatsMutation,
} = teamApi;
