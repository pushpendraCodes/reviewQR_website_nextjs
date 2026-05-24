'use client';

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, LayoutDashboard, BarChart2, Star, User, Menu, X, Lock, Home, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useListQRCodesQuery } from "../../store/api/qrApi";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
    /** Minimum plan required to access this page (pages still render blurred via PlanGate) */
    requiredPlan?: "free" | "starter" | "pro" | "agency";
};

const PLAN_RANK: Record<string, number> = {
    free: 0, starter: 1, pro: 2, agency: 3,
};

const mainNav: NavItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard", requiredPlan: "pro" },
    { label: "My QR standees", icon: <QrCode size={18} />, href: "/dashboard/standees" },
    { label: "Analytics", icon: <BarChart2 size={18} />, href: "/dashboard/analytics", requiredPlan: "pro" },
    { label: "Google rating", icon: <Star size={18} />, href: "/dashboard/google-rating", requiredPlan: "pro" },
];

const accountNav: NavItem[] = [
    { label: "Profile", icon: <User size={18} />, href: "/dashboard/profile" },
    { label: "Settings", icon: <Settings size={18} />, href: "/dashboard/settings" },
    { label: "Review Us", icon: <Star size={18} />, href: "/dashboard/review-platform" },
];

const allNav = [...mainNav, ...accountNav];

// Plan-based QR limits
const PLAN_LIMITS: Record<string, number> = {
    free: 1,
    starter: 5,
    pro: 10,
    agency: 50,
};

