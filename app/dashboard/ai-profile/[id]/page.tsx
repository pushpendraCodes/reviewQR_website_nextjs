'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, Loader2, Plus, Save, Sparkles, Wand2, X } from "lucide-react";
import toast from "react-hot-toast";
import PlanGate from '@/components/dashboard/PlanGate';
import {
    useAutofillReviewProfileMutation,
    useGetReviewProfileQuery,
    useUpdateReviewProfileMutation,
    type ReviewProfile,
    type ReviewProfileResponse,
    type ReviewTone,
} from '@/store/api/qrApi';
import {
    ALL_REVIEW_LANGUAGES as ALL_LANGUAGES,
    DEFAULT_REVIEW_LANGUAGES,
    REVIEW_LANGUAGE_LIST as LANGUAGES,
    type ReviewLanguage,
} from '@/lib/reviewLanguages';

const LANGUAGE_GROUPS = [
    { id: "india", title: "Indian languages" },
    { id: "world", title: "International languages" },
] as const;

const TONES: { id: ReviewTone; label: string; hint: string }[] = [
    { id: "friendly", label: "Friendly", hint: "Warm and casual" },
    { id: "professional", label: "Professional", hint: "Polite, to the point" },
    { id: "enthusiastic", label: "Enthusiastic", hint: "Upbeat and excited" },
];

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45]";

const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
            <div className="mt-4">{children}</div>
        </section>
    );
}

function TagInput({ values, onChange, max, maxLength, placeholder }: {
    values: string[];
    onChange: (values: string[]) => void;
    max: number;
    maxLength: number;
    placeholder: string;
}) {
    const [draft, setDraft] = useState("");
    const add = () => {
        const text = draft.trim();
        if (!text) return;
        if (values.some((v) => v.toLowerCase() === text.toLowerCase())) return setDraft("");
        if (values.length >= max) return toast.error(`You can add up to ${max}.`);
        onChange([...values, text]);
        setDraft("");
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {values.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full bg-[#E8F5EE] text-[#1A6B45] text-xs font-medium">
                        {v}
                        <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="p-0.5 rounded-full hover:bg-white/70" aria-label={`Remove ${v}`}>
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2 mt-3">
                <input
                    value={draft}
                    maxLength={maxLength}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            add();
                        }
                    }}
                    placeholder={placeholder}
                    className={inputCls}
                />
                <button type="button" onClick={add} className="px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 shrink-0" aria-label="Add">
                    <Plus size={16} />
                </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">{values.length}/{max}</p>
        </div>
    );
}

