'use client';

import React, { useRef, useState, useEffect } from "react";
import { Mail, X, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../store/api/authApi";
interface VerifyEmailModalProps {
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}
const RESEND_TIMEOUT = 60;
const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  email,
  onSuccess,
  onClose,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    try {
      const result = await verifyEmail({ email, otp: code }).unwrap();
      if (result.success) {
        setVerified(true);
        toast.success("Email verified successfully! ✅");
        setTimeout(onSuccess, 1500);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid or expired code");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };
  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      setCountdown(RESEND_TIMEOUT);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success("New code sent to your email 📧");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to resend code");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl shadow-gray-900/15">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        {verified ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-gray-900 text-xl font-bold">Verified!</h3>
              <p className="text-gray-500 text-sm mt-1">
                Redirecting you to sign in…
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Icon & Header */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-violet-50 border-2 border-violet-200 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-gray-900 text-xl font-bold">
                  Check your email
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  We sent a 6-digit verification code to
                </p>
                <p className="text-violet-600 text-sm font-semibold mt-0.5">
                  {email}
                </p>
              </div>
            </div>
            {/* OTP Inputs */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`w-11 text-center text-gray-900 text-xl font-bold bg-white border-2 rounded-xl
                    focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500
                    hover:border-gray-300 transition-all duration-200 shadow-sm
                    ${digit ? "border-violet-400 bg-violet-50" : "border-gray-200"}`}
                  style={{ height: "52px" }}
                />
              ))}
            </div>
            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join("").length < 6}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 text-sm"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify email"
              )}
            </button>
            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend code in{" "}
                  <span className="text-violet-600 font-semibold">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="flex items-center justify-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors mx-auto disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
                  />
                  {isResending ? "Sending…" : "Resend code"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifyEmailModal;