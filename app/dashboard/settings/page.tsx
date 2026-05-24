'use client';

import React, { useState, useEffect } from "react";

import { Camera, Save, Loader2 } from "lucide-react";
import { useLazyGetProfileQuery, useUpdateProfileMutation } from '@/store/api/authApi';
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
    const [fetchProfile, { data: profileData, isLoading }] = useLazyGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [form, setForm] = useState({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        emailNotifications: true,
        weeklyReportEnabled: true,
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profileData?.user) {
            setForm({
                businessName: profileData.user.businessName || "",
                ownerName: profileData.user.name || "",
                email: profileData.user.email || "",
                phone: profileData.user.mobile || "",
                emailNotifications: profileData.user.emailNotifications !== false,
                weeklyReportEnabled: profileData.user.weeklyReportEnabled !== false,
            });
        }
    }, [profileData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            await updateProfile({
                name: form.ownerName,
                businessName: form.businessName,
                mobile: form.phone,
                emailNotifications: form.emailNotifications,
                weeklyReportEnabled: form.weeklyReportEnabled,
            }).unwrap();
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Failed to update profile");
        }
    };

    const user = profileData?.user;
    const planLabel = (user?.plan || "free").charAt(0).toUpperCase() + (user?.plan || "free").slice(1);

    if (isLoading) {
        return (
            <>
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="animate-spin text-[#1A6B45]" size={32} />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8 max-w-3xl mt-10">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800">Profile</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Manage your business profile information</p>
                </div>

                {/* Avatar section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-5">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-[#1A6B45] flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Camera size={12} className="text-gray-500" />
                            </button>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{user?.businessName || user?.name || "—"}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{user?.email || "—"}</p>
                            <span className="inline-block mt-1.5 text-xs bg-[#E8F5EE] text-[#1A6B45] font-medium px-2 py-0.5 rounded-full">
                                {planLabel} plan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700 mb-5">Business details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Business name", name: "businessName", type: "text" },
                            { label: "Owner name", name: "ownerName", type: "text" },
                            { label: "Email address", name: "email", type: "email", readonly: true },
                            { label: "Phone number", name: "phone", type: "tel" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={form[field.name as "businessName" | "ownerName" | "email" | "phone"]}
                                    onChange={handleChange}
                                    readOnly={'readonly' in field && field.readonly}
                                    className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] transition-colors ${'readonly' in field && field.readonly ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-5 py-2 bg-[#1A6B45] text-white text-sm font-medium rounded-lg hover:bg-[#165a3a] transition-colors disabled:opacity-50"
                        >
                            <Save size={14} />
                            {isUpdating ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-5 mb-10">
                    <h2 className="text-sm font-semibold text-gray-700 mb-5">Email Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-gray-50 rounded-lg bg-gray-50/50">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Usage Tips & Onboarding</p>
                                <p className="text-xs text-gray-500">Receive helpful tips after creating new QR codes</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={form.emailNotifications}
                                    onChange={(e) => setForm(f => ({ ...f, emailNotifications: e.target.checked }))}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6B45]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-50 rounded-lg bg-gray-50/50">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Weekly Performance Reports</p>
                                <p className="text-xs text-gray-500">Get a summary of your QR scans every Monday</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={form.weeklyReportEnabled}
                                    onChange={(e) => setForm(f => ({ ...f, weeklyReportEnabled: e.target.checked }))}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A6B45]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;