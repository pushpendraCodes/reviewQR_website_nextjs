'use client';

import React, { useMemo, useState } from "react";
import {
    AlertTriangle,
    Banknote,
    CalendarClock,
    CheckCircle2,
    Clock,
    Download,
    Receipt,
    Wallet,
    XCircle,
} from "lucide-react";
import { useGetClientPaymentsQuery, type ClientSession } from "@/store/api/clientPortalApi";
import { formatAmount } from "@/lib/money";
import PayDialog from "./PayDialog";
import { ClaimBadge, PLAN_LABEL, Stat, StatusBadge, claimSummary, downloadPaymentsCsv, dueText, fmtDate } from "./billingUi";

const ClientPayments: React.FC<{ agency: ClientSession["agency"]; clientName: string }> = ({ agency, clientName }) => {
    const { data, isLoading, isError, refetch } = useGetClientPaymentsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [location, setLocation] = useState("all");
    const [payFor, setPayFor] = useState<string | null>(null);

    const payments = useMemo(
        () => (data?.payments || []).filter((p) => location === "all" || p.qrId === location),
        [data, location]
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />)}
                </div>
                <div className="h-48 animate-pulse rounded-2xl bg-white" />
            </div>
        );
    }
    if (isError || !data) {
        return (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
                Couldn&apos;t load your payments.{" "}
                <button onClick={() => refetch()} className="font-semibold text-[#1A6B45] hover:underline">Try again</button>
            </div>
        );
    }

    const { totals, plans, currency, paymentMethods, claims } = data;
    const money = (n: number) => formatAmount(n, currency);
    const billedPlans = plans.filter((p) => p.status !== "none");
    const contact = `${agency.contactName || agency.name}${agency.email ? ` (${agency.email})` : ""}`;
    const pendingClaims = claims.filter((c) => c.status === "pending");
    const rejectedClaims = claims.filter((c) => c.status === "rejected").slice(0, 3);
    const canPay = plans.length > 0;
    const firstDue = plans.find((p) => p.status === "overdue") || plans.find((p) => p.status === "due_soon") || billedPlans[0];

    if (billedPlans.length === 0 && data.payments.length === 0 && claims.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <Wallet className="mx-auto mb-3 h-9 w-9 text-gray-200" />
                <p className="text-sm font-semibold text-gray-700">No billing details yet</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
                    {agency.name} hasn&apos;t added your plan or any payments yet. For billing questions, contact {contact}.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pay now hero */}
            {canPay && (
                <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 ${totals.overdueCount > 0 ? "border-red-200 bg-red-50" : totals.amountDue > 0 ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-white shadow-sm"}`}>
                    <div className="flex min-w-0 items-start gap-3">
                        {totals.overdueCount > 0 ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" /> : <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#1A6B45]" />}
                        <div className="min-w-0 text-sm">
                            {totals.overdueCount > 0 ? (
                                <p className="text-red-700"><span className="font-semibold">{money(totals.overdueAmount)} is overdue</span> for {totals.overdueCount} location{totals.overdueCount === 1 ? "" : "s"}.</p>
                            ) : totals.amountDue > 0 ? (
                                <p className="text-amber-800"><span className="font-semibold">{money(totals.amountDue)} is due</span> within the next 7 days.</p>
                            ) : (
                                <p className="text-gray-700">You&apos;re all paid up{totals.nextDue ? <> · next payment {money(totals.nextDue.amount)} on {fmtDate(totals.nextDue.date)}</> : ""}.</p>
                            )}
                            <p className="mt-0.5 text-xs text-gray-500">
                                {paymentMethods.hasAny ? `Pay ${agency.name} directly by ${[paymentMethods.upiId && currency === "INR" && "UPI", paymentMethods.paymentLink && "card", paymentMethods.paypalMe && "PayPal", paymentMethods.bankDetails && "bank transfer"].filter(Boolean).join(", ")}.` : `Paid ${agency.name} another way? Let them know here.`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setPayFor(firstDue?.id || plans[0].id)}
                        className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#165a3a]"
                    >
                        <Wallet className="h-4 w-4" /> {paymentMethods.hasAny ? "Pay now" : "I've paid"}
                    </button>
                </div>
            )}

            {/* Claims status */}
            {(pendingClaims.length > 0 || rejectedClaims.length > 0) && (
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <p className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-800">Payments you&apos;ve reported</p>
                    <ul className="divide-y divide-gray-50">
                        {[...pendingClaims, ...rejectedClaims].map((c) => (
                            <li key={c.id} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.status === "pending" ? "bg-amber-50" : "bg-red-50"}`}>
                                    {c.status === "pending" ? <Clock className="h-4 w-4 text-amber-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-900">
                                        {c.businessName || "Payment"} <ClaimBadge status={c.status} />
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {claimSummary(c)}
                                        {c.status === "rejected" && c.rejectReason && <span className="text-red-500"> · {c.rejectReason}</span>}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold tabular-nums text-gray-900">{formatAmount(c.amount, c.currency)}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    icon={Banknote}
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
                <Stat icon={CheckCircle2} label="Total paid" value={money(totals.totalPaid)} hint={`${totals.paymentsCount} payment${totals.paymentsCount === 1 ? "" : "s"}`} />
                <Stat
                    icon={Receipt}
                    label={`Paid in ${new Date().getFullYear()}`}
                    value={money(totals.paidThisYear)}
                    hint={totals.lastPayment ? `Last: ${money(totals.lastPayment.amount)} on ${fmtDate(totals.lastPayment.date)}` : undefined}
                />
            </div>

            {/* Plans per location */}
            {plans.length > 0 && (
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <p className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-800">Your plans</p>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-sm">
                            <thead>
                                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-3 py-3">Plan</th>
                                    <th className="px-3 py-3 text-right">Amount</th>
                                    <th className="px-3 py-3">Next due</th>
                                    <th className="px-3 py-3 text-right">Total paid</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {plans.map((p) => (
                                    <tr key={p.id} className={p.status === "overdue" ? "bg-red-50/40" : ""}>
                                        <td className="max-w-[220px] px-6 py-3.5">
                                            <p className="truncate font-medium text-gray-900">{p.businessName}</p>
                                            {p.lastPaymentAt && <p className="text-[11px] text-gray-400">Last paid {fmtDate(p.lastPaymentAt)}</p>}
                                        </td>
                                        <td className="px-3 py-3.5 text-gray-600">{PLAN_LABEL[p.planType]}</td>
                                        <td className="px-3 py-3.5 text-right font-semibold tabular-nums text-gray-900">
                                            {p.price > 0 ? money(p.price) : "—"}
                                            {p.price > 0 && p.planType !== "none" && (
                                                <span className="font-normal text-gray-400">/{p.planType === "yearly" ? "yr" : "mo"}</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-gray-700">{fmtDate(p.nextPaymentDate)}</span>
                                                <span className="flex items-center gap-1.5">
                                                    <StatusBadge status={p.status} />
                                                    {dueText(p) && <span className="text-[11px] text-gray-400">{dueText(p)}</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 text-right tabular-nums text-gray-700">{money(p.totalPaid)}</td>
                                        <td className="px-6 py-3.5 text-right">
                                            {p.status !== "none" && (
                                                <button
                                                    onClick={() => setPayFor(p.id)}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${p.status === "overdue" || p.status === "due_soon" ? "bg-[#1A6B45] text-white hover:bg-[#165a3a]" : "text-[#1A6B45] hover:bg-[#E8F5EE]"}`}
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

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
                            onClick={() => downloadPaymentsCsv(payments, currency)}
                            disabled={payments.length === 0}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Download className="h-3.5 w-3.5" /> Statement (CSV)
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
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <p className="text-center text-[11px] text-gray-400">
                Payments go directly to {agency.name} and are confirmed by them. If something looks wrong, contact {contact}.
            </p>

            {payFor && (
                <PayDialog
                    key={payFor}
                    plans={plans}
                    defaultQrId={payFor}
                    currency={currency}
                    methods={paymentMethods}
                    agencyName={agency.name}
                    clientName={clientName}
                    onClose={() => setPayFor(null)}
                />
            )}
        </div>
    );
};

export default ClientPayments;
