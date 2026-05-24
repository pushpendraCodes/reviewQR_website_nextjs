'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { Camera, Save, MapPin, ExternalLink, ShieldCheck, Lock, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useLazyGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useDeleteAccountMutation, useLogoutMutation } from '@/store/api/authApi';
;
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from '@/store/slices/authSlice';

const ProfilePage: React.FC = () => {
    const [fetchProfile, { data: profileData, isLoading }] = useLazyGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
    const [logout] = useLogoutMutation();
    const navigate = useRouter();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        businessName: "",
        name: "",
        email: "",
        mobile: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profileData?.user) {
            setForm({
                businessName: profileData.user.businessName || "",
                name: profileData.user.name || "",
                email: profileData.user.email || "",
                mobile: profileData.user.mobile || "",
            });
        }
    }, [profileData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("mobile", form.mobile);
            formData.append("businessName", form.businessName);
            if (selectedFile) {
                formData.append("picture", selectedFile);
            }

            const response = await updateProfile(formData).unwrap();

            if (response.user) {
                dispatch(updateUser(response.user));
            }

            toast.success("Profile updated successfully!");
            setSelectedFile(null);
            fetchProfile(); // Refresh profile data
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update profile");
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            await changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            }).unwrap();
            toast.success("Password updated successfully!");
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to change password");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            try {
                await deleteAccount().unwrap();
                toast.success("Account deleted successfully.");
                await logout();
                navigate.push("/login");
            } catch (err: any) {
                toast.error(err.data?.message || "Failed to delete account");
            }
        }
    };

    // if (isLoading) return <div className="flex items-center justify-center h-screen"><>Loading...</></div>;

    const user = profileData?.user;

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8 max-w-4xl mt-10">
                {/* Header */}
                <div className="mb-5 sm:mb-6">
                    <h1 className="text-xl sm:text-[22px] font-semibold text-gray-800">Account Settings</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Manage your personal and business identity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {/* Left Column: Plan & Profile Card */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-3 group">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-100 flex items-center justify-center bg-gray-50 overflow-hidden text-gray-400 text-3xl font-bold">
                                        {
                                            previewUrl || user?.picture ? (
                                                <img src={previewUrl || user?.picture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                user?.name?.[0] || "U"
                                            )
                                        }
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Camera size={14} className="text-gray-500" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                                <p className="text-sm text-gray-400 truncate w-full">{user?.email}</p>

                                <div className="mt-4 w-full pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400">Current Plan</span>
                                        {user?.planExpiredNotifSent ? (
                                            <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 shadow-sm border border-amber-200/50">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                                                Expired
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-[#E8F5EE] text-[#1A6B45] font-bold px-2 py-0.5 rounded-full uppercase">
                                                {user?.plan || "Free"}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-left leading-relaxed">
                                        {user?.planExpiredNotifSent
                                            ? "Renew your plan to remove watermarks, add logos, and unlock premium standees."
                                            : user?.plan === "free"
                                                ? "Upgrade to Pro to remove watermarks and add logos."
                                                : `Active until ${user?.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : 'N/A'}`}
                                    </p>
                                    <button
                                        onClick={() => navigate.push("/pricing")}
                                        className={`w-full mt-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 text-center ${user?.planExpiredNotifSent
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600 hover:shadow-lg border border-transparent'
                                            : 'text-[#1A6B45] border border-[#E8F5EE] hover:bg-[#F0FBF5]'
                                            }`}
                                    >
                                        {user?.planExpiredNotifSent ? 'Renew Plan' : 'Upgrade Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Locations Management Shortcut */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Multi-Location</h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => navigate.push("/dashboard/standees")}
                            >
                                <MapPin size={20} className="text-[#1A6B45]" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Manage Locations</p>
                                    <p className="text-[10px] text-gray-400">Add or edit business branch QRs</p>
                                </div>
                                <ExternalLink size={12} className="ml-auto text-gray-300" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form & Settings */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Profile Details */}
                        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-5 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#1A6B45]" />
                                Personal & Business Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", name: "name", type: "text" },
                                    { label: "Mobile Number", name: "mobile", type: "tel" },
                                    { label: "Primary Business Name", name: "businessName", type: "text" },
                                    { label: "Account Email (readonly)", name: "email", type: "email", readonly: true },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={form[field.name as keyof typeof form]}
                                            onChange={handleChange}
                                            readOnly={field.readonly}
                                            className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] transition-colors ${field.readonly ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-6 pt-6 border-t border-gray-50">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-2.5 bg-[#1A6B45] text-white text-sm font-bold rounded-lg hover:bg-[#165a3a] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {isUpdating ? "Saving..." : "Save Profile Changes"}
                                </button>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-5 flex items-center gap-2">
                                <Lock size={16} className="text-[#1A6B45]" />
                                Security Settings
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                                >
                                    {isChangingPassword ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
                                    Update Password
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50/50 rounded-xl p-5 sm:p-6 shadow-sm border border-red-100">
                            <h2 className="text-sm font-semibold text-red-600 mb-4 sm:mb-5 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Danger Zone
                            </h2>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-700">Delete Account</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeletingAccount}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isDeletingAccount ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
