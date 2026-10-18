'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Users,
    UserPlus,
    Mail,
    RefreshCw,
    X,
    Trash2,
    Crown,
    Loader2,
    QrCode,
    ScanLine,
    LogOut,
    ShieldCheck,
    Clock,
    AlertTriangle,
    Check,
    Lock,
    ArrowRight,
} from "lucide-react";
import {
    useGetTeamQuery,
    useInviteMemberMutation,
    useResendInviteMutation,
    useRevokeInviteMutation,
    useRemoveMemberMutation,
    useLeaveTeamMutation,
    type TeamMember,
} from "@/store/api/teamApi";
import { qrApi } from "@/store/api/qrApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { useHydrated } from "@/hooks/useHydrated";
import TeamSeatsCard, { useSeatPaymentReturn } from "@/components/dashboard/TeamSeatsCard";

const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

const timeAgo = (date?: string) => {
    if (!date) return "—";
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
};

const daysLeft = (date: string) => Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));

const Avatar: React.FC<{ name?: string; picture?: string; size?: number }> = ({ name, picture, size = 40 }) =>
    picture ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={picture} alt="" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} referrerPolicy="no-referrer" />
    ) : (
        <div
            className="rounded-full bg-gradient-to-br from-[#2ECC71] to-[#1A6B45] text-white font-semibold flex items-center justify-center shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.36 }}
        >
            {(name || "?").trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
        </div>
    );

const ConfirmDialog: React.FC<{
    title: string;
    body: React.ReactNode;
    confirmLabel: string;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}> = ({ title, body, confirmLabel, loading, onConfirm, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="mt-1.5 text-sm text-gray-500">{body}</div>
            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
);

const Permissions: React.FC = () => (
    <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-[#F3FAF6] p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1A6B45]">Team members can</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
                {["Create QR codes for their clients", "Edit, pause & download their own QRs", "See scans & analytics of their own QRs", "Use all Agency features (logo, white-label…)"].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2ECC71]" />{t}</li>
                ))}
            </ul>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Only the owner can</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
                {["See every QR in the agency", "Pay, renew or change the plan", "Invite or remove team members", "See other members' clients"].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />{t}</li>
                ))}
            </ul>
        </div>
    </div>
);