const Sidebar: React.FC = () => {
    const navigate = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [mounted, setMounted] = useState(false); // ← add this

    useEffect(() => {
        setMounted(true); // ← add this
    }, []);

    // Real user data from Redux store
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: qrData } = useListQRCodesQuery();

    const displayName = user?.businessName || user?.name || "My Business";
    const plan = user?.plan || "free";
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
    const qrCount = qrData?.total ?? qrData?.qrCodes?.length ?? 0;
    const qrLimit = PLAN_LIMITS[plan] ?? 1;
    const usagePercent = Math.min((qrCount / qrLimit) * 100, 100);

    const hasPlanAccess = (required?: string) =>
        !required || PLAN_RANK[plan] >= PLAN_RANK[required];

    const isActive = (href: string): boolean => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const NavButton: React.FC<{ item: NavItem; onClick?: () => void }> = ({ item, onClick }) => {
        const locked = !hasPlanAccess(item.requiredPlan);

        return (
            <button
                onClick={() => { navigate.push(item.href); onClick?.(); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors
                    ${isActive(item.href)
                        ? "bg-[#2ECC71]/20 text-white font-medium"
                        : "text-[#A8C9B8] hover:bg-white/5 hover:text-white"
                    }`}
            >
                <span className={isActive(item.href) ? "text-[#2ECC71]" : ""}>
                    {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {locked && (
                    <Lock size={12} className="text-[#6BAA8A]/60 shrink-0" />
                )}
            </button>
        );
    };

    /** Reusable bottom user info block */
    const UserInfoBlock = () => (
        <div className="px-2">
            <button
                onClick={() => navigate.push("/")}
                className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-lg text-sm w-full text-left transition-colors text-[#A8C9B8] hover:bg-white/5 hover:text-white"
            >
                <Home size={18} />
                <span>Back to Home</span>
            </button>
            <div className="border-t border-[#2E5040] pt-4">
                {/* ← wrap everything user-dependent with mounted check */}
                {mounted ? (
                    <>
                        <p className="text-white text-sm font-semibold leading-tight truncate">{displayName}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${user?.planExpiredNotifSent ? 'bg-amber-500 animate-pulse' : 'bg-[#2ECC71]'}`} />
                            <p className={`text-[11px] ${user?.planExpiredNotifSent ? 'text-amber-400 font-semibold' : 'text-[#6BAA8A]'}`}>
                                {user?.planExpiredNotifSent ? 'Plan Expired' : `${planLabel} plan`} · {qrCount}/{qrLimit} QRs used
                            </p>
                        </div>
                        <div className="mt-2 h-1 bg-[#2E5040] rounded-full">
                            <div className="h-1 bg-[#2ECC71] rounded-full" style={{ width: `${usagePercent}%` }} />
                        </div>
                        {user?.planExpiredNotifSent && (
                            <button
                                onClick={() => navigate.push("/pricing")}
                                className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm active:scale-[0.98] text-center"
                            >
                                Renew Plan
                            </button>
                        )}
                    </>
                ) : (
                    // Skeleton placeholder — matches server render, no mismatch
                    <div className="animate-pulse">
                        <div className="h-4 bg-[#2E5040] rounded w-3/4 mb-2" />
                        <div className="h-3 bg-[#2E5040] rounded w-1/2 mb-2" />
                        <div className="mt-2 h-1 bg-[#2E5040] rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <aside className="hidden md:flex w-[185px] min-w-[185px] h-screen bg-[#1A3A2E] flex-col justify-between py-5 px-3">
                {/* Logo */}
                <div>
                    <div
                        className="flex items-center gap-2 px-2 mb-8 cursor-pointer"
                        onClick={() => navigate.push("/")}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm leading-none">ReviewQR</p>
                            <p className="text-[#6BAA8A] text-[10px] leading-tight">getreviewqr.com</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-[#6BAA8A] text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
                            Main
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            {mainNav.map((item) => (
                                <NavButton key={item.href} item={item} />
                            ))}
                        </nav>
                    </div>

                    <div>
                        <p className="text-[#6BAA8A] text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
                            Account
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            {accountNav.map((item) => (
                                <NavButton key={item.href} item={item} />
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom user info */}
                <UserInfoBlock />
            </aside>

            {/* ── Mobile: top bar ── */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A3A2E] flex items-center justify-between px-4 py-3 shadow-lg">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate.push("/dashboard")}
                >
                    <div className="w-7 h-7 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                        <QrCode size={15} className="text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">ReviewQR</p>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="text-[#A8C9B8] p-1"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>
            </div>

            {/* ── Mobile: drawer overlay ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="relative w-[240px] h-full bg-[#1A3A2E] flex flex-col justify-between py-5 px-3 shadow-2xl">
                        {/* Header */}
                        <div>
                            <div className="flex items-center justify-between px-2 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                                        <QrCode size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm leading-none">ReviewQR</p>
                                        <p className="text-[#6BAA8A] text-[10px] leading-tight">getreviewqr.com</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="text-[#A8C9B8] p-1"
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-[#6BAA8A] text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
                                    Main
                                </p>
                                <nav className="flex flex-col gap-0.5">
                                    {mainNav.map((item) => (
                                        <NavButton key={item.href} item={item} onClick={() => setMobileOpen(false)} />
                                    ))}
                                </nav>
                            </div>

                            <div>
                                <p className="text-[#6BAA8A] text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
                                    Account
                                </p>
                                <nav className="flex flex-col gap-0.5">
                                    {accountNav.map((item) => (
                                        <NavButton key={item.href} item={item} onClick={() => setMobileOpen(false)} />
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Bottom user info */}
                        <UserInfoBlock />
                    </aside>
                </div>
            )}

            {/* ── Mobile: bottom tab bar ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A3A2E] border-t border-[#2E5040] flex items-center justify-around px-2 py-2">
                {allNav.slice(0, 5).map((item) => {
                    const active = isActive(item.href);
                    const locked = !hasPlanAccess(item.requiredPlan);
                    return (
                        <button
                            key={item.href}
                            onClick={() => navigate.push(item.href)}
                            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors relative"
                        >
                            <span className={active ? "text-[#2ECC71]" : "text-[#6BAA8A]"}>
                                {item.icon}
                            </span>
                            <span className={`text-[9px] font-medium leading-tight ${active ? "text-[#2ECC71]" : "text-[#6BAA8A]"}`}>
                                {item.label.split(" ")[0]}
                            </span>
                            {locked && (
                                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2E5040] rounded-full flex items-center justify-center">
                                    <Lock size={7} className="text-[#6BAA8A]" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>
        </>
    );
};

export default Sidebar;