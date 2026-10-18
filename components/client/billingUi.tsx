'use client';

import React from "react";
import type { ClientBillingPlan, ClientBillingStatus, ClientPayment, PaymentClaim } from "@/store/api/clientPortalApi";
import { CLAIM_METHOD_LABEL } from "@/lib/money";

export const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const PLAN_LABEL: Record<ClientBillingPlan["planType"], string> = { monthly: "Monthly", yearly: "Yearly", none: "—" };

export const dueText = (p: Pick<ClientBillingPlan, "status" | "daysUntilDue">) => {
    if (p.daysUntilDue === null) return "";
    if (p.status === "overdue") return `${Math.abs(p.daysUntilDue)} day${Math.abs(p.daysUntilDue) === 1 ? "" : "s"} overdue`;
    if (p.daysUntilDue === 0) return "Due today";
    return `Due in ${p.daysUntilDue} day${p.daysUntilDue === 1 ? "" : "s"}`;
};

const STATUS_STYLE: Record<ClientBillingStatus, { label: string; cls: string }> = {
    overdue: { label: "Overdue", cls: "bg-red-50 text-red-600" },
    due_soon: { label: "Due soon", cls: "bg-amber-50 text-amber-700" },
    upcoming: { label: "Upcoming", cls: "bg-[#E8F5EE] text-[#1A6B45]" },
    no_date: { label: "No due date", cls: "bg-gray-100 text-gray-500" },
    none: { label: "No plan", cls: "bg-gray-100 text-gray-400" },
};

export const StatusBadge: React.FC<{ status: ClientBillingStatus }> = ({ status }) => (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[status].cls}`}>
        {STATUS_STYLE[status].label}
    </span>
);

const CLAIM_STYLE: Record<PaymentClaim["status"], { label: string; cls: string }> = {
    pending: { label: "Awaiting confirmation", cls: "bg-amber-50 text-amber-700" },
    confirmed: { label: "Confirmed", cls: "bg-[#E8F5EE] text-[#1A6B45]" },
    rejected: { label: "Not received", cls: "bg-red-50 text-red-600" },
};

export const ClaimBadge: React.FC<{ status: PaymentClaim["status"] }> = ({ status }) => (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CLAIM_STYLE[status].cls}`}>
        {CLAIM_STYLE[status].label}
    </span>
);

export const claimSummary = (c: PaymentClaim) =>
    [CLAIM_METHOD_LABEL[c.method], c.reference && `Ref ${c.reference}`, `paid ${fmtDate(c.paidAt)}`].filter(Boolean).join(" · ");

export const Stat: React.FC<{ icon: React.ElementType; label: string; value: string; hint?: string; tone?: "red" | "amber" }> = ({ icon: Icon, label, value, hint, tone }) => (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${tone === "red" ? "border-red-100" : tone === "amber" ? "border-amber-100" : "border-gray-100"}`}>
        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${tone === "red" ? "bg-red-50" : tone === "amber" ? "bg-amber-50" : "bg-[#E8F5EE]"}`}>
            <Icon className={`h-4 w-4 ${tone === "red" ? "text-red-500" : tone === "amber" ? "text-amber-600" : "text-[#1A6B45]"}`} />
        </div>
        <p className="text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {hint && <p className="mt-0.5 truncate text-[11px] text-gray-400">{hint}</p>}
    </div>
);

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export const downloadPaymentsCsv = (payments: ClientPayment[], currency: string, filePrefix = "payments") => {
    const rows = [
        ["Date", "Location", `Amount (${currency})`, "Notes"],
        ...payments.map((p) => [new Date(p.date).toLocaleDateString("en-IN"), p.businessName, p.amount, p.notes]),
    ];
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
