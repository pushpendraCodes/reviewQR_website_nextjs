'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // ✅ removed double ;;
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import GoogleButton from "../../components/auth/GoogleButton";
import InputField from "../../components/auth/InputField";
import { useLoginMutation } from "../../store/api/authApi";
import { setCredentials } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter(); // ✅ renamed from navigate to router (Next.js convention)
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams(); // ✅ Next.js returns object directly, not an array
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/"); // ✅ router.push instead of navigate.push
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      if (result.success && result.user) {
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
          })
        );
        toast.success("Welcome back! 🎉");
        router.push("/"); // ✅ router.push instead of navigate.push
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      const msg =
        error?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-7">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sign in to manage your review QR codes and track performance
          </p>
        </div>

        {/* Google OAuth */}
        <GoogleButton label="Continue with Google" />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium px-1">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Email address"
            type="email"
            placeholder=""
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <div className="space-y-1">
            <InputField
              label="Password"
              type="password"
              placeholder=""
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              registration={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors mt-1.5 inline-block"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary disabled:from-violet-300 disabled:to-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 text-sm mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in to your account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-1">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-violet-600 hover:text-violet-700 font-semibold transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;