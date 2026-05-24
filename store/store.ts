'use client';

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { placesApi } from "./api/placesApi";
import { qrApi } from "./api/qrApi";
import { contactApi } from "./api/contactApi";
import { subscriptionApi } from "./api/subscriptionApi";
import { analyticsApi } from "./api/analyticsApi";
import { landingApi } from "./api/landingApi";
import { reviewApi } from "./api/reviewApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [placesApi.reducerPath]: placesApi.reducer,
    [qrApi.reducerPath]: qrApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [landingApi.reducerPath]: landingApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      placesApi.middleware,
      qrApi.middleware,
      contactApi.middleware,
      subscriptionApi.middleware,
      analyticsApi.middleware,
      landingApi.middleware,
      reviewApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