function ProfileEditor({ id, data }: { id: string; data: ReviewProfileResponse }) {
    const [profile, setProfile] = useState<ReviewProfile>(data.profile);
    const [dirty, setDirty] = useState(false);
    const [save, { isLoading: isSaving }] = useUpdateReviewProfileMutation();
    const [autofill, { isLoading: isFilling }] = useAutofillReviewProfileMutation();

    const update = (patch: Partial<ReviewProfile>) => {
        setProfile((p) => ({ ...p, ...patch }));
        setDirty(true);
    };

    const languages = profile.languages?.length ? profile.languages : DEFAULT_REVIEW_LANGUAGES;
    const toggleLanguage = (lang: ReviewLanguage) => {
        if (languages.includes(lang)) {
            if (languages.length === 1) {
                toast.error("Keep at least one language.");
                return;
            }
            update({ languages: languages.filter((l) => l !== lang) });
        } else {
            update({ languages: ALL_LANGUAGES.filter((l) => l === lang || languages.includes(l)) });
        }
    };

    const setService = (index: number, patch: Partial<ReviewProfile["services"][number]>) =>
        update({ services: profile.services.map((s, i) => (i === index ? { ...s, ...patch } : s)) });

    const addService = () => {
        if (profile.services.length >= data.limits.services) {
            toast.error(`You can add up to ${data.limits.services} services.`);
            return;
        }
        update({ services: [...profile.services, { name: "", detail: "" }] });
    };

    const handleAutofill = async () => {
        const hasContent = profile.services.length > 0 || profile.highlights.length > 0 || profile.description;
        if (hasContent && !window.confirm("Replace the category, description, services and highlights with an AI draft? Staff names are kept.")) return;
        try {
            const res = await autofill(id).unwrap();
            setProfile(res.profile);
            setDirty(true);
            toast.success("Draft ready. Check it, edit anything that's wrong, then save.");
        } catch (err) {
            toast.error(errorMessage(err, "Couldn't draft a profile right now."));
        }
    };

    const handleSave = async () => {
        const services = profile.services.filter((s) => s.name.trim());
        try {
            const res = await save({ id, profile: { ...profile, services } }).unwrap();
            setProfile(res.profile);
            setDirty(false);
            toast.success(res.message || "Saved");
        } catch (err) {
            toast.error(errorMessage(err, "Failed to save the profile."));
        }
    };

    const serviceNames = profile.services.map((s) => s.name.trim()).filter(Boolean);
    const likedPreview = [...new Set([...profile.highlights, ...data.defaultLiked])].slice(0, 10);
    const isLive = serviceNames.length > 0 || profile.highlights.length > 0;

    return (
        <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-24 mt-10">
            <Link href="/dashboard/standees" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
                <ArrowLeft size={15} /> Back to QR codes
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 mb-6">
                <div>
                    <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800 flex items-center gap-2">
                        <Sparkles size={20} className="text-amber-500" /> AI review profile
                    </h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {data.qr.businessName}{data.qr.placeAddress ? ` · ${data.qr.placeAddress}` : ""}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutofill}
                        disabled={isFilling}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-60"
                    >
                        {isFilling ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        Auto-fill from Google
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !dirty}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#1A6B45] text-white hover:bg-[#145536] disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                    <Section title="About the business" hint="The AI only uses facts you write here — it never invents prices, results or names.">
                        <div className="space-y-3">
                            <input
                                value={profile.category}
                                maxLength={60}
                                onChange={(e) => update({ category: e.target.value })}
                                placeholder="Category, e.g. Dental clinic, Salon, Restaurant"
                                className={inputCls}
                            />
                            <textarea
                                value={profile.description}
                                maxLength={500}
                                rows={3}
                                onChange={(e) => update({ description: e.target.value })}
                                placeholder="One or two lines about what you do, e.g. Family dental clinic with same-day appointments."
                                className={`${inputCls} resize-none`}
                            />
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Review tone</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {TONES.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => update({ tone: t.id })}
                                            className={`p-2.5 rounded-xl border text-left transition-colors ${profile.tone === t.id ? "border-[#1A6B45] bg-[#E8F5EE]" : "border-gray-200 hover:bg-gray-50"}`}
                                        >
                                            <p className="text-sm font-medium text-gray-800">{t.label}</p>
                                            <p className="text-[11px] text-gray-400">{t.hint}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-gray-500">Review languages <span className="text-gray-400">({languages.length} selected)</span></p>
                                    <button
                                        type="button"
                                        onClick={() => update({ languages: [...DEFAULT_REVIEW_LANGUAGES] })}
                                        className="text-[11px] font-medium text-[#1A6B45] hover:text-[#145536]"
                                    >
                                        Reset to default
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-400 mb-2">Only these appear on this QR&apos;s review page. The first selected one (in this order) is the default; with just one, the language switch is hidden.</p>
                                {LANGUAGE_GROUPS.map((g) => (
                                    <div key={g.id} className="mt-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{g.title}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {LANGUAGES.filter((l) => l.group === g.id).map((l) => {
                                                const on = languages.includes(l.id);
                                                return (
                                                    <button
                                                        key={l.id}
                                                        type="button"
                                                        onClick={() => toggleLanguage(l.id)}
                                                        aria-pressed={on}
                                                        className={`p-2.5 rounded-xl border text-left transition-colors ${on ? "border-[#1A6B45] bg-[#E8F5EE]" : "border-gray-200 hover:bg-gray-50"}`}
                                                    >
                                                        <p className="text-sm font-medium text-gray-800 flex items-center gap-1 truncate">
                                                            {on && <Check size={13} className="text-[#1A6B45] shrink-0" />}
                                                            {l.label}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 truncate">{l.name}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Section title="Services" hint="Customers pick which ones they used. The optional detail gives the AI something specific to mention.">
                        <div className="space-y-2">
                            {profile.services.map((s, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        value={s.name}
                                        maxLength={60}
                                        onChange={(e) => setService(i, { name: e.target.value })}
                                        placeholder="Service, e.g. Teeth cleaning"
                                        className={`${inputCls} sm:w-2/5`}
                                    />
                                    <div className="flex gap-2 flex-1">
                                        <input
                                            value={s.detail}
                                            maxLength={140}
                                            onChange={(e) => setService(i, { detail: e.target.value })}
                                            placeholder="Detail (optional), e.g. painless, takes 30 min"
                                            className={inputCls}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => update({ services: profile.services.filter((_, j) => j !== i) })}
                                            className="px-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                            aria-label="Remove service"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addService} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6B45] hover:text-[#145536]">
                            <Plus size={15} /> Add service
                        </button>
                        <p className="text-[11px] text-gray-400 mt-1.5">{profile.services.length}/{data.limits.services}</p>
                    </Section>

                    <Section title="Highlights" hint="What customers usually praise. Shown first in “What did you like?”, before the standard options.">
                        <TagInput
                            values={profile.highlights}
                            onChange={(highlights) => update({ highlights })}
                            max={data.limits.highlights}
                            maxLength={40}
                            placeholder="e.g. Painless treatment — press Enter"
                        />
                    </Section>

                    <Section title="Staff (optional)" hint="First names only. Customers can pick who helped them, and the review can thank them by name.">
                        <TagInput
                            values={profile.staff}
                            onChange={(staff) => update({ staff })}
                            max={data.limits.staff}
                            maxLength={30}
                            placeholder="e.g. Priya — press Enter"
                        />
                    </Section>
                </div>

                <aside className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-20">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-800">What customers see</h2>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isLive ? "bg-[#E8F5EE] text-[#1A6B45]" : "bg-gray-100 text-gray-500"}`}>
                                {isLive ? "Questions on" : "Generic reviews"}
                            </span>
                        </div>
                        {!isLive && (
                            <p className="text-xs text-gray-400 mt-2">Add at least one service or highlight to turn on the questions.</p>
                        )}

                        {isLive && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-700">Language</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {LANGUAGES.filter((l) => languages.includes(l.id)).map((l) => <span key={l.id} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600">{l.label}</span>)}
                                </div>
                            </div>
                        )}
                        {serviceNames.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-700">Which service did you use?</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {serviceNames.map((n) => <span key={n} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600">{n}</span>)}
                                </div>
                            </div>
                        )}
                        {isLive && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-700">What did you like?</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {likedPreview.map((n) => <span key={n} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600">{n}</span>)}
                                </div>
                            </div>
                        )}
                        {isLive && profile.staff.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-700">Who helped you?</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {profile.staff.map((n) => <span key={n} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600">{n}</span>)}
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] text-gray-400 mt-5 leading-relaxed">
                            Customers can always skip the questions or write their own review. The Google button is never hidden.
                        </p>
                        {data.qr.shortCode && (
                            <a
                                href={`/review/${data.qr.shortCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6B45] hover:text-[#145536]"
                            >
                                Open review page <ExternalLink size={14} />
                            </a>
                        )}
                        {dirty && <p className="text-[11px] text-amber-600 mt-2">Unsaved changes — save to update the live page.</p>}
                    </div>
                </aside>
            </div>
        </div>
    );
}

const AiProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetReviewProfileQuery(id, { skip: !id });

    let content: React.ReactNode;
    if (isLoading) {
        content = (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A6B45]"></div>
            </div>
        );
    } else if (error || !data) {
        content = (
            <div className="px-4 sm:px-6 lg:px-8 pt-5 mt-10">
                <p className="text-sm text-gray-500">This QR code couldn&apos;t be found.</p>
                <Link href="/dashboard/standees" className="text-sm text-[#1A6B45] font-medium">Back to QR codes</Link>
            </div>
        );
    } else {
        content = <ProfileEditor key={data.updatedAt || "new"} id={id} data={data} />;
    }

    return (
        <PlanGate
            requiredPlan="pro"
            featureName="Personalised AI reviews"
            benefits={[
                "Add your services, highlights and staff",
                "Customers tap what they used and liked",
                "Reviews that mention real services, not generic praise",
                "Suggestions in 21 languages, from Hindi and Tamil to Mandarin and French",
                "Auto-fill your profile from Google",
            ]}
        >
            {content}
        </PlanGate>
    );
};

export default AiProfilePage;
