'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link';;
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/auth/InputField";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} from "../../store/api/authApi";
type Step = "email" | "otp" | "reset" | "success";
interface EmailForm {
  email: string;
}
interface OtpForm {
  otp: string;
}
interface ResetForm {
  newPassword: string;
  confirmPassword: string;
}
const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const emailForm = useForm<EmailForm>();
  const otpForm = useForm<OtpForm>();
  const resetForm = useForm<ResetForm>();
  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };
  const handleEmailSubmit = async (data: EmailForm) => {
    try {
      const result = await forgotPassword({ email: data.email }).unwrap();
      if (result.success) {
        setEmail(data.email);
        setStep("otp");
        startCountdown();
        toast.success("Reset code sent to your email 📧");
      }else{
        toast.error(result.message || "Failed to send reset code"); 
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Email not found");
    }
  };
  const handleOtpSubmit = async (data: OtpForm) => {
    try {
      const result = await verifyOtp({ email, otp: data.otp }).unwrap();
      if (result.success) {
        setOtp(data.otp);
        setStep("reset");
        toast.success("Code verified ✅");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Invalid or expired code");
    }
  };
  const handleResetSubmit = async (data: ResetForm) => {
    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
      }).unwrap();
      if (result.success) {
        setStep("success");
        toast.success("Password reset successfully! 🎉");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };
  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap();
      startCountdown();
      toast.success("New code sent 📧");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to resend");
    }
  };
  const newPassword = resetForm.watch("newPassword", "");
  /* Step indicator */
  const steps = ["email", "otp", "reset"];
  const currentStepIndex = steps.indexOf(step);
  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Back to login */}
        {step !== "success" && (
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to sign in
          </Link>
        )}
        {/* Progress dots */}
        {step !== "success" && (
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= currentStepIndex
                      ? "bg-violet-600 flex-1"
                      : "bg-gray-200 flex-1"
                  }`}
                />
              </React.Fragment>
            ))}
          </div>
        )}
        {/* Step: Email */}
        {step === "email" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-violet-50 border-2 border-violet-200 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Forgot password?
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                No worries — enter your email and we'll send you a reset code
              </p>
            </div>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <InputField
                label="Email address"
                type="email"
                placeholder="you@company.com"
                icon={<Mail className="w-4 h-4" />}
                error={emailForm.formState.errors.email?.message}
                registration={emailForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send reset code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        {/* Step: OTP */}
        {step === "otp" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-violet-50 border-2 border-violet-200 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Enter reset code
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                We sent a 6-digit code to{" "}
                <span className="text-violet-600 font-semibold">{email}</span>
              </p>
            </div>
            <form
              onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
              className="space-y-4"
            >
              <InputField
                label="6-digit code"
                type="text"
                placeholder="000000"
                error={otpForm.formState.errors.otp?.message}
                registration={otpForm.register("otp", {
                  required: "Code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter the 6-digit code",
                  },
                })}
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend in{" "}
                  <span className="text-violet-600 font-semibold">
                    {countdown}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="flex items-center justify-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-medium mx-auto transition-colors"
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
        {/* Step: Reset */}
        {step === "reset" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-violet-50 border-2 border-violet-200 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Set new password
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose a strong password for your account
              </p>
            </div>
            <form
              onSubmit={resetForm.handleSubmit(handleResetSubmit)}
              className="space-y-4"
            >
              <InputField
                label="New password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={resetForm.formState.errors.newPassword?.message}
                registration={resetForm.register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                })}
              />
              <InputField
                label="Confirm new password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={resetForm.formState.errors.confirmPassword?.message}
                registration={resetForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === newPassword || "Passwords do not match",
                })}
              />
              <button
                type="submit"
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting…
                  </>
                ) : (
                  <>
                    Reset password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        {/* Step: Success */}
        {step === "success" && (
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
              <svg
                className="w-10 h-10 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                All done! 🎉
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Go to sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
export default ForgotPasswordPage;