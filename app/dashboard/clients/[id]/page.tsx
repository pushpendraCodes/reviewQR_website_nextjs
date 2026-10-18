'use client';

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    AlertTriangle,
    ArrowLeft,
    Ban,
    CalendarClock,
    Check,
    CheckCircle2,
    Copy,
    Download,
    ExternalLink,
    Info,
    Lock,
    KeyRound,
    Loader2,
    MapPin,
    Pencil,
    Plus,
    Receipt,
    Trash2,
    Wallet,
} from "lucide-react";
import {
    useDeleteClientMutation,
    useDeleteClientPaymentMutation,
    useGetClientQuery,
    useRecordClientPaymentMutation,
    useUpdateClientBillingMutation,
    useUpdateClientMutation,
} from "@/store/api/clientsApi";
import type { BillingCurrency, ClientBillingPlan, ClientPayment } from "@/store/api/clientPortalApi";
import { qrApi } from "@/store/api/qrApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    ClientFormDialog,
    CredentialsDialog,
    Modal,
    ResetDialog,
    copy,
    errMsg,
    field,
    timeAgo,
    type Credentials,
} from "@/components/dashboard/clients/ClientDialogs";
import ClaimsPanel from "@/components/dashboard/clients/ClaimsPanel";
import { Stat, StatusBadge, downloadPaymentsCsv, dueText, fmtDate } from "@/components/client/billingUi";
import { BILLING_CURRENCIES, currencySymbol, formatAmount } from "@/lib/money";

const pad = (n: number) => String(n).padStart(2, "0");
const toInputDate = (d: string | Date | null) => {
    if (!d) return "";
    const x = new Date(d);
    return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};
/** Noon local time so the stored date never slips a day across time zones. */
const fromInputDate = (v: string) => (v ? new Date(`${v}T12:00:00`).toISOString() : null);

