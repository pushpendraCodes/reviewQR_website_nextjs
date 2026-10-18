'use client';

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Building2, CreditCard, Info, Loader2, Smartphone } from "lucide-react";
import { useGetPaymentMethodsQuery, useUpdatePaymentMethodsMutation } from "@/store/api/clientsApi";
import type { AgencyPaymentMethods } from "@/store/api/clientPortalApi";
import { Modal, errMsg, field } from "./ClientDialogs";

type Form = Omit<AgencyPaymentMethods, "hasAny">;

const Section: React.FC<{ icon: React.ElementType; title: string; hint: string; children: React.ReactNode }> = ({ icon: Icon, title, hint, children }) => (
    <div className="rounded-xl border border-gray-100 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-800"><Icon className="h-4 w-4 text-[#1A6B45]" /> {title}</p>
        <p className="mb-3 mt-0.5 text-xs text-gray-400">{hint}</p>
        <div className="space-y-3">{children}</div>
    </div>
);

const MethodsForm: React.FC<{ initial: Form; canEdit: boolean; onClose: () => void }> = ({ initial, canEdit, onClose }) => {
    const [form, setForm] = useState<Form>(initial);
    const [save, { isLoading }] = useUpdatePaymentMethodsMutation();
    const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            toast.success((await save(form).unwrap()).message);
            onClose();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't save payment methods"));
        }
    };

    const label = "mb-1 block text-xs font-medium text-gray-500";

    return (
        <form onSubmit={submit} className="space-y-4">
            <p className="flex items-start gap-2 rounded-xl bg-[#F3FAF6] p-3 text-xs text-[#1A6B45]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Clients see these on their Payments tab with a &quot;Pay now&quot; button. Money goes straight to you. Clients then tap
                &quot;I&apos;ve paid&quot; and you confirm it on their page.
            </p>

            <Section icon={Smartphone} title="UPI (India)" hint="Shown to clients billed in INR, as a QR code and an 'Open UPI app' button.">
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                        <span className={label}>UPI ID</span>
                        <input value={form.upiId} onChange={set("upiId")} disabled={!canEdit} placeholder="youragency@okhdfcbank" className={field} />
                    </label>
                    <label className="block">
                        <span className={label}>Payee name (optional)</span>
                        <input value={form.upiName} onChange={set("upiName")} disabled={!canEdit} maxLength={60} placeholder="Your Agency Pvt Ltd" className={field} />
                    </label>
                </div>
            </Section>

            <Section icon={CreditCard} title="Card / online payment link" hint="Your Stripe Payment Link, Razorpay Payment Page, Instamojo, etc. Works for international clients.">
                <label className="block">
                    <span className={label}>Payment link</span>
                    <input type="url" value={form.paymentLink} onChange={set("paymentLink")} disabled={!canEdit} placeholder="https://buy.stripe.com/… or https://rzp.io/…" className={field} />
                </label>
                <label className="block">
                    <span className={label}>Button label (optional)</span>
                    <input value={form.paymentLinkLabel} onChange={set("paymentLinkLabel")} disabled={!canEdit} maxLength={40} placeholder="Pay by card" className={field} />
                </label>
                <label className="block">
                    <span className={label}>PayPal.me username (optional)</span>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-[#1A6B45] focus-within:ring-2 focus-within:ring-[#1A6B45]/20">
                        <span className="pl-3 text-sm text-gray-400">paypal.me/</span>
                        <input value={form.paypalMe} onChange={set("paypalMe")} disabled={!canEdit} placeholder="youragency" className="w-full rounded-r-xl bg-transparent py-2.5 pr-3 text-sm focus:outline-none" />
                    </div>
                </label>
            </Section>

            <Section icon={Building2} title="Bank transfer" hint="Account details for NEFT/IMPS or international wire (IBAN/SWIFT, Wise, Payoneer).">
                <textarea
                    value={form.bankDetails}
                    onChange={set("bankDetails")}
                    disabled={!canEdit}
                    rows={4}
                    maxLength={1000}
                    placeholder={"Account name: Your Agency Pvt Ltd\nAccount no: 1234567890\nIFSC: HDFC0001234\nSWIFT: HDFCINBB"}
                    className={`${field} resize-y font-mono text-xs`}
                />
            </Section>

            <label className="block">
                <span className={label}>Note for clients (optional)</span>
                <textarea value={form.instructions} onChange={set("instructions")} disabled={!canEdit} rows={2} maxLength={500} placeholder="e.g. Please pay by the 5th of every month. GST invoice is sent by email." className={`${field} resize-y`} />
            </label>

            {!canEdit && <p className="text-xs text-amber-600">Only the agency owner can change payment methods (and the Agency plan must be active).</p>}

            <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">{canEdit ? "Cancel" : "Close"}</button>
                {canEdit && (
                    <button type="submit" disabled={isLoading} className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Save
                    </button>
                )}
            </div>
        </form>
    );
};

const PaymentMethodsDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { data, isLoading, isError } = useGetPaymentMethodsQuery();

    return (
        <Modal title="How clients pay you" onClose={onClose} wide>
            {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#1A6B45]" /></div>
            ) : isError || !data ? (
                <p className="py-6 text-center text-sm text-gray-500">Couldn&apos;t load payment methods.</p>
            ) : (
                <MethodsForm initial={data.methods} canEdit={data.canEdit} onClose={onClose} />
            )}
        </Modal>
    );
};

export default PaymentMethodsDialog;
