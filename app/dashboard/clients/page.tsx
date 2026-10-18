'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    AlertTriangle,
    ArrowRight,
    Ban,
    Check,
    ChevronRight,
    Copy,
    ExternalLink,
    KeyRound,
    Loader2,
    Pencil,
    Trash2,
    UserPlus,
    Info,
    Lock,
    UserRound,
    Wallet,
} from "lucide-react";
import PaymentMethodsDialog from "@/components/dashboard/clients/PaymentMethodsDialog";
import { fmtDate } from "@/components/client/billingUi";
import { BLOCK_AFTER_DAYS, formatAmount } from "@/lib/money";
import { AGENCY_FEATURES, type AgencyFeatureKey } from "@/lib/agencyFeatures";
import {
    useDeleteClientMutation,
    useListClientsQuery,
    useUpdateClientMutation,
    type AgencyClient,
} from "@/store/api/clientsApi";
import { useAppSelector } from "@/store/hooks";
import {
    ClientFormDialog,
    CredentialsDialog,
    Modal,
    ResetDialog,
    copy,
    errMsg,
    timeAgo,
    type Credentials,
} from "@/components/dashboard/clients/ClientDialogs";

const CLIENT_UPSELL_KEYS: AgencyFeatureKey[] = ["clientLogins", "billing", "payments", "autoBlock"];

