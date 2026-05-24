'use client';

// src/hooks/useQRGenerator.ts
import { useState } from "react";
import { useCheckPlanMutation } from "../store/api/qrApi";
import type { Business } from "../store/api/placesApi";
import type { QRCode } from "../store/api/qrApi";
import { generateReviewURL } from "../utils/generateReviewURL";
import toast from "react-hot-toast";

type QRError = "limit_reached" | "rate_limited" | "unknown" | null;
// type dummyQR = string;
// import dummyQR from "../assets/dummy-qr.png";

export const useQRGenerator = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [generatedQR, setGeneratedQR] = useState<QRCode | null>(null);
  const [reviewURL, setReviewURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [qrError, setQRError] = useState<QRError>(null);

  const [checkPlan, { isLoading: isGenerating }] = useCheckPlanMutation();

  const selectBusiness = async (business: Business) => {
    setSelectedBusiness(business);
    setQRError(null);
    const url = generateReviewURL(business.placeId);
    setReviewURL(url);
    setShortURL("");

    try {
      const result = await checkPlan().unwrap();
      // console.log(result, "result")
      if (result.success) {
        // setGeneratedQR(dummyQR);
        // toast.success("QR code generated!");
      } else {
        toast.error(result.message || "Failed to generate QR code. Please try again.");
      }
    } catch (err: any) {
      console.log(err, "err")
      const status = err?.status;
      if (status === 403) {
        toast.error("You've reached your plan limit. Upgrade to generate more QR codes.");
        setQRError("limit_reached");
      } else if (status === 429) {
        toast.error("Too many requests. Please wait a moment.");
        setQRError("rate_limited");
      } else {
        toast.error("Failed to generate QR code. Please try again.");
        setQRError("unknown");
      }
    }
  };

  const clearSelection = () => {
    setSelectedBusiness(null);
    setGeneratedQR(null);
    setReviewURL("");
    setShortURL("");
    setQRError(null);
  };

  return {
    selectedBusiness,
    generatedQR,
    reviewURL,
    shortURL,
    setShortURL,
    isGenerating,
    qrError,
    selectBusiness,
    setSelectedBusiness,
    setReviewURL,
    clearSelection,
  };
};
