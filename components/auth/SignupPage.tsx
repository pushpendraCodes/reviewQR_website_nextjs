'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Link from 'next/link';;
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import GoogleButton from "../../components/auth/GoogleButton";
import InputField from "../../components/auth/InputField";
import { useRegisterMutation } from "../../store/api/authApi";
import { useAppSelector } from "../../store/hooks";
import VerifyEmailModal from "./VerifyEmailModal";
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const passwordRequirements = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
];
const SignupPage: React.FC = () => {
  const navigate = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  const password = watch("password", "");
  useEffect(() => {
    if (isAuthenticated) {
      navigate.push("/");
    }
  }, [isAuthenticated, navigate]);
  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      if (result.success) {
        setRegisteredEmail(data.email);
        setShowVerify(true);
        toast.success("Account created! Please verify your email 📧");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      const msg =
        error?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };
  const metRequirementsCount = passwordRequirements.filter((r) =>
    r.test(password)
  ).length;
  const strengthColor =
    metRequirementsCount === 3
      ? "bg-emerald-500"
      : metRequirementsCount === 2
        ? "bg-yellow-500"
        : metRequirementsCount === 1
          ? "bg-orange-400"
          : "bg-gray-200";
  return (
    <>
      <AuthLayout>
        <div className="space-y-2"> {/* ← reduced from space-y-6 */}

          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>

          {/* Header */}
          <div className="space-y-1"> {/* ← reduced from space-y-2 */}
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
              <span className="text-violet-600 text-xs font-semibold">
                🎉 Free plan — no credit card needed
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight"> {/* ← text-2xl instead of text-3xl */}
              Create your account
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed"> {/* ← text-xs */}
              Start generating review QR codes and grow your online reputation
            </p>
          </div>

          {/* Google OAuth */}
          <GoogleButton label="Sign up with Google" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium px-1">
              or create with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3"> {/* ← space-y-3 */}
            <InputField
              label="Full name"
              type="text"
              placeholder="John Smith"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              registration={formRegister("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
            />
            <InputField
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              registration={formRegister("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Please enter a valid email" },
              })}
            />
            <div className="space-y-1.5">
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                registration={formRegister("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
              />
              {/* Password strength — compact */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < metRequirementsCount ? strengthColor : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                  {/* Requirements in a single row to save space */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {passwordRequirements.map((req, i) => {
                      const met = req.test(password);
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-1 text-xs transition-all duration-200 ${met ? "text-emerald-600" : "text-gray-400"
                            }`}
                        >
                          {met ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 flex-shrink-0" />
                          )}
                          {req.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <InputField
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              registration={formRegister("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />

            {/* Terms — more compact */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <a href="/terms-and-conditions" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">Terms</a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
              ) : (
                <>Create free account<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </AuthLayout>

      {showVerify && (
        <VerifyEmailModal
          email={registeredEmail}
          onSuccess={() => { setShowVerify(false); navigate.push("/auth/login"); }}
          onClose={() => setShowVerify(false)}
        />
      )}
    </>
  );
};
export default SignupPage;