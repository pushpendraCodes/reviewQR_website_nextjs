'use client';

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Users, Loader2, CheckCircle2, AlertTriangle, LogIn, UserPlus, Check } from "lucide-react";
import { useGetInviteInfoQuery, useAcceptInviteMutation } from "@/store/api/teamApi";
import { useLogoutMutation } from "@/store/api/authApi";
import { qrApi } from "@/store/api/qrApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logoutUser } from "@/store/slices/authSlice";
import { PENDING_INVITE_KEY } from "@/lib/teamInvite";
import { useHydrated } from "@/hooks/useHydrated";

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F4F7F4] via-white to-[#E8F5EE] p-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-emerald-900/5">
            <Link href="/" className="mb-6 inline-flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.svg" alt="" className="h-8 w-8" />
                <span className="font-semibold text-gray-900">ReviewQR</span>
            </Link>
            {children}
        </div>
    </div>
);

const Problem: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <Shell>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{text}</p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-[#1A6B45] hover:underline">Go to dashboard</Link>
    </Shell>
);

const AcceptInviteInner: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useSearchParams().get("token") || "";
    const hydrated = useHydrated();
    const { isAuthenticated, user, accessToken } = useAppSelector((s) => s.auth);

    const { data: info, isLoading, isError } = useGetInviteInfoQuery(token, { skip: !token });
    const [accept, { isLoading: accepting }] = useAcceptInviteMutation();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        if (token) localStorage.setItem(PENDING_INVITE_KEY, token);
    }, [token]);

    const here = `/team/accept?token=${encodeURIComponent(token)}`;
    const forget = () => localStorage.removeItem(PENDING_INVITE_KEY);

    if (!token) return <Problem title="Invite link incomplete" text="This link is missing its invite code. Open the link from your invite email again." />;
    if (!hydrated || isLoading) {
        return (
            <Shell>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1A6B45]" />
            </Shell>
        );
    }
    if (isError || !info || info.status === "invalid") {
        forget();
        return <Problem title="Invite not found" text="This invite link is invalid or was cancelled. Ask the agency owner to send a new one." />;
    }
    if (info.status === "expired") {
        forget();
        return <Problem title="Invite expired" text={`This invite has expired. Ask ${info.ownerName || "the agency owner"} to resend it.`} />;
    }
    if (info.status === "unavailable") {
        return <Problem title="Team not available" text={`${info.ownerName || "This agency"}'s plan isn't active right now, so the invite can't be accepted yet.`} />;
    }
    if (info.status === "accepted") {
        forget();
        return <Problem title="Invite already used" text="This invite has already been accepted. Sign in to open your dashboard." />;
    }

    const emailMatches = !!user?.email && user.email.toLowerCase() === info.email?.toLowerCase();
    const isStaffAlready = user?.team?.role === "staff";

    const handleAccept = async () => {
        try {
            const res = await accept({ token }).unwrap();
            forget();
            if (accessToken) dispatch(setCredentials({ user: res.user, accessToken }));
            dispatch(qrApi.util.invalidateTags(["QRCode"]));
            toast.success(res.message);
            router.replace("/dashboard/standees");
        } catch (err) {
            toast.error((err as { data?: { message?: string } })?.data?.message || "Couldn't accept the invite");
        }
    };

    const switchAccount = async () => {
        try {
            await logout().unwrap();
        } catch {
            // Local session is cleared regardless.
        }
        dispatch(logoutUser());
        router.push(`/auth/login?redirect=${encodeURIComponent(here)}`);
    };

    return (
        <Shell>
            <div className="relative mx-auto mb-5 h-16 w-16">
                <div className="absolute inset-0 rotate-6 rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] opacity-20" />
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] shadow-lg shadow-[#1A6B45]/25">
                    <Users className="h-8 w-8 text-white" />
                </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Join {info.businessName || `${info.ownerName}'s agency`}</h1>
            <p className="mt-2 text-sm text-gray-500">
                <strong className="text-gray-700">{info.ownerName}</strong> invited <strong className="text-gray-700">{info.email}</strong> to their team on ReviewQR.
            </p>

            <ul className="mx-auto mt-5 max-w-xs space-y-1.5 text-left text-sm text-gray-600">
                {["Create review QR codes for your clients", "Use the agency's plan features", "You'll see only the QR codes you create"].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2ECC71]" />{t}</li>
                ))}
            </ul>

            <div className="mt-7 space-y-2">
                {!isAuthenticated ? (
                    <>
                        <Link
                            href={`/auth/login?redirect=${encodeURIComponent(here)}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#165a3a]"
                        >
                            <LogIn className="h-4 w-4" /> Sign in to accept
                        </Link>
                        <Link
                            href={`/auth/signup?redirect=${encodeURIComponent(here)}`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <UserPlus className="h-4 w-4" /> Create an account
                        </Link>
                        <p className="pt-1 text-xs text-gray-400">Use <strong>{info.email}</strong> — the invite only works for that email.</p>
                    </>
                ) : isStaffAlready ? (
                    <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                        You&apos;re already part of an agency team. Leave it from <Link href="/dashboard/team" className="font-semibold underline">Team settings</Link> to join this one.
                    </div>
                ) : !emailMatches ? (
                    <>
                        <div className="rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
                            You&apos;re signed in as <strong>{user?.email}</strong>, but this invite is for <strong>{info.email}</strong>.
                        </div>
                        <button
                            onClick={switchAccount}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#165a3a]"
                        >
                            <LogIn className="h-4 w-4" /> Sign in as {info.email}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleAccept}
                        disabled={accepting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] px-5 py-3 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
                    >
                        {accepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Accept & join team
                    </button>
                )}
                <button
                    onClick={() => { forget(); router.push("/"); }}
                    className="w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                    Not now
                </button>
            </div>
        </Shell>
    );
};

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={null}>
            <AcceptInviteInner />
        </Suspense>
    );
}
