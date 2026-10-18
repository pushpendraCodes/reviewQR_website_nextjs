'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    AlertTriangle,
    BarChart3,
    ExternalLink,
    KeyRound,
    Loader2,
    Lock,
    LogOut,
    MapPin,
    MessageSquare,
    MessagesSquare,
    QrCode,
    ScanLine,
    Smartphone,
    Star,
    Wallet,
    X,
} from "lucide-react";
import ClientQrCodes from "@/components/client/ClientQrCodes";
import ClientComingSoon from "@/components/client/ClientComingSoon";
import ClientPayments from "@/components/client/ClientPayments";
import { fmtDate } from "@/components/client/billingUi";
import { formatAmount } from "@/lib/money";
import {
    clientPortalApi,
    useChangeClientPasswordMutation,
    useGetClientMeQuery,
    useGetClientSummaryQuery,
    type ClientRange,
    type ClientReview,
} from "@/store/api/clientPortalApi";
import { clearClientToken, getClientToken, setClientToken } from "@/lib/clientSession";
import { useAppDispatch } from "@/store/hooks";
import { useHydrated } from "@/hooks/useHydrated";

const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;
const errStatus = (err: unknown) => (err as { status?: number })?.status;

type ClientTab = "overview" | "qr" | "payments" | "reviews";

const TABS: { key: ClientTab; label: string; icon: React.ElementType; soon?: boolean }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "qr", label: "QR codes", icon: QrCode },
    { key: "payments", label: "Payments", icon: Wallet },
    { key: "reviews", label: "Google reviews", icon: MessagesSquare, soon: true },
];

const RANGES: { key: ClientRange; label: string }[] = [
    { key: "7d", label: "7 days" },
    { key: "30d", label: "30 days" },
    { key: "90d", label: "90 days" },
];

const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                style={{ width: size, height: size }}
                className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
            />
        ))}
    </span>
);

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; hint?: string }> = ({ icon: Icon, label, value, hint }) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5EE]">
            <Icon className="h-4 w-4 text-[#1A6B45]" />
        </div>
        <p className="text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
);

const reviewDate = (time?: number) => (time ? new Date(time * 1000).toLocaleDateString() : "");

const ChangePasswordDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [changePassword, { isLoading }] = useChangeClientPasswordMutation();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (next.length < 8) return setError("New password must be at least 8 characters.");
        if (next !== confirm) return setError("The new passwords don't match.");
        setError(null);
        try {
            const res = await changePassword({ currentPassword: current, newPassword: next }).unwrap();
            setClientToken(res.token);
            toast.success(res.message);
            onClose();
        } catch (err) {
            setError(errMsg(err, "Couldn't change password."));
        }
    };

    const field = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
                    <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Current password</label>
                    <input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">New password (at least 8 characters)</label>
                    <input type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} className={field} />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Confirm new password</label>
                    <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
                </div>
                {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save new password
                </button>
            </form>
        </div>
    );
};

const ClientDashboardPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const hydrated = useHydrated();
    const hasToken = hydrated && Boolean(getClientToken());
    const [range, setRange] = useState<ClientRange>("30d");
    const [showPassword, setShowPassword] = useState(false);
    const [tab, setTab] = useState<ClientTab>("overview");

    const { data: session, error: meError } = useGetClientMeQuery(undefined, { skip: !hasToken });
    const {
        data: summary,
        error: summaryError,
        isFetching,
    } = useGetClientSummaryQuery(range, { skip: !hasToken || !session?.agencyActive || session.billingBlock?.blocked });

    const signedOut = (hydrated && !hasToken) || errStatus(meError) === 401 || errStatus(summaryError) === 401;
    const disabled = errStatus(meError) === 403;

    useEffect(() => {
        if (signedOut) router.replace("/client/login");
    }, [signedOut, router]);

    const signOut = () => {
        clearClientToken();
        dispatch(clientPortalApi.util.resetApiState());
        router.replace("/client/login");
    };

    const reviews = useMemo(() => {
        if (!summary) return [] as (ClientReview & { businessName: string })[];
        return summary.qrCodes
            .flatMap((q) => q.latestReviews.map((r) => ({ ...r, businessName: q.businessName })))
            .sort((a, b) => (b.time || 0) - (a.time || 0))
            .slice(0, 8);
    }, [summary]);

    const maxDaily = Math.max(1, ...(summary?.dailyScans.map((d) => d.count) ?? [0]));
    const totalDevices = summary?.devices.reduce((s, d) => s + d.count, 0) || 0;

    if (!hydrated || signedOut || (!session && !meError)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F7F4]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A6B45]" />
            </div>
        );
    }

    if (disabled || !session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F7F4] p-4">
                <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
                    <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-gray-600">{errMsg(meError, "We couldn't load your dashboard.")}</p>
                    <button onClick={signOut} className="mt-4 text-sm font-semibold text-[#1A6B45] hover:underline">Back to sign in</button>
                </div>
            </div>
        );
    }

    const { client, agency, billingBlock } = session;
    const blocked = Boolean(billingBlock?.blocked);
    const activeTab: ClientTab = blocked ? "payments" : tab;

    return (
        <div className="min-h-screen bg-[#F4F7F4]">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        {agency.picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={agency.picture} alt="" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-xl object-cover" />
                        ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71]">
                                <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{agency.name}</p>
                            <p className="truncate text-xs text-gray-400">Review dashboard for {client.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowPassword(true)}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                            <KeyRound className="h-4 w-4" /> <span className="hidden sm:inline">Change password</span>
                        </button>
                        <button
                            onClick={signOut}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
                {!session.agencyActive ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            Your dashboard is paused right now. Please contact {agency.contactName || agency.name}
                            {agency.email && <> at <a href={`mailto:${agency.email}`} className="font-semibold underline">{agency.email}</a></>}.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Hi {client.name.split(" ")[0]} 👋</h1>
                                <p className="text-sm text-gray-500">Here&apos;s how your review QR codes are doing.</p>
                            </div>
                            {activeTab === "overview" && (
                            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
                                {RANGES.map((r) => (
                                    <button
                                        key={r.key}
                                        onClick={() => setRange(r.key)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            range === r.key ? "bg-[#1A6B45] text-white" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                            )}
                        </div>

                        {blocked ? (
                            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                                <Lock className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        Your dashboard is paused: {formatAmount(billingBlock.overdueAmount, billingBlock.currency)} is overdue by more than{" "}
                                        {billingBlock.blockAfterDays} days.
                                    </p>
                                    <p className="mt-1 text-red-600">
                                        Pay below and tap &quot;I&apos;ve paid&quot;. Everything comes back as soon as {agency.name} confirms your payment. Your QR codes
                                        keep working for customers in the meantime.
                                    </p>
                                </div>
                            </div>
                        ) : billingBlock?.blocksOn ? (
                            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                <p>
                                    <span className="font-semibold">{formatAmount(billingBlock.overdueAmount, billingBlock.currency)} is overdue.</span> Please pay by{" "}
                                    {fmtDate(billingBlock.blocksOn)} or your dashboard will be paused.{" "}
                                    {activeTab !== "payments" && (
                                        <button onClick={() => setTab("payments")} className="font-semibold underline">Pay now</button>
                                    )}
                                </p>
                            </div>
                        ) : null}

                        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Sections">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    disabled={blocked && t.key !== "payments"}
                                    title={blocked && t.key !== "payments" ? "Paused until your overdue payment is confirmed" : undefined}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                        activeTab === t.key ? "bg-white text-[#1A6B45] shadow-sm" : "text-gray-500 hover:bg-white/60 hover:text-gray-800"
                                    }`}
                                >
                                    {blocked && t.key !== "payments" ? <Lock className="h-4 w-4" /> : <t.icon className="h-4 w-4" />}
                                    {t.label}
                                    {t.soon && (
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">Soon</span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {activeTab === "payments" ? (
                            <ClientPayments agency={agency} clientName={client.name} />
                        ) : activeTab === "reviews" ? (
                            <ClientComingSoon
                                icon={MessagesSquare}
                                title="Manage your Google reviews"
                                description="Connect your Google Business Profile and handle every review right here."
                                features={[
                                    "Connect your Google Business Profile securely",
                                    "See all your reviews in one inbox",
                                    "Reply to reviews without leaving this page",
                                    "AI-suggested replies in your tone",
                                    "Get alerts for new and negative reviews",
                                    "Track rating changes over time",
                                ]}
                            />
                        ) : !summary ? (
                            summaryError ? (
                                <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">{errMsg(summaryError, "Couldn't load your stats.")}</div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />)}
                                </div>
                            )
                        ) : activeTab === "qr" ? (
                            <ClientQrCodes qrCodes={summary.qrCodes} />
                        ) : (
                            <div className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <StatCard icon={ScanLine} label={`Scans in the last ${summary.days} days`} value={summary.totals.scans.toLocaleString()} />
                                    <StatCard icon={QrCode} label="All-time scans" value={summary.totals.allTimeScans.toLocaleString()} hint={`${summary.totals.qrCodes} QR code${summary.totals.qrCodes === 1 ? "" : "s"}`} />
                                    <StatCard
                                        icon={Star}
                                        label="Google rating"
                                        value={summary.totals.avgRating ? <span className="flex items-center gap-2">{summary.totals.avgRating.toFixed(1)} <Stars value={summary.totals.avgRating} /></span> : "—"}
                                    />
                                    <StatCard icon={MessageSquare} label="Google reviews" value={summary.totals.totalReviews.toLocaleString()} />
                                </div>

                                {/* Daily scans */}
                                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <p className="mb-4 text-sm font-semibold text-gray-800">Scans per day</p>
                                    <div className="flex h-40 items-end gap-[2px]">
                                        {summary.dailyScans.map((d) => (
                                            <div key={d.date} className="group relative flex h-full flex-1 items-end">
                                                <div
                                                    className="w-full rounded-t bg-gradient-to-t from-[#1A6B45] to-[#2ECC71] transition-opacity group-hover:opacity-80"
                                                    style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / maxDaily) * 100)}%`, opacity: d.count ? 1 : 0.15 }}
                                                />
                                                <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                                                    {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}: {d.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                                        <span>{summary.dailyScans[0] && new Date(summary.dailyScans[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                                        <span>Today</span>
                                    </div>
                                </section>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    {/* QR codes */}
                                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
                                        <p className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-800">Your locations</p>
                                        <ul className="divide-y divide-gray-50">
                                            {summary.qrCodes.map((q) => (
                                                <li key={q.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-gray-900">{q.businessName}</p>
                                                        {q.placeAddress && (
                                                            <p className="flex items-center gap-1 truncate text-xs text-gray-400">
                                                                <MapPin className="h-3 w-3 shrink-0" /> {q.placeAddress}
                                                            </p>
                                                        )}
                                                        <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                            {q.rating ? <><Stars value={q.rating} size={12} /> {q.rating.toFixed(1)}</> : "No rating yet"}
                                                            <span className="text-gray-300">·</span>
                                                            {(q.totalReviews || 0).toLocaleString()} reviews
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-xs text-gray-500">
                                                        <p><span className="font-semibold tabular-nums text-gray-900">{q.scans.toLocaleString()}</span> scans</p>
                                                        <p className="text-gray-400">{q.allTimeScans.toLocaleString()} all time</p>
                                                    </div>
                                                    <a
                                                        href={q.reviewUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1A6B45] hover:bg-[#E8F5EE]"
                                                    >
                                                        Review page <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                        {summary.qrCodes.length === 0 && (
                                            <p className="px-6 py-10 text-center text-sm text-gray-400">No QR codes are shared with you yet.</p>
                                        )}
                                    </section>

                                    {/* Locations + devices */}
                                    <section className="space-y-6">
                                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                            <p className="mb-3 text-sm font-semibold text-gray-800">Where scans come from</p>
                                            {summary.geography.length === 0 ? (
                                                <p className="text-xs text-gray-400">No scans in this period.</p>
                                            ) : (
                                                <ul className="space-y-2">
                                                    {summary.geography.map((g) => (
                                                        <li key={g.city} className="flex items-center justify-between text-sm">
                                                            <span className="flex items-center gap-1.5 truncate text-gray-600"><MapPin className="h-3.5 w-3.5 text-gray-400" />{g.city}</span>
                                                            <span className="font-semibold tabular-nums text-gray-900">{g.count}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        {totalDevices > 0 && (
                                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-800"><Smartphone className="h-4 w-4 text-gray-400" /> Devices</p>
                                                <div className="space-y-2.5">
                                                    {summary.devices.map((d) => (
                                                        <div key={d.type}>
                                                            <div className="mb-1 flex justify-between text-xs text-gray-600">
                                                                <span>{d.type}</span>
                                                                <span className="font-semibold">{Math.round((d.count / totalDevices) * 100)}%</span>
                                                            </div>
                                                            <div className="h-1.5 rounded-full bg-gray-100">
                                                                <div className="h-full rounded-full bg-[#2ECC71]" style={{ width: `${(d.count / totalDevices) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                {/* Latest reviews */}
                                <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <p className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-800">Latest Google reviews</p>
                                    {reviews.length === 0 ? (
                                        <p className="px-6 py-10 text-center text-sm text-gray-400">No reviews to show yet.</p>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {reviews.map((r, i) => (
                                                <li key={`${r.time}-${i}`} className="px-6 py-4">
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                        <span className="font-semibold text-gray-800">{r.authorName || "Google user"}</span>
                                                        <Stars value={r.rating || 0} size={12} />
                                                        <span className="text-gray-300">·</span>
                                                        <span>{reviewDate(r.time)}</span>
                                                        {summary.qrCodes.length > 1 && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">{r.businessName}</span>}
                                                    </div>
                                                    {r.text && <p className="mt-1.5 text-sm text-gray-600">{r.text}</p>}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            </div>
                        )}
                    </>
                )}

                <p className="pb-4 text-center text-[11px] text-gray-400">
                    Shared with you by {agency.name}. Read-only — contact them to make changes.
                </p>
            </main>

            {showPassword && <ChangePasswordDialog onClose={() => setShowPassword(false)} />}
        </div>
    );
};

export default ClientDashboardPage;
