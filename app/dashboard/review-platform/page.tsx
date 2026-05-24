'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import { Star, Loader2, CheckCircle, ArrowLeft, Send, Lock, RefreshCw, MessageSquare } from "lucide-react";
import { useSubmitPlatformReviewMutation } from '@/store/api/reviewApi';
;
import toast from "react-hot-toast";

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
};

const MAX_CHARS = 600;

const ReviewPlatformPage: React.FC = () => {
    const [rating, setRating] = useState<number>(5);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [text, setText] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [textError, setTextError] = useState<boolean>(false);

    const [submitReview, { isLoading }] = useSubmitPlatformReviewMutation();
    const navigate = useRouter();

    const activeRating = hoveredRating || rating;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setTextError(true);
            toast.error("Please write a review before submitting.");
            return;
        }

        try {
            await submitReview({ rating, text }).unwrap();
            toast.success("Review submitted successfully! Thank you.");
            setSubmitted(true);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit review. Please try again.");
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setText("");
        setRating(5);
        setTextError(false);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Back button */}
                <button
                    onClick={() => navigate.push("/dashboard")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                {/* Success card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>

                    {/* Stars recap */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 transition-colors ${star <= rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-slate-100 text-slate-300"
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-slate-500">{RATING_LABELS[rating]}</span>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                        Your feedback means a lot to us. We read every review and use it to make
                        ReviewQR better for everyone.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate.push("/dashboard")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-amber-200 transition-all active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border border-slate-200 transition-all active:scale-[0.98]"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back button */}
            <button
                onClick={() => navigate.push("/dashboard")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            {/* Header */}
            <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 mb-3">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Share Feedback
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                    How's ReviewQR working for you?
                </h1>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    Your experience helps other businesses discover what works — and helps us
                    build something even better.
                </p>
            </div>

            {/* Form card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
            >
                {/* Rating */}
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Your Rating
                    </label>

                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                                <Star
                                    className={`w-8 h-8 md:w-9 md:h-9 transition-all duration-150 ${star <= activeRating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-slate-100 text-slate-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-slate-500">
                        You selected{" "}
                        <span className="text-slate-700 font-medium">
                            {activeRating} star{activeRating > 1 ? "s" : ""} —{" "}
                            {RATING_LABELS[activeRating]}
                        </span>
                    </p>
                </div>

                <div className="border-t border-slate-100" />

                {/* Review text */}
                <div className="space-y-2">
                    <label
                        htmlFor="review-text"
                        className="block text-xs font-semibold uppercase tracking-widest text-slate-400"
                    >
                        Your Review
                    </label>
                    <textarea
                        id="review-text"
                        value={text}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) {
                                setText(e.target.value);
                            }
                            if (textError && e.target.value.trim()) {
                                setTextError(false);
                            }
                        }}
                        placeholder="Tell us how ReviewQR has helped your business — what's working, what could be better..."
                        rows={6}
                        className={`w-full bg-slate-50 border rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-y transition-all ${textError
                            ? "border-red-400 focus:ring-red-200 bg-red-50"
                            : "border-slate-200 focus:ring-amber-200 focus:border-amber-400"
                            }`}
                    />
                    {/* Char counter + error */}
                    <div className="flex items-center justify-between">
                        {textError ? (
                            <p className="text-xs text-red-500">Please write a review before submitting.</p>
                        ) : (
                            <span />
                        )}
                        <p
                            className={`text-xs ml-auto ${text.length >= MAX_CHARS
                                ? "text-red-500"
                                : text.length >= MAX_CHARS * 0.8
                                    ? "text-amber-500"
                                    : "text-slate-400"
                                }`}
                        >
                            {text.length} / {MAX_CHARS}
                        </p>
                    </div>
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                        Shared with the team only
                    </span>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-medium text-sm shadow-md shadow-amber-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewPlatformPage;