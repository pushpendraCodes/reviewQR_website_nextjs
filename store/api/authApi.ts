'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { User } from "../../types/auth";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


export interface MeResponse {
  success: boolean;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken?: string;
}
export interface VerifyEmailRequest {
  email: string;
  otp: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
export interface ResendOtpRequest {
  email: string;
}
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),

    getProfile: builder.query<MeResponse, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),


    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation<AuthResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<AuthResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation<AuthResponse, ResendOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation<MeResponse, any>({
      query: (body) => ({
        url: "/user/profile",
        method: "PUT",
        body,
      }),
    }),
    changePassword: builder.mutation<AuthResponse, any>({
      query: (data) => ({
        url: "/user/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    deleteAccount: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/user/account",
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = authApi;
