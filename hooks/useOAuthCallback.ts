'use client';

// src/hooks/useOAuthCallback.ts
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { authApi } from "../store/api/authApi";

export const useOAuthCallback = () => {
  const searchParams = useSearchParams(); // ✅ Next.js returns read-only params, no setter
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ renamed from navigate for clarity
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    // Handle backend error redirect e.g. ?error=oauth_failed
    if (oauthError) {
      setError("Google sign-in failed. Please try again.");
      // ✅ Use router.replace() to navigate and strip query params
      router.replace("/login?error=oauth_failed");
      return;
    }

    if (!token) return;

    const processOAuthToken = async () => {
      setIsProcessing(true);
      try {
        // Save access token to Redux immediately so getMe request includes it
        dispatch(
          setCredentials({
            accessToken: token,
            user: { id: "", name: "", email: "", picture: "" },
          })
        );

        // Fetch user info using the new token
        const result = await (dispatch as any)(
          authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
        );

        if (result.data?.success) {
          dispatch(
            setCredentials({
              accessToken: token,
              user: result.data.user,
            })
          );
          // ✅ Navigate and strip ?token= from URL after success
          // router.replace("/dashboard");
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (err) {
        console.error("OAuth token processing failed:", err);
        setError("Authentication failed. Please try again.");
        router.replace("/login?error=oauth_failed"); // ✅ replace() strips token from history
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally run once on mount

  return { isProcessing, error };
};