'use client';

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';;
import {
    Star,
    Copy,
    Check,
    ExternalLink,
    Loader2,
    MessageSquare,
    Sparkles,
    ShieldCheck,
    Info
} from "lucide-react";
import { useGetLandingDataQuery, useGenerateAIReviewsMutation } from '@/store/api/landingApi';
import toast, { Toaster } from "react-hot-toast";

const ReviewLandingPage: React.FC = () => {
    const { shortCode } = useParams<{ shortCode: string }>();
    const { data: landingData, isLoading: isLandingLoading, error } = useGetLandingDataQuery(shortCode || "");
    const [generateAIReviews, { data: aiData, isLoading: isAiLoading }] = useGenerateAIReviewsMutation();

    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [selectedReview, setSelectedReview] = useState<string | null>(null);

    useEffect(() => {
        if (landingData?.aiEnabled && shortCode) {
            generateAIReviews(shortCode);
        }
    }, [landingData, shortCode, generateAIReviews]);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setSelectedReview(text);
        toast.success("Review copied to clipboard!", {
            icon: '📋',
            style: {
                borderRadius: '10px',
                background: '#1A6B45',
                color: '#fff',
            },
        });
        setTimeout(() => setCopiedIndex(null), 3000);
    };

    const handleOpenGoogle = () => {
        if (!selectedReview) {
            toast.error("Please pick a review first!", {
                style: { borderRadius: '10px' }
            });
            return;
        }
        window.open(landingData?.reviewUrl, "_blank");
    };

    if (isLandingLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#1A6B45] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading business profile...</p>
                </div>
            </div>
        );
    }

    if (error || !landingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 text-sm mb-6">This review link may have expired or is invalid.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const reviews = aiData?.reviews || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-8 px-4 sm:px-6">
            <Toaster position="top-center" />

            {/* Header / Logo Section */}
            <div className="w-full max-w-md mb-8 flex flex-col items-center">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                        {landingData.logoUrl ? (
                            <img src={landingData.logoUrl} alt={landingData.businessName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1A6B45] to-[#2ECC71] flex items-center justify-center text-white text-3xl font-bold">
                                {landingData.businessName[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <h1 className="mt-6 text-2xl font-black text-gray-900 text-center tracking-tight">
                    {landingData.businessName}
                </h1>

                <div className="mt-2 flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(landingData.placeRating || 5) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{landingData.placeRating || 5.0}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{landingData.totalReviews || 0} Reviews</span>
                </div>
            </div>

            {/* AI Review Section */}
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2ECC71]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1A6B45]/5 rounded-full blur-3xl"></div>

                <div className="relative">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-[#E8F5EE] rounded-lg flex items-center justify-center">
                            <Sparkles size={16} className="text-[#1A6B45]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">AI Review Suggestions</h2>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Pick one to copy & paste</p>
                        </div>
                    </div>

                    {isAiLoading ? (
                        <div className="space-y-4 py-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse flex flex-col p-4 gap-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((text, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleCopy(text, idx)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative group overflow-hidden ${selectedReview === text
                                            ? "border-[#1A6B45] bg-[#F0FDF4]"
                                            : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"
                                        }`}
                                >
                                    <p className="text-gray-700 text-sm leading-relaxed pr-8 font-medium">
                                        "{text}"
                                    </p>
                                    <div className={`absolute top-4 right-4 ${selectedReview === text ? "text-[#1A6B45]" : "text-gray-300 group-hover:text-gray-400"}`}>
                                        {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                                    </div>

                                    {/* Selection indicator */}
                                    {selectedReview === text && (
                                        <div className="absolute bottom-0 left-0 h-1 bg-[#1A6B45] w-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step Instructions */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                                1
                            </div>
                            <p className="text-sm text-blue-900 font-medium leading-snug">
                                Tap a suggestion above to <span className="font-bold underline">copy</span> the review text.
                            </p>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                                2
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-blue-900 font-medium leading-snug">
                                    Click the button below to open Google Reviews and <span className="font-bold underline">paste</span> your text.
                                </p>
                                <p className="text-[11px] text-blue-500 font-semibold italic flex items-center gap-1">
                                    <Info size={10} /> Tip: Long press on the review box to paste!
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenGoogle}
                            disabled={!selectedReview}
                            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 group ${selectedReview
                                    ? "bg-gradient-to-r from-[#1A6B45] to-[#2ECC71] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[#1A6B45]/25"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Open Google Reviews
                            <ExternalLink size={20} className={selectedReview ? "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-8 flex items-center gap-2 text-gray-400">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Verified Review Page</span>
            </div>

            <p className="mt-4 text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
                Powered by getreviewqr.com
            </p>
        </div>
    );
};

export default ReviewLandingPage;
