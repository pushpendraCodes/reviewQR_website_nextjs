'use client';

import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Check, Copy, Loader2, Search, X } from "lucide-react";
import {
    useCreateClientMutation,
    useResetClientPasswordMutation,
    useUpdateClientMutation,
    type AgencyClient,
} from "@/store/api/clientsApi";
import { useListQRCodesQuery } from "@/store/api/qrApi";

export const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

export const timeAgo = (date?: string | null) => {
    if (!date) return "never";
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
};

export const copy = async (text: string, label = "Copied") => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(label);
    } catch {
        toast.error("Couldn't copy — please select and copy manually");
    }
};

export const field =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-[#1A6B45] focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 disabled:bg-gray-50 disabled:text-gray-500";

export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }> = ({ title, onClose, children, wide }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
        <div
            className={`max-h-[90vh] w-full ${wide ? "max-w-lg" : "max-w-sm"} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                    <X className="h-4 w-4" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export type Credentials = { name: string; email: string; password: string; loginUrl: string; emailed: boolean };

const CopyRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="mb-1 text-xs font-medium text-gray-500">{label}</p>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <code className="min-w-0 flex-1 truncate text-sm text-gray-900">{value}</code>
            <button onClick={() => copy(value, `${label} copied`)} className="rounded-md p-1 text-gray-400 hover:bg-white hover:text-[#1A6B45]" aria-label={`Copy ${label}`}>
                <Copy className="h-4 w-4" />
            </button>
        </div>
    </div>
);

export const CredentialsDialog: React.FC<{ creds: Credentials; onClose: () => void }> = ({ creds, onClose }) => {
    const all = `Your review dashboard login\n\nLogin page: ${creds.loginUrl}\nEmail: ${creds.email}\nPassword: ${creds.password}`;

    return (
        <Modal title={`Login details for ${creds.name}`} onClose={onClose} wide>
            <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        This password is shown only once. Copy it now and share it with your client
                        {creds.emailed ? " — we've also emailed it to them." : "."}
                    </p>
                </div>
                <CopyRow label="Login page" value={creds.loginUrl} />
                <CopyRow label="Email" value={creds.email} />
                <CopyRow label="Password" value={creds.password} />
                <button
                    onClick={() => copy(all, "Login details copied")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A6B45] py-2.5 text-sm font-semibold text-white hover:bg-[#165a3a]"
                >
                    <Copy className="h-4 w-4" /> Copy all details
                </button>
            </div>
        </Modal>
    );
};

export const ClientFormDialog: React.FC<{
    client?: AgencyClient;
    onClose: () => void;
    onCreated: (c: Credentials) => void;
}> = ({ client, onClose, onCreated }) => {
    const { data: qrData, isLoading: qrLoading } = useListQRCodesQuery({ limit: 200 });
    const [createClient, { isLoading: creating }] = useCreateClientMutation();
    const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
    const [name, setName] = useState(client?.name || "");
    const [email, setEmail] = useState(client?.email || "");
    const [selected, setSelected] = useState<string[]>(
        client?.qrCodes.filter((q) => q.status === "active").map((q) => q._id) || []
    );
    const [sendEmail, setSendEmail] = useState(true);
    const [query, setQuery] = useState("");

    const qrs = useMemo(() => {
        const list = qrData?.qrCodes || [];
        const q = query.trim().toLowerCase();
        return q ? list.filter((x) => `${x.businessName} ${x.placeAddress}`.toLowerCase().includes(q)) : list;
    }, [qrData, query]);

    const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || (!client && !email.trim())) return;
        if (selected.length === 0) return toast.error("Pick at least one QR code to share");
        try {
            if (client) {
                const res = await updateClient({ id: client._id, name: name.trim(), qrCodeIds: selected }).unwrap();
                toast.success(res.message);
                onClose();
            } else {
                const res = await createClient({ name: name.trim(), email: email.trim(), qrCodeIds: selected, sendEmail }).unwrap();
                onCreated({ name: res.client.name, email: res.client.email, password: res.password, loginUrl: res.loginUrl, emailed: res.emailed });
            }
        } catch (err) {
            toast.error(errMsg(err, client ? "Couldn't save changes" : "Couldn't create the login"));
        }
    };

    const busy = creating || updating;

    return (
        <Modal title={client ? `Edit ${client.name}` : "Add a client login"} onClose={onClose} wide>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Client name</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sharma Dental Clinic" className={field} maxLength={100} />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Login email</label>
                    <input
                        type="email"
                        required={!client}
                        disabled={Boolean(client)}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@clientbusiness.com"
                        className={field}
                    />
                    {client && <p className="mt-1 text-[11px] text-gray-400">The email can&apos;t be changed. Delete and re-create the login to use another one.</p>}
                </div>

                <div>
                    <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-500">QR codes they can see</label>
                        <span className="text-[11px] text-gray-400">{selected.length} selected</span>
                    </div>
                    <div className="rounded-xl border border-gray-200">
                        <div className="relative border-b border-gray-100">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search your QR codes"
                                className="w-full rounded-t-xl py-2 pl-8 pr-3 text-sm focus:outline-none"
                            />
                        </div>
                        <ul className="max-h-52 overflow-y-auto p-1">
                            {qrLoading && <li className="p-3 text-center text-xs text-gray-400">Loading…</li>}
                            {!qrLoading && qrs.length === 0 && <li className="p-3 text-center text-xs text-gray-400">No QR codes found.</li>}
                            {qrs.map((q) => {
                                const on = selected.includes(q.id);
                                return (
                                    <li key={q.id}>
                                        <button
                                            type="button"
                                            onClick={() => toggle(q.id)}
                                            className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${on ? "bg-[#E8F5EE]" : "hover:bg-gray-50"}`}
                                        >
                                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-[#1A6B45] bg-[#1A6B45]" : "border-gray-300"}`}>
                                                {on && <Check className="h-3 w-3 text-white" />}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium text-gray-800">{q.businessName}</span>
                                                {q.placeAddress && <span className="block truncate text-[11px] text-gray-400">{q.placeAddress}</span>}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {!client && (
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="h-4 w-4 accent-[#1A6B45]" />
                        Email the login details to the client
                    </label>
                )}

                <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button
                        type="submit"
                        disabled={busy}
                        className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60"
                    >
                        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                        {client ? "Save changes" : "Create login"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export const ResetDialog: React.FC<{ client: AgencyClient; onClose: () => void; onDone: (c: Credentials) => void }> = ({ client, onClose, onDone }) => {
    const [sendEmail, setSendEmail] = useState(true);
    const [reset, { isLoading }] = useResetClientPasswordMutation();

    const submit = async () => {
        try {
            const res = await reset({ id: client._id, sendEmail }).unwrap();
            onDone({ name: client.name, email: client.email, password: res.password, loginUrl: res.loginUrl, emailed: res.emailed });
        } catch (err) {
            toast.error(errMsg(err, "Couldn't reset the password"));
        }
    };

    return (
        <Modal title="Reset password?" onClose={onClose}>
            <p className="text-sm text-gray-500">
                We&apos;ll generate a new password for <span className="font-medium text-gray-800">{client.name}</span>. They&apos;ll be signed out everywhere and the old password stops working.
            </p>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="h-4 w-4 accent-[#1A6B45]" />
                Email the new password to {client.email}
            </label>
            <div className="mt-6 flex justify-end gap-2">
                <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
                <button
                    onClick={submit}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-[#1A6B45] px-4 py-2 text-sm font-semibold text-white hover:bg-[#165a3a] disabled:opacity-60"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Reset password
                </button>
            </div>
        </Modal>
    );
};

