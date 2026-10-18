'use client';

import React from "react";
import { Check, Sparkles } from "lucide-react";

const ClientComingSoon: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    contact?: string;
}> = ({ icon: Icon, title, description, features, contact }) => (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="relative bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] px-6 py-10 text-center text-white sm:px-10">
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Coming soon
            </span>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Icon className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">{description}</p>
        </div>
        <div className="px-6 py-8 sm:px-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">What you&apos;ll be able to do</p>
            <ul className="grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5EE]">
                            <Check className="h-3 w-3 text-[#1A6B45]" />
                        </span>
                        {f}
                    </li>
                ))}
            </ul>
            {contact && <p className="mt-6 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">{contact}</p>}
        </div>
    </div>
);

export default ClientComingSoon;
