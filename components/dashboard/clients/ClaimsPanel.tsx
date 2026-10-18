'use client';

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Check, ChevronDown, Hourglass, Loader2, X } from "lucide-react";
import { useConfirmClaimMutation, useRejectClaimMutation } from "@/store/api/clientsApi";
import type { ClientBillingPlan, PaymentClaim } from "@/store/api/clientPortalApi";
import { ClaimBadge, claimSummary, fmtDate } from "@/components/client/billingUi";
import { currencySymbol, formatAmount } from "@/lib/money";
import { Modal, errMsg, field } from "./ClientDialogs";

const ConfirmDialog: React.FC<{
    clientId: string;
    claim: PaymentClaim;
    plan?: ClientBillingPlan;
    onClose: () => void;
    onDone: () => void;
}> = ({ clientId, claim, plan, onClose, onDone }) => {
    const recurring = Boolean(plan && plan.planType !== "none");
    const [amount, setAmount] = useState(String(claim.amount));
    const [advance, setAdvance] = useState(recurring);
    const [confirm, { isLoading }] = useConfirmClaimMutation();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) return toast.error("Enter the amount you received");
        try {
            const res = await confirm({ id: clientId, claimId: claim.id, amount: n, advanceDueDate: advance && recurring }).unwrap();
            toast.success(res.message);
            onDone();
            onClose();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't confirm the payment"));
        }
    };

    return (
        <Modal title="Confirm this payment" onClose={onClose}>
            <form onSubmit={submit} className="space-y-4">
                <p className="text-sm text-gray-500">
                    Check that the money has reached your account, then confirm. It&apos;s added to {claim.businessName}&apos;s payment history.
                </p>
                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                    <p className="font-medium text-gray-800">{claimSummary(claim)}</p>
                    {claim.note && <p className="mt-1 text-gray-500">&ldquo;{claim.note}&rdquo;</p>}
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Amount received ({currencySymbol(claim.currency)})</label>
                    <input type="number" min={0} step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className={field} autoFocus />
                </div>
                {recurring && plan && (
                    <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                        <input type="checkbox" checked={advance} onChange={(e) => setAdvance(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1A6B45]" />
                        <span>
                            Move the next due date forward by one {plan.planType === "yearly" ? "year" : "month"}
                            {plan.nextPaymentDate && <span className="block text-xs text-gray-400">Currently due {fmtDate(plan.nextPaymentDate)}</span>}
                        </span>
                    </label>
                )}
                <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm payment
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const RejectDialog: React.FC<{ clientId: string; claim: PaymentClaim; onClose: () => void }> = ({ clientId, claim, onClose }) => {
    const [reason, setReason] = useState("");
    const [reject, { isLoading }] = useRejectClaimMutation();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            toast.success((await reject({ id: clientId, claimId: claim.id, reason: reason.trim() || undefined }).unwrap()).message);
            onClose();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't update the payment"));
        }
    };

    return (
        <Modal title="Payment not received?" onClose={onClose}>
            <form onSubmit={submit} className="space-y-4">
                <p className="text-sm text-gray-500">
                    The client will see that {formatAmount(claim.amount, claim.currency)} for {claim.businessName} wasn&apos;t received. Nothing is added to the
                    payment history.
                </p>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Reason shown to the client (optional)</label>
                    <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} placeholder="e.g. No payment with this reference found" className={field} />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Mark as not received
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const ClaimRow: React.FC<{ claim: PaymentClaim; actions?: React.ReactNode }> = ({ claim, actions }) => (
    <li className="flex flex-wrap items-center gap-4 px-6 py-3.5">
        <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-900">
                {claim.businessName}
                <ClaimBadge status={claim.status} />
            </p>
            <p className="text-xs text-gray-500">{claimSummary(claim)} · reported {fmtDate(claim.createdAt)}</p>
            {claim.note && <p className="mt-0.5 text-xs text-gray-400">&ldquo;{claim.note}&rdquo;</p>}
            {claim.status === "rejected" && claim.rejectReason && <p className="mt-0.5 text-xs text-red-500">Reason: {claim.rejectReason}</p>}
        </div>
        <p className="text-sm font-semibold tabular-nums text-gray-900">{formatAmount(claim.amount, claim.currency)}</p>
        {actions}
    </li>
);

const ClaimsPanel: React.FC<{
    clientId: string;
    claims: PaymentClaim[];
    plans: ClientBillingPlan[];
    canManage: boolean;
    onConfirmed: () => void;
}> = ({ clientId, claims, plans, canManage, onConfirmed }) => {
    const [confirming, setConfirming] = useState<PaymentClaim | null>(null);
    const [rejecting, setRejecting] = useState<PaymentClaim | null>(null);
    const [showPast, setShowPast] = useState(false);

    const pending = claims.filter((c) => c.status === "pending");
    const past = claims.filter((c) => c.status !== "pending");
    if (claims.length === 0) return null;

    return (
        <section className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${pending.length ? "border-amber-200" : "border-gray-100"}`}>
            <div className={`flex items-center justify-between gap-3 border-b px-6 py-4 ${pending.length ? "border-amber-100 bg-amber-50/60" : "border-gray-100"}`}>
                <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Hourglass className="h-4 w-4 text-amber-600" /> Payments reported by the client
                    </p>
                    <p className="text-xs text-gray-500">
                        {!pending.length
                            ? "Nothing waiting for confirmation."
                            : canManage
                              ? `${pending.length} waiting for you. Confirm once the money is in your account.`
                              : `${pending.length} waiting for the agency owner to confirm.`}
                    </p>
                </div>
            </div>

            {pending.length > 0 && (
                <ul className="divide-y divide-gray-50">
                    {pending.map((c) => (
                        <ClaimRow
                            key={c.id}
                            claim={c}
                            actions={
                                !canManage ? undefined : <div className="flex gap-2">
                                    <button
                                        onClick={() => setRejecting(c)}
                                        disabled={!canManage}
                                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                    >
                                        <X className="h-3.5 w-3.5" /> Not received
                                    </button>
                                    <button
                                        onClick={() => setConfirming(c)}
                                        disabled={!canManage}
                                        className="flex items-center gap-1 rounded-lg bg-[#1A6B45] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#165a3a] disabled:opacity-40"
                                    >
                                        <Check className="h-3.5 w-3.5" /> Confirm
                                    </button>
                                </div>
                            }
                        />
                    ))}
                </ul>
            )}

            {past.length > 0 && (
                <>
                    <button
                        onClick={() => setShowPast((v) => !v)}
                        className="flex w-full items-center justify-between border-t border-gray-100 px-6 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                    >
                        Reviewed ({past.length})
                        <ChevronDown className={`h-4 w-4 transition-transform ${showPast ? "rotate-180" : ""}`} />
                    </button>
                    {showPast && (
                        <ul className="divide-y divide-gray-50 border-t border-gray-50">
                            {past.map((c) => <ClaimRow key={c.id} claim={c} />)}
                        </ul>
                    )}
                </>
            )}

            {confirming && (
                <ConfirmDialog
                    clientId={clientId}
                    claim={confirming}
                    plan={plans.find((p) => p.id === confirming.qrId)}
                    onClose={() => setConfirming(null)}
                    onDone={onConfirmed}
                />
            )}
            {rejecting && <RejectDialog clientId={clientId} claim={rejecting} onClose={() => setRejecting(null)} />}
        </section>
    );
};

export default ClaimsPanel;
