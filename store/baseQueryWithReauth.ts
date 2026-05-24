'use client';

// src/store/baseQueryWithReauth.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { setCredentials, logoutUser } from "./slices/authSlice"; // adjust path

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Base query with auth headers
const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If 401 → try refreshing the token
  if (result.error?.status === 401) {
    console.log("Access token expired — attempting refresh...");

    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    // console.log(refreshResult,"refreshResult")
    if (refreshResult.data) {

      const { accessToken, user } = (refreshResult.data as any);

      // Save new tokens to Redux store
      api.dispatch(setCredentials({ accessToken, user }));

      // Retry the original request with new token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh also failed → force logout
      console.warn("Refresh token expired — logging out");
      api.dispatch(logoutUser());
    }
  }

  return result;
};