// ─── Editable billing row per location ────────────────────────────────────────
const PlanRow: React.FC<{
    clientId: string;
    plan: ClientBillingPlan;
    currency: string;
    canManage: boolean;
    onRecord: (qrId: string) => void;
    onSaved: () => void;
}> = ({ clientId, plan, currency, canManage, onRecord, onSaved }) => {
    const [planType, setPlanType] = useState(plan.planType);
    const [price, setPrice] = useState(plan.price ? String(plan.price) : "");
    const [due, setDue] = useState(toInputDate(plan.nextPaymentDate));
    const [save, { isLoading }] = useUpdateClientBillingMutation();

    const dirty = planType !== plan.planType || Number(price || 0) !== plan.price || due !== toInputDate(plan.nextPaymentDate);

    const handleSave = async () => {
        const n = Number(price || 0);
        if (!Number.isFinite(n) || n < 0) return toast.error("Enter a valid amount");
        try {
            const res = await save({ id: clientId, qrId: plan.id, planType, price: n, nextPaymentDate: fromInputDate(due) }).unwrap();
            toast.success(res.message);
            onSaved();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't save billing"));
        }
    };

    const input = "rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 disabled:bg-gray-50";

    return (
        <li className={`px-6 py-4 ${plan.status === "overdue" ? "bg-red-50/40" : ""}`}>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{plan.businessName}</p>
                    {plan.placeAddress && (
                        <p className="flex items-center gap-1 truncate text-xs text-gray-400"><MapPin className="h-3 w-3 shrink-0" />{plan.placeAddress}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={plan.status} />
                    {dueText(plan) && <span className="text-[11px] text-gray-500">{dueText(plan)}</span>}
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500">Plan</span>
                    <select value={planType} disabled={!canManage} onChange={(e) => setPlanType(e.target.value as ClientBillingPlan["planType"])} className={input}>
                        <option value="none">No plan</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500">Amount ({currencySymbol(currency)})</span>
                    <input type="number" min={0} step="0.01" value={price} disabled={!canManage} onChange={(e) => setPrice(e.target.value)} placeholder="0" className={`${input} w-28`} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-gray-500">Next due date</span>
                    <input type="date" value={due} disabled={!canManage} onChange={(e) => setDue(e.target.value)} className={input} />
                </label>
                <button
                    onClick={handleSave}
                    disabled={!canManage || !dirty || isLoading}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1A6B45] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-40"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
                </button>
                <button
                    onClick={() => onRecord(plan.id)}
                    disabled={!canManage}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                    <Plus className="h-4 w-4" /> Record payment
                </button>
                <div className="ml-auto text-right text-xs text-gray-500">
                    <p><span className="font-semibold tabular-nums text-gray-900">{formatAmount(plan.totalPaid, currency)}</span> paid</p>
                    <p className="text-gray-400">{plan.lastPaymentAt ? `Last ${fmtDate(plan.lastPaymentAt)}` : "No payments yet"}</p>
                </div>
            </div>
        </li>
    );
};

// ─── Record payment ───────────────────────────────────────────────────────────
const RecordPaymentDialog: React.FC<{
    clientId: string;
    plans: ClientBillingPlan[];
    currency: string;
    defaultQrId: string;
    onClose: () => void;
    onSaved: () => void;
}> = ({ clientId, plans, currency, defaultQrId, onClose, onSaved }) => {
    const initial = plans.find((p) => p.id === defaultQrId) || plans[0];
    const [qrId, setQrId] = useState(initial?.id || "");
    const [amount, setAmount] = useState(initial?.price ? String(initial.price) : "");
    const [date, setDate] = useState(toInputDate(new Date()));
    const [notes, setNotes] = useState("");
    const [advance, setAdvance] = useState(Boolean(initial && initial.planType !== "none"));
    const [record, { isLoading }] = useRecordClientPaymentMutation();

    const plan = plans.find((p) => p.id === qrId);
    const nextDuePreview = useMemo(() => {
        const from = plan?.nextPaymentDate || fromInputDate(date);
        if (!plan || plan.planType === "none" || !from) return null;
        const base = new Date(from);
        if (plan.planType === "yearly") base.setFullYear(base.getFullYear() + 1);
        else base.setMonth(base.getMonth() + 1);
        return base.toISOString();
    }, [plan, date]);

    const pickQr = (id: string) => {
        setQrId(id);
        const p = plans.find((x) => x.id === id);
        if (p?.price) setAmount(String(p.price));
        setAdvance(Boolean(p && p.planType !== "none"));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const n = Number(amount);
        if (!qrId) return toast.error("Pick a location");
        if (!Number.isFinite(n) || n <= 0) return toast.error("Enter the amount received");
        try {
            const res = await record({
                id: clientId,
                qrId,
                amount: n,
                date: fromInputDate(date) || undefined,
                notes: notes.trim(),
                advanceDueDate: advance && plan?.planType !== "none",
            }).unwrap();
            toast.success(res.message);
            onSaved();
            onClose();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't record the payment"));
        }
    };

    return (
        <Modal title="Record a payment" onClose={onClose} wide>
            <form onSubmit={submit} className="space-y-4">
                {plans.length > 1 && (
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Location</label>
                        <select value={qrId} onChange={(e) => pickQr(e.target.value)} className={field}>
                            {plans.map((p) => <option key={p.id} value={p.id}>{p.businessName}</option>)}
                        </select>
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Amount received ({currencySymbol(currency)})</label>
                        <input type="number" min={0} step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className={field} autoFocus />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Payment date</label>
                        <input type="date" required value={date} max={toInputDate(new Date())} onChange={(e) => setDate(e.target.value)} className={field} />
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Notes (optional)</label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} placeholder="e.g. UPI · ref 4521, Cash, Bank transfer" className={field} />
                </div>
                {plan && plan.planType !== "none" && (
                    <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                        <input type="checkbox" checked={advance} onChange={(e) => setAdvance(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1A6B45]" />
                        <span>
                            Move the next due date forward by one {plan.planType === "yearly" ? "year" : "month"}
                            {nextDuePreview && <span className="block text-xs text-gray-400">New due date: {fmtDate(nextDuePreview)}</span>}
                        </span>
                    </label>
                )}
                <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Record payment
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ClientDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isStaff = useAppSelector((s) => s.auth.user?.team?.role === "staff");
    const { data, isLoading, isError, refetch } = useGetClientQuery(id, { skip: !id });
    const [updateClient] = useUpdateClientMutation();
    const [deleteClient, { isLoading: deleting }] = useDeleteClientMutation();
    const [deletePayment, { isLoading: deletingPayment }] = useDeleteClientPaymentMutation();

    const [editing, setEditing] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [creds, setCreds] = useState<Credentials | null>(null);
    const [recordFor, setRecordFor] = useState<string | null>(null);
    const [paymentToDelete, setPaymentToDelete] = useState<ClientPayment | null>(null);
    const [location, setLocation] = useState("all");

    const payments = useMemo(
        () => (data?.billing.payments || []).filter((p) => location === "all" || p.qrId === location),
        [data, location]
    );

    const qrChanged = () => dispatch(qrApi.util.invalidateTags(["QRCode"]));

    if (isLoading) {
        return (
            <div className="mx-auto mt-10 max-w-5xl space-y-4 px-4 pb-10 pt-5 sm:px-6 lg:px-8">
                {[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />)}
            </div>
        );
    }
    if (isError || !data) {
        return (
            <div className="mx-auto mt-10 max-w-5xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                    <p className="text-sm text-gray-500">Couldn&apos;t load this client. It may have been deleted.</p>
                    <div className="mt-3 flex justify-center gap-4">
                        <button onClick={() => refetch()} className="text-sm font-semibold text-[#1A6B45] hover:underline">Try again</button>
                        <Link href="/dashboard/clients" className="text-sm font-semibold text-gray-500 hover:underline">Back to clients</Link>
                    </div>
                </div>
            </div>
        );
    }

    const { client, billing, claims, canManage } = data;
    const canEdit = data.canEdit ?? (canManage && !isStaff);
    const { totals, plans, currency } = billing;
    const block = billing.block;
    const money = (n: number) => formatAmount(n, currency);

    const changeCurrency = async (next: BillingCurrency) => {
        try {
            await updateClient({ id: client._id, billingCurrency: next }).unwrap();
            toast.success(`Billing currency set to ${next}`);
        } catch (err) {
            toast.error(errMsg(err, "Couldn't change the currency"));
        }
    };

    const toggleStatus = async () => {
        try {
            const res = await updateClient({ id: client._id, status: client.status === "active" ? "disabled" : "active" }).unwrap();
            toast.success(res.message);
        } catch (err) {
            toast.error(errMsg(err, "Couldn't update the client"));
        }
    };

    const handleDelete = async () => {
        try {
            toast.success((await deleteClient(client._id).unwrap()).message);
            router.push("/dashboard/clients");
        } catch (err) {
            toast.error(errMsg(err, "Couldn't delete the client"));
            setConfirmDelete(false);
        }
    };

    const handleDeletePayment = async () => {
        if (!paymentToDelete) return;
        try {
            const res = await deletePayment({ id: client._id, qrId: paymentToDelete.qrId, paymentId: paymentToDelete.id }).unwrap();
            toast.success(res.message);
            qrChanged();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't delete the payment"));
        } finally {
            setPaymentToDelete(null);
        }
    };

    const actionBtn = "flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <div className="mx-auto mt-10 max-w-5xl space-y-6 px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-8">
            <Link href="/dashboard/clients" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B45]">
                <ArrowLeft className="h-4 w-4" /> All clients
            </Link>

            {!canManage ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>The Agency plan isn&apos;t active, so you can view this client but can&apos;t change billing or record payments until it&apos;s renewed.</p>
                </div>
            ) : isStaff ? (
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <p>You can view this client and reset their password. Billing, payments and payment approvals are handled by your agency owner.</p>
                </div>
            ) : null}

            {/* Client header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] text-xl font-bold text-white">
                        {client.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="flex flex-wrap items-center gap-2 text-xl font-semibold text-gray-900">
                            {client.name}
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${client.status === "active" ? "bg-[#E8F5EE] text-[#1A6B45]" : "bg-gray-100 text-gray-500"}`}>
                                {client.status === "active" ? "Login active" : "Login disabled"}
                            </span>
                        </h1>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                            {client.email}
                            <button onClick={() => copy(client.email, "Email copied")} className="rounded p-0.5 text-gray-400 hover:text-[#1A6B45]" aria-label="Copy email">
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Added {fmtDate(client.createdAt)} · last login {timeAgo(client.lastLoginAt)}
                            {!isStaff && client.createdBy && <> · by {client.createdBy.name}</>}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {!isStaff && <button onClick={() => setEditing(true)} disabled={!canManage} className={actionBtn}><Pencil className="h-3.5 w-3.5" /> Edit</button>}
                        <button onClick={() => setResetting(true)} disabled={!canManage} className={actionBtn}><KeyRound className="h-3.5 w-3.5" /> Reset password</button>
                        {!isStaff && (
                            <>
                                <button onClick={toggleStatus} disabled={!canManage && client.status !== "active"} className={actionBtn}>
                                    {client.status === "active" ? <><Ban className="h-3.5 w-3.5" /> Disable</> : <><Check className="h-3.5 w-3.5" /> Enable</>}
                                </button>
                                <button onClick={() => setConfirmDelete(true)} className={`${actionBtn} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-4 text-xs text-gray-500">
                    Client login page:
                    <a href={data.loginUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#1A6B45] hover:underline">
                        {data.loginUrl.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                    </a>
                    <button onClick={() => copy(data.loginUrl, "Link copied")} className="rounded p-0.5 text-gray-400 hover:text-[#1A6B45]" aria-label="Copy login link">
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {block?.blocked ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        <span className="font-semibold">Dashboard blocked since {fmtDate(block.blockedSince)}</span>: {money(block.overdueAmount)} has been
                        overdue for more than {block.blockAfterDays} days. The client can still see payment options and report a payment. It unblocks
                        automatically once you record or confirm the payment and the due date moves forward. Their QR codes keep working.
                    </p>
                </div>
            ) : totals.overdueCount > 0 ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                        <span className="font-semibold">{money(totals.overdueAmount)} overdue</span> across {totals.overdueCount} location
                        {totals.overdueCount === 1 ? "" : "s"}. The client sees this on their dashboard too.
                        {block?.blocksOn && (
                            <> If it&apos;s still unpaid, their dashboard will be <span className="font-semibold">blocked on {fmtDate(block.blocksOn)}</span>.</>
                        )}
                    </p>
                </div>
            ) : null}

            <ClaimsPanel clientId={client._id} claims={claims} plans={plans} canManage={canEdit} onConfirmed={qrChanged} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    icon={Wallet}
                    label="Amount due now"
                    value={money(totals.amountDue)}
                    hint={totals.amountDue > 0 ? "Overdue or due within 7 days" : "Nothing due right now"}
                    tone={totals.overdueCount > 0 ? "red" : totals.amountDue > 0 ? "amber" : undefined}
                />
                <Stat
                    icon={CalendarClock}
                    label="Next payment"
                    value={totals.nextDue ? fmtDate(totals.nextDue.date) : "—"}
                    hint={totals.nextDue ? `${money(totals.nextDue.amount)} · ${totals.nextDue.businessName}` : "No due date set"}
                />
                <Stat icon={CheckCircle2} label="Total received" value={money(totals.totalPaid)} hint={`${totals.paymentsCount} payment${totals.paymentsCount === 1 ? "" : "s"}`} />
                <Stat
                    icon={Receipt}
                    label={`Received in ${new Date().getFullYear()}`}
                    value={money(totals.paidThisYear)}
                    hint={totals.lastPayment ? `Last: ${money(totals.lastPayment.amount)} on ${fmtDate(totals.lastPayment.date)}` : undefined}
                />
            </div>

            {/* Billing per location */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Billing by location</p>
                        <p className="text-xs text-gray-400">Set the plan, amount and next due date for each QR code shared with this client.</p>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                            <Info className="h-3 w-3 shrink-0" /> Dashboard is blocked automatically {block?.blockAfterDays ?? 15} days after a missed due date.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-gray-500">
                            Currency
                            <select
                                value={currency}
                                disabled={!canEdit}
                                onChange={(e) => changeCurrency(e.target.value as BillingCurrency)}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 focus:border-[#1A6B45] focus:outline-none disabled:bg-gray-50"
                                title="Currency this client is billed in. UPI is only offered for INR."
                            >
                                {BILLING_CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.label}</option>)}
                            </select>
                        </label>
                        {plans.length > 0 && canEdit && (
                            <button
                                onClick={() => setRecordFor(plans[0].id)}
                                className="flex items-center gap-1.5 rounded-xl bg-[#1A6B45] px-4 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" /> Record payment
                            </button>
                        )}
                    </div>
                </div>
                {plans.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-gray-400">No QR codes are shared with this client. Use Edit to add some.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {plans.map((p) => (
                            <PlanRow
                                key={`${p.id}-${p.planType}-${p.price}-${p.nextPaymentDate}`}
                                clientId={client._id}
                                plan={p}
                                currency={currency}
                                canManage={canEdit}
                                onRecord={setRecordFor}
                                onSaved={qrChanged}
                            />
                        ))}
                    </ul>
                )}
            </section>

            {/* Payment history */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">Payment history</p>
                    <div className="flex items-center gap-2">
                        {plans.length > 1 && (
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-600 focus:border-[#1A6B45] focus:outline-none"
                            >
                                <option value="all">All locations</option>
                                {plans.map((p) => <option key={p.id} value={p.id}>{p.businessName}</option>)}
                            </select>
                        )}
                        <button
                            onClick={() => downloadPaymentsCsv(payments, currency, `${client.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_payments`)}
                            disabled={payments.length === 0}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Download className="h-3.5 w-3.5" /> CSV
                        </button>
                    </div>
                </div>
                {payments.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-gray-400">No payments recorded yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {payments.map((p) => (
                            <li key={p.id} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F5EE]">
                                    <CheckCircle2 className="h-4 w-4 text-[#1A6B45]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{p.businessName}</p>
                                    <p className="text-xs text-gray-400">
                                        {fmtDate(p.date)}
                                        {p.notes && <> · {p.notes}</>}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold tabular-nums text-gray-900">{money(p.amount)}</p>
                                {canEdit && (
                                    <button
                                        onClick={() => setPaymentToDelete(p)}
                                        title="Delete payment"
                                        aria-label="Delete payment"
                                        className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {editing && (
                <ClientFormDialog
                    client={client}
                    onClose={() => setEditing(false)}
                    onCreated={() => setEditing(false)}
                />
            )}
            {resetting && (
                <ResetDialog
                    client={client}
                    onClose={() => setResetting(false)}
                    onDone={(c) => {
                        setResetting(false);
                        setCreds(c);
                    }}
                />
            )}
            {creds && <CredentialsDialog creds={creds} onClose={() => setCreds(null)} />}
            {recordFor && (
                <RecordPaymentDialog
                    clientId={client._id}
                    plans={plans}
                    currency={currency}
                    defaultQrId={recordFor}
                    onClose={() => setRecordFor(null)}
                    onSaved={qrChanged}
                />
            )}
            {paymentToDelete && (
                <Modal title="Delete this payment?" onClose={() => setPaymentToDelete(null)}>
                    <p className="text-sm text-gray-500">
                        {money(paymentToDelete.amount)} on {fmtDate(paymentToDelete.date)} for {paymentToDelete.businessName} will be removed from the history.
                        The due date isn&apos;t changed.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setPaymentToDelete(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                        <button onClick={handleDeletePayment} disabled={deletingPayment} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                            {deletingPayment && <Loader2 className="h-4 w-4 animate-spin" />} Delete
                        </button>
                    </div>
                </Modal>
            )}
            {confirmDelete && (
                <Modal title={`Delete ${client.name}?`} onClose={() => setConfirmDelete(false)}>
                    <p className="text-sm text-gray-500">Their login stops working immediately. Your QR codes and the payment history on them aren&apos;t affected.</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setConfirmDelete(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                        <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                            {deleting && <Loader2 className="h-4 w-4 animate-spin" />} Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ClientDetailsPage;