const ClientsPage: React.FC = () => {
    const router = useRouter();
    const user = useAppSelector((s) => s.auth.user);
    const isStaff = user?.team?.role === "staff";
    const { data, isLoading, isError, refetch } = useListClientsQuery();
    const [updateClient] = useUpdateClientMutation();
    const [deleteClient, { isLoading: deleting }] = useDeleteClientMutation();

    const [formFor, setFormFor] = useState<AgencyClient | "new" | null>(null);
    const [resetFor, setResetFor] = useState<AgencyClient | null>(null);
    const [deleteFor, setDeleteFor] = useState<AgencyClient | null>(null);
    const [creds, setCreds] = useState<Credentials | null>(null);
    const [showMethods, setShowMethods] = useState(false);
    const totalPending = (data?.clients || []).reduce((s, c) => s + (c.pendingClaims || 0), 0);

    const toggleStatus = async (c: AgencyClient) => {
        try {
            const res = await updateClient({ id: c._id, status: c.status === "active" ? "disabled" : "active" }).unwrap();
            toast.success(res.message);
        } catch (err) {
            toast.error(errMsg(err, "Couldn't update the client"));
        }
    };

    const handleDelete = async () => {
        if (!deleteFor) return;
        try {
            toast.success((await deleteClient(deleteFor._id).unwrap()).message);
        } catch (err) {
            toast.error(errMsg(err, "Couldn't delete the client"));
        } finally {
            setDeleteFor(null);
        }
    };

    const body = () => {
        if (isLoading) {
            return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)}</div>;
        }
        if (isError || !data) {
            return (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                    <p className="text-sm text-gray-500">Couldn&apos;t load your clients.</p>
                    <button onClick={() => refetch()} className="mt-3 text-sm font-semibold text-[#1A6B45] hover:underline">Try again</button>
                </div>
            );
        }
        if (!data.canManage && data.clients.length === 0) {
            return (
                <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] shadow-lg shadow-[#1A6B45]/25">
                        <UserRound className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Give your clients their own login</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        With the Agency plan, each client gets an email and password for a read-only dashboard showing scans, Google rating
                        and latest reviews for just their QR codes.
                    </p>
                    <ul className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
                        {AGENCY_FEATURES.filter((f) => CLIENT_UPSELL_KEYS.includes(f.key)).map((f) => (
                            <li key={f.key} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{f.description}</p>
                            </li>
                        ))}
                    </ul>
                    {!isStaff && (
                        <button
                            onClick={() => router.push("/pricing")}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                        >
                            Upgrade to Agency <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-5">
                {!data.canManage && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        <p>The Agency plan isn&apos;t active, so client dashboards are paused and you can&apos;t add or change logins until it&apos;s renewed.</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="min-w-0 text-sm text-gray-500">
                        Client login page:{" "}
                        <a href={data.loginUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#1A6B45] hover:underline">
                            {data.loginUrl.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                        </a>
                        <button onClick={() => copy(data.loginUrl, "Link copied")} className="ml-1 rounded p-1 text-gray-400 hover:text-[#1A6B45]" aria-label="Copy login link">
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowMethods(true)}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <Wallet className="h-4 w-4" /> Payment methods
                        </button>
                        <button
                            onClick={() => setFormFor("new")}
                            disabled={!data.canManage}
                            className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-50"
                        >
                            <UserPlus className="h-4 w-4" /> Add client
                        </button>
                    </div>
                </div>

                {totalPending > 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <Wallet className="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            {isStaff ? (
                                <>
                                    <span className="font-semibold">{totalPending} payment{totalPending === 1 ? "" : "s"} reported by your clients.</span>{" "}
                                    Your agency owner will confirm {totalPending === 1 ? "it" : "them"}.
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold">{totalPending} payment{totalPending === 1 ? "" : "s"} waiting for your confirmation.</span>{" "}
                                    Open the clients marked &quot;to confirm&quot; below to confirm or reject them.
                                </>
                            )}
                        </p>
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">Client logins</p>
                        <span className="text-xs text-gray-400">{data.clients.length} total</span>
                    </div>
                    <p className="flex items-center gap-1.5 border-b border-gray-50 bg-gray-50/60 px-6 py-2 text-[11px] text-gray-500">
                        <Info className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        A client&apos;s dashboard is blocked automatically {BLOCK_AFTER_DAYS} days after a missed payment, and unblocks once the payment is
                        recorded. QR codes keep working.
                    </p>
                    {data.clients.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <UserRound className="mx-auto mb-2 h-7 w-7 text-gray-200" />
                            <p className="text-sm text-gray-400">No client logins yet. Add one to share a dashboard.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {data.clients.map((c) => (
                                <li key={c._id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5EE] text-sm font-semibold text-[#1A6B45]">
                                        {c.name.trim().charAt(0).toUpperCase()}
                                    </div>
                                    <Link href={`/dashboard/clients/${c._id}`} className="group min-w-0 flex-1">
                                        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-[#1A6B45]">
                                            {c.name}
                                            {c.status === "disabled" && (
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">Disabled</span>
                                            )}
                                            {c.pendingClaims > 0 && (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                                    {c.pendingClaims} payment{c.pendingClaims === 1 ? "" : "s"} to confirm
                                                </span>
                                            )}
                                            {c.billingBlock?.blocked ? (
                                                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                                                    <Lock className="h-3 w-3" /> Blocked · {formatAmount(c.billingBlock.overdueAmount, c.billingCurrency)} unpaid
                                                </span>
                                            ) : c.billingBlock?.blocksOn ? (
                                                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-700">
                                                    Overdue · blocks {fmtDate(c.billingBlock.blocksOn)}
                                                </span>
                                            ) : null}
                                        </p>
                                        <p className="truncate text-xs text-gray-400">
                                            {c.email} · last login {timeAgo(c.lastLoginAt)}
                                            {!isStaff && c.createdBy && <> · added by {c.createdBy.name}</>}
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {c.qrCodes.map((q) => (
                                                <span key={q._id} className="max-w-[180px] truncate rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{q.businessName}</span>
                                            ))}
                                            {c.qrCodes.length === 0 && <span className="text-[11px] text-amber-600">No QR codes shared</span>}
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-0.5">
                                        <Link
                                            href={`/dashboard/clients/${c._id}`}
                                            className="mr-1 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1A6B45] hover:bg-[#E8F5EE]"
                                        >
                                            View details <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                        {!isStaff && <IconButton title="Edit" disabled={!data.canManage} onClick={() => setFormFor(c)}><Pencil className="h-4 w-4" /></IconButton>}
                                        <IconButton title="Reset password" disabled={!data.canManage} onClick={() => setResetFor(c)}><KeyRound className="h-4 w-4" /></IconButton>
                                        {!isStaff && (
                                            <>
                                                <IconButton title={c.status === "active" ? "Disable login" : "Enable login"} disabled={!data.canManage && c.status !== "active"} onClick={() => toggleStatus(c)}>
                                                    {c.status === "active" ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                                </IconButton>
                                                <IconButton title="Delete" danger onClick={() => setDeleteFor(c)}><Trash2 className="h-4 w-4" /></IconButton>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-8">
            <div className="mb-6">
                <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800 sm:text-[22px]">
                    <UserRound className="h-6 w-6 text-[#1A6B45]" /> Clients
                </h1>
                <p className="mt-0.5 text-sm text-gray-400">
                    {isStaff ? "Logins for the clients you manage" : "Give each client a read-only login to see their own QR stats and reviews"}
                </p>
            </div>

            {body()}

            {formFor && (
                <ClientFormDialog
                    key={formFor === "new" ? "new" : formFor._id}
                    client={formFor === "new" ? undefined : formFor}
                    onClose={() => setFormFor(null)}
                    onCreated={(c) => {
                        setFormFor(null);
                        setCreds(c);
                    }}
                />
            )}
            {resetFor && (
                <ResetDialog
                    client={resetFor}
                    onClose={() => setResetFor(null)}
                    onDone={(c) => {
                        setResetFor(null);
                        setCreds(c);
                    }}
                />
            )}
            {creds && <CredentialsDialog creds={creds} onClose={() => setCreds(null)} />}
            {showMethods && <PaymentMethodsDialog onClose={() => setShowMethods(false)} />}
            {deleteFor && (
                <Modal title={`Delete ${deleteFor.name}?`} onClose={() => setDeleteFor(null)}>
                    <p className="text-sm text-gray-500">Their login stops working immediately. Your QR codes aren&apos;t affected.</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setDeleteFor(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const IconButton: React.FC<{ title: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }> = ({ title, onClick, disabled, danger, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        className={`rounded-lg p-2 text-gray-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            danger ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-gray-100 hover:text-gray-700"
        }`}
    >
        {children}
    </button>
);

export default ClientsPage;
