'use client';

/** Client-portal session (agency clients). Separate from the agency/user auth session. */
export const CLIENT_TOKEN_KEY = "client_portal_token";

export const getClientToken = (): string | null =>
  typeof window === "undefined" ? null : localStorage.getItem(CLIENT_TOKEN_KEY);

export const setClientToken = (token: string) => localStorage.setItem(CLIENT_TOKEN_KEY, token);

export const clearClientToken = () => localStorage.removeItem(CLIENT_TOKEN_KEY);
