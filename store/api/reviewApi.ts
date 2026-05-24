'use client';

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export interface ReviewSubmitRequest {
  rating: number;
  text: string;
}

export interface ReviewResponse {
  message: string;
  review?: any;
}

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    submitPlatformReview: builder.mutation<ReviewResponse, ReviewSubmitRequest>({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubmitPlatformReviewMutation } = reviewApi;
