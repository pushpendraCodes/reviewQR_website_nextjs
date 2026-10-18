'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Eye, EyeOff, Loader2, Lock, Mail, Star } from "lucide-react";
import { useClientLoginMutation, clientPortalApi } from "@/store/api/clientPortalApi";
import { getClientToken, setClientToken } from "@/lib/clientSession";
import { useAppDispatch } from "@/store/hooks";

const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

const ClientLoginPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [login, { isLoading }] = useClientLoginMutation();

    useEffect(() => {
        if (getClientToken()) router.replace("/client");
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await login({ email: email.trim(), password }).unwrap();
            setClientToken(res.token);
            dispatch(clientPortalApi.util.resetApiState());
            router.replace("/client");
        } catch (err) {
            setError(errMsg(err, "Sign in failed. Please try again."));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F3FAF6] via-white to-[#EAF6EF] px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] shadow-lg shadow-[#1A6B45]/25">
                        <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Client dashboard</h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Sign in with the email and password your agency gave you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
                    <div>
                        <label htmlFor="client-email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                id="client-email"
                                type="email"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="client-password" className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                id="client-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-10 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#165a3a] disabled:opacity-60"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Sign in
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Forgot your password? Ask your agency to send you a new one.
                    </p>
                </form>

                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    See your scans, Google rating and latest reviews in one place
                </p>
            </div>
        </div>
    );
};

export default ClientLoginPage;