// ─── Staff view ───────────────────────────────────────────────────────────────
const StaffView: React.FC = () => {
    const user = useAppSelector((s) => s.auth.user);
    const accessToken = useAppSelector((s) => s.auth.accessToken);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [confirmLeave, setConfirmLeave] = useState(false);
    const [leaveTeam, { isLoading }] = useLeaveTeamMutation();

    const team = user?.team?.role === "staff" ? user.team : null;
    const owner = team?.owner;

    const handleLeave = async () => {
        try {
            const res = await leaveTeam().unwrap();
            if (accessToken) dispatch(setCredentials({ user: res.user, accessToken }));
            dispatch(qrApi.util.invalidateTags(["QRCode"]));
            toast.success(res.message);
            router.push("/dashboard/standees");
        } catch (err) {
            toast.error(errMsg(err, "Couldn't leave the team"));
        } finally {
            setConfirmLeave(false);
        }
    };

    return (
        <div className="space-y-5">
            {team && !team.active && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        Your agency&apos;s Agency plan isn&apos;t active right now, so you can&apos;t create or manage QR codes.
                        Ask {owner?.name || "your agency owner"} to renew it.
                    </p>
                </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Your agency</p>
                <div className="flex flex-wrap items-center gap-4">
                    <Avatar name={owner?.name} picture={owner?.picture} size={56} />
                    <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold text-gray-900">{owner?.businessName || owner?.name || "Agency"}</p>
                        <p className="text-sm text-gray-500">
                            Owner: {owner?.name} · {owner?.email}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#E8F5EE] px-2.5 py-0.5 text-xs font-semibold text-[#1A6B45]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Team member
                            {team?.joinedAt && <span className="font-normal text-[#1A6B45]/70">· joined {timeAgo(team.joinedAt)}</span>}
                        </p>
                    </div>
                    <button
                        onClick={() => setConfirmLeave(true)}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" /> Leave team
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-800">What you can do</p>
                <Permissions />
            </div>

            {confirmLeave && (
                <ConfirmDialog
                    title="Leave this team?"
                    body={<>You&apos;ll lose access to the QR codes you created — they stay with {owner?.name || "the agency"}. You can be invited again later.</>}
                    confirmLabel="Leave team"
                    loading={isLoading}
                    onConfirm={handleLeave}
                    onClose={() => setConfirmLeave(false)}
                />
            )}
        </div>
    );
};

// ─── Owner view ───────────────────────────────────────────────────────────────
const OwnerView: React.FC = () => {
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useGetTeamQuery();
    const [email, setEmail] = useState("");
    const [invite, { isLoading: inviting }] = useInviteMemberMutation();
    const [resend, { isLoading: resending, originalArgs: resendingId }] = useResendInviteMutation();
    const [revoke] = useRevokeInviteMutation();
    const [remove, { isLoading: removing }] = useRemoveMemberMutation();
    const [toRemove, setToRemove] = useState<TeamMember | null>(null);
    useSeatPaymentReturn(refetch);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />)}
            </div>
        );
    }
    if (isError || !data || data.role !== "owner") {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-sm text-gray-500">Couldn&apos;t load your team.</p>
                <button onClick={() => refetch()} className="mt-3 text-sm font-semibold text-[#1A6B45] hover:underline">Try again</button>
            </div>
        );
    }

    if (!data.canManage && data.members.length === 0) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] shadow-lg shadow-[#1A6B45]/25">
                    <Users className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Work together with your team</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    The Agency plan includes {data.seats.included} team member{data.seats.included === 1 ? "" : "s"}
                    {data.seats.max > data.seats.included && <>, and you can add extra seats for up to {data.seats.max}</>}. Each person
                    logs in with their own account and manages QR codes for their own clients.
                </p>
                <div className="mx-auto mt-6 max-w-2xl text-left"><Permissions /></div>
                <button
                    onClick={() => router.push("/pricing")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                >
                    Upgrade to Agency <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        );
    }

    const seatsFull = data.seatsUsed >= data.seatLimit;

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) return;
        try {
            const res = await invite({ email: value }).unwrap();
            toast.success(res.message);
            setEmail("");
        } catch (err) {
            toast.error(errMsg(err, "Couldn't send the invite"));
        }
    };

    const handleRemove = async () => {
        if (!toRemove) return;
        try {
            const res = await remove(toRemove._id).unwrap();
            toast.success(res.message);
        } catch (err) {
            toast.error(errMsg(err, "Couldn't remove member"));
        } finally {
            setToRemove(null);
        }
    };

    return (
        <div className="space-y-5">
            {!data.canManage && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>Your Agency plan isn&apos;t active, so your team members can&apos;t work right now. Renew to restore their access.</p>
                </div>
            )}

            {/* Seats + invite */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Team seats</p>
                        <p className="mt-0.5 text-xs text-gray-400">Pending invites count as a seat until they&apos;re accepted or cancelled.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: data.seatLimit }).map((_, i) => (
                            <span
                                key={i}
                                className={`h-2.5 ${data.seatLimit > 5 ? "w-5" : "w-10"} rounded-full transition-colors ${i < data.members.length ? "bg-[#1A6B45]" : i < data.seatsUsed ? "bg-[#2ECC71]/50" : "bg-gray-100"}`}
                            />
                        ))}
                        <span className="ml-1 text-sm font-semibold tabular-nums text-gray-700">{data.seatsUsed}/{data.seatLimit}</span>
                    </div>
                </div>

                <form onSubmit={handleInvite} className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="teammate@youragency.com"
                            disabled={seatsFull || !data.canManage}
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 disabled:bg-gray-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={inviting || seatsFull || !data.canManage || !email.trim()}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#165a3a] disabled:opacity-50"
                    >
                        {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                        Send invite
                    </button>
                </form>
                {seatsFull && (
                    <p className="mt-2 text-xs text-amber-600">
                        All seats are used.{" "}
                        {data.seatLimit < data.seats.max ? (
                            <button
                                type="button"
                                onClick={() => document.getElementById("team-seats")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                                className="font-semibold underline underline-offset-2 hover:text-amber-700"
                            >
                                Add a seat
                            </button>
                        ) : (
                            "Remove a member or cancel an invite"
                        )}{" "}
                        to invite someone else.
                    </p>
                )}
            </div>

            <TeamSeatsCard seats={data.seats} seatsUsed={data.seatsUsed} canManage={data.canManage} onChanged={refetch} />

            {/* Members */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">Members</p>
                    <span className="text-xs text-gray-400">{data.members.length + 1} people</span>
                </div>

                <ul className="divide-y divide-gray-50">
                    <li className="flex flex-wrap items-center gap-4 px-6 py-4">
                        <Avatar name={data.owner.name} picture={data.owner.picture} />
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                {data.owner.name}
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600">
                                    <Crown className="h-3 w-3" /> Owner
                                </span>
                            </p>
                            <p className="truncate text-xs text-gray-400">{data.owner.email}</p>
                        </div>
                        <Stat icon={QrCode} value={data.owner.qrCount} label="QRs" />
                        <Stat icon={ScanLine} value={data.owner.totalScans} label="scans" />
                        <button
                            onClick={() => router.push("/dashboard/standees?member=me")}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1A6B45] hover:bg-[#E8F5EE]"
                        >
                            View QRs
                        </button>
                    </li>

                    {data.members.map((m) => (
                        <li key={m._id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                            <Avatar name={m.name} picture={m.picture} />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                                <p className="truncate text-xs text-gray-400">
                                    {m.email} · joined {timeAgo(m.teamJoinedAt)}
                                    {m.lastLoginAt && <> · active {timeAgo(m.lastLoginAt)}</>}
                                </p>
                            </div>
                            <Stat icon={QrCode} value={m.qrCount} label="QRs" />
                            <Stat icon={ScanLine} value={m.totalScans} label="scans" />
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => router.push(`/dashboard/standees?member=${m._id}`)}
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1A6B45] hover:bg-[#E8F5EE]"
                                >
                                    View QRs
                                </button>
                                <button
                                    onClick={() => setToRemove(m)}
                                    title="Remove from team"
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {data.members.length === 0 && (
                    <div className="border-t border-gray-50 px-6 py-8 text-center">
                        <Users className="mx-auto mb-2 h-7 w-7 text-gray-200" />
                        <p className="text-sm text-gray-400">No team members yet. Invite someone above.</p>
                    </div>
                )}
            </div>

            {/* Pending invites */}
            {data.invites.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">Pending invites</p>
                    </div>
                    <ul className="divide-y divide-gray-50">
                        {data.invites.map((inv) => (
                            <li key={inv._id} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-800">{inv.email}</p>
                                    <p className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="h-3 w-3" /> Sent {timeAgo(inv.lastSentAt || inv.createdAt)} · expires in {daysLeft(inv.expiresAt)}d
                                    </p>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            toast.success((await resend(inv._id).unwrap()).message);
                                        } catch (err) {
                                            toast.error(errMsg(err, "Couldn't resend"));
                                        }
                                    }}
                                    disabled={resending && resendingId === inv._id}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${resending && resendingId === inv._id ? "animate-spin" : ""}`} /> Resend
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            toast.success((await revoke(inv._id).unwrap()).message);
                                        } catch (err) {
                                            toast.error(errMsg(err, "Couldn't cancel"));
                                        }
                                    }}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    <X className="h-3.5 w-3.5" /> Cancel
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-gray-800">How roles work</p>
                <Permissions />
            </div>

            {toRemove && (
                <ConfirmDialog
                    title={`Remove ${toRemove.name}?`}
                    body={<>They&apos;ll lose access immediately. The {toRemove.qrCount} QR code{toRemove.qrCount === 1 ? "" : "s"} they created stay in your account and keep working.</>}
                    confirmLabel="Remove"
                    loading={removing}
                    onConfirm={handleRemove}
                    onClose={() => setToRemove(null)}
                />
            )}
        </div>
    );
};

const Stat: React.FC<{ icon: React.ElementType; value: number; label: string }> = ({ icon: Icon, value, label }) => (
    <div className="hidden items-center gap-1.5 text-xs text-gray-500 sm:flex">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-semibold tabular-nums text-gray-800">{value.toLocaleString()}</span> {label}
    </div>
);

const TeamPage: React.FC = () => {
    const hydrated = useHydrated();
    const user = useAppSelector((s) => s.auth.user);
    const isStaff = hydrated && user?.team?.role === "staff";

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-8">
            <div className="mb-6">
                <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800 sm:text-[22px]">
                    <Users className="h-6 w-6 text-[#1A6B45]" /> Team
                </h1>
                <p className="mt-0.5 text-sm text-gray-400">
                    {isStaff ? "The agency you work with" : "Invite your staff — each person sees only the QR codes they create"}
                </p>
            </div>
            {!hydrated ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : isStaff ? <StaffView /> : <OwnerView />}
        </div>
    );
};

export default TeamPage;
