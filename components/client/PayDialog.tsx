'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import QRCodeStyling from "qr-code-styling";
import { Building2, CheckCircle2, Copy, CreditCard, ExternalLink, Loader2, Smartphone, X } from "lucide-react";
import {
    useCreatePaymentClaimMutation,
    type AgencyPaymentMethods,
    type BillingCurrency,
    type ClientBillingPlan,
    type PaymentClaimMethod,
} from "@/store/api/clientPortalApi";
import { CLAIM_METHOD_LABEL, formatAmount, paypalPayUrl, upiPayUrl } from "@/lib/money";

const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

const pad = (n: number) => String(n).padStart(2, "0");
const todayInput = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const copyText = async (text: string, label: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied`);
    } catch {
        toast.error("Couldn't copy — please copy it manually");
    }
};

const UpiQr: React.FC<{ value: string }> = ({ value }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.innerHTML = "";
        new QRCodeStyling({
            width: 180,
            height: 180,
            data: value,
            margin: 6,
            dotsOptions: { type: "rounded", color: "#111827" },
            cornersSquareOptions: { type: "extra-rounded", color: "#111827" },
            backgroundOptions: { color: "#ffffff" },
            qrOptions: { errorCorrectionLevel: "M" },
        }).append(ref.current);
    }, [value]);
    return <div ref={ref} className="h-[180px] w-[180px]" />;
};

type Tab = Exclude<PaymentClaimMethod, "other">;

const PayDialog: React.FC<{
    plans: ClientBillingPlan[];
    defaultQrId?: string;
    currency: BillingCurrency;
    methods: AgencyPaymentMethods;
    agencyName: string;
    clientName: string;
    onClose: () => void;
}> = ({ plans, defaultQrId, currency, methods, agencyName, clientName, onClose }) => {
    const billable = plans.filter((p) => p.status !== "none");
    const choices = billable.length ? billable : plans;
    const initial = choices.find((p) => p.id === defaultQrId) || choices[0];

    const tabs = useMemo(() => {
        const t: { key: Tab; label: string; icon: React.ElementType }[] = [];
        if (methods.upiId && currency === "INR") t.push({ key: "upi", label: "UPI", icon: Smartphone });
        if (methods.paymentLink) t.push({ key: "link", label: methods.paymentLinkLabel || "Card / online", icon: CreditCard });
        if (methods.paypalMe) t.push({ key: "paypal", label: "PayPal", icon: CreditCard });
        if (methods.bankDetails) t.push({ key: "bank", label: "Bank transfer", icon: Building2 });
        return t;
    }, [methods, currency]);

    const [qrId, setQrId] = useState(initial?.id || "");
    const [amount, setAmount] = useState(initial?.price ? String(initial.price) : "");
    const [tab, setTab] = useState<Tab | null>(tabs[0]?.key ?? null);
    const [step, setStep] = useState<"pay" | "confirm">("pay");
    const [reference, setReference] = useState("");
    const [paidOn, setPaidOn] = useState(todayInput());
    const [note, setNote] = useState("");
    const [createClaim, { isLoading }] = useCreatePaymentClaimMutation();

    const plan = choices.find((p) => p.id === qrId);
    const value = Number(amount) || 0;
    const money = formatAmount(value, currency);
    const memo = `${plan?.businessName || clientName}`.slice(0, 40);
    const bankRef = `${clientName.replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase()}-${new Date().toISOString().slice(2, 7).replace("-", "")}`;

    const pickQr = (id: string) => {
        setQrId(id);
        const p = choices.find((x) => x.id === id);
        if (p?.price) setAmount(String(p.price));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!qrId) return toast.error("Pick which location you paid for");
        if (value <= 0) return toast.error("Enter the amount you paid");
        try {
            const res = await createClaim({
                qrId,
                amount: value,
                method: tab || "other",
                reference: reference.trim(),
                note: note.trim(),
                paidAt: new Date(`${paidOn}T12:00:00`).toISOString(),
            }).unwrap();
            toast.success(res.message);
            onClose();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't send your payment details"));
        }
    };

    const field = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20";
    const referenceLabel =
        tab === "upi" ? "UPI transaction ID / UTR" : tab === "bank" ? "Bank transfer reference" : tab === "paypal" ? "PayPal transaction ID" : "Payment / receipt ID";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{step === "pay" ? `Pay ${agencyName}` : "Tell us you've paid"}</h3>
                        <p className="text-xs text-gray-400">
                            {step === "pay" ? "Your payment goes directly to your agency." : `${agencyName} will confirm it and update your history.`}
                        </p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    {/* Location + amount */}
                    <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                        {choices.length > 1 ? (
                            <label className="block">
                                <span className="mb-1 block text-xs font-medium text-gray-500">Paying for</span>
                                <select value={qrId} onChange={(e) => pickQr(e.target.value)} className={field}>
                                    {choices.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.businessName}{p.price ? ` — ${formatAmount(p.price, currency)}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <div>
                                <span className="mb-1 block text-xs font-medium text-gray-500">Paying for</span>
                                <p className="truncate rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800">{plan?.businessName || "—"}</p>
                            </div>
                        )}
                        <label className="block">
                            <span className="mb-1 block text-xs font-medium text-gray-500">Amount ({currency})</span>
                            <input type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
                        </label>
                    </div>

                    {step === "pay" ? (
                        <>
                            {tabs.length === 0 ? (
                                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                                    {agencyName} hasn&apos;t added online payment options yet. Pay them the usual way, then tap &quot;I&apos;ve paid&quot; below.
                                </p>
                            ) : (
                                <>
                                    {tabs.length > 1 && (
                                        <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
                                            {tabs.map((t) => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setTab(t.key)}
                                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                                        tab === t.key ? "bg-white text-[#1A6B45] shadow-sm" : "text-gray-500 hover:text-gray-800"
                                                    }`}
                                                >
                                                    <t.icon className="h-3.5 w-3.5" /> {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {tab === "upi" && (
                                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 p-5 text-center">
                                            <UpiQr value={upiPayUrl(methods.upiId, methods.upiName || agencyName, value, memo)} />
                                            <p className="text-sm text-gray-600">Scan with any UPI app (GPay, PhonePe, Paytm…) to pay <span className="font-semibold">{money}</span></p>
                                            <a
                                                href={upiPayUrl(methods.upiId, methods.upiName || agencyName, value, memo)}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a] sm:hidden"
                                            >
                                                <Smartphone className="h-4 w-4" /> Open UPI app
                                            </a>
                                            <button onClick={() => copyText(methods.upiId, "UPI ID")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1A6B45]">
                                                UPI ID: <span className="font-mono font-semibold text-gray-800">{methods.upiId}</span> <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}

                                    {tab === "link" && (
                                        <div className="rounded-2xl border border-gray-100 p-5 text-center">
                                            <p className="mb-3 text-sm text-gray-600">Pay securely by card, Apple Pay, Google Pay or net banking on {agencyName}&apos;s payment page.</p>
                                            <a
                                                href={methods.paymentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a]"
                                            >
                                                {methods.paymentLinkLabel || "Pay online"} {value > 0 && `· ${money}`} <ExternalLink className="h-4 w-4" />
                                            </a>
                                            <p className="mt-2 text-[11px] text-gray-400">Opens in a new tab. Enter {money} if asked.</p>
                                        </div>
                                    )}

                                    {tab === "paypal" && (
                                        <div className="rounded-2xl border border-gray-100 p-5 text-center">
                                            <p className="mb-3 text-sm text-gray-600">Pay with your PayPal account or card through PayPal.</p>
                                            <a
                                                href={paypalPayUrl(methods.paypalMe, value, currency)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0070BA] py-2.5 text-sm font-semibold text-white hover:bg-[#005ea6]"
                                            >
                                                Pay {value > 0 ? money : ""} with PayPal <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}

                                    {tab === "bank" && (
                                        <div className="space-y-3 rounded-2xl border border-gray-100 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-sans text-sm text-gray-800">{methods.bankDetails}</pre>
                                                <button onClick={() => copyText(methods.bankDetails, "Bank details")} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-[#1A6B45]" aria-label="Copy bank details">
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                                                <span className="text-gray-500">Use this reference: <span className="font-mono font-semibold text-gray-800">{bankRef}</span></span>
                                                <button onClick={() => copyText(bankRef, "Reference")} className="text-gray-400 hover:text-[#1A6B45]" aria-label="Copy reference">
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {methods.instructions && (
                                <p className="whitespace-pre-wrap rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">{methods.instructions}</p>
                            )}

                            <button
                                onClick={() => {
                                    if (tab === "bank") setReference((r) => r || bankRef);
                                    setStep("confirm");
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1A6B45] py-2.5 text-sm font-semibold text-[#1A6B45] hover:bg-[#E8F5EE]"
                            >
                                <CheckCircle2 className="h-4 w-4" /> I&apos;ve paid — let {agencyName} know
                            </button>
                        </>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-1 block text-xs font-medium text-gray-500">Paid with</span>
                                    <select value={tab || "other"} onChange={(e) => setTab(e.target.value === "other" ? null : (e.target.value as Tab))} className={field}>
                                        {(["upi", "link", "paypal", "bank"] as Tab[]).map((m) => (
                                            <option key={m} value={m}>{m === "link" && methods.paymentLinkLabel ? methods.paymentLinkLabel : CLAIM_METHOD_LABEL[m]}</option>
                                        ))}
                                        <option value="other">Other (cash, cheque…)</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-xs font-medium text-gray-500">Paid on</span>
                                    <input type="date" required value={paidOn} max={todayInput()} onChange={(e) => setPaidOn(e.target.value)} className={field} />
                                </label>
                            </div>
                            <label className="block">
                                <span className="mb-1 block text-xs font-medium text-gray-500">{referenceLabel} (recommended)</span>
                                <input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={80} placeholder="Helps your agency find the payment quickly" className={field} />
                            </label>
                            <label className="block">
                                <span className="mb-1 block text-xs font-medium text-gray-500">Note (optional)</span>
                                <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="e.g. Paid for March and April" className={field} />
                            </label>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setStep("pay")} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Back</button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Send {value > 0 ? money : ""} payment for confirmation
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayDialog;
