'use client';

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Armchair, Loader2, Minus, Plus, CalendarClock, Info } from "lucide-react";
import {
    useGetSeatQuoteQuery,
    useCreateSeatCheckoutMutation,
    useReduceSeatsMutation,
    type SeatCurrency,
    type TeamSeatsInfo,
} from "@/store/api/teamApi";
import {
    useGetPricingRegionQuery,
    usePaymentFailedMutation,
    useVerifyLemonPaymentMutation,
    useVerifyPaymentMutation,
} from "@/store/api/subscriptionApi";
import { useAppSelector } from "@/store/hooks";
import { loadRazorpay } from "@/utils/loadRazorpay";

const CURRENCY_STORAGE_KEY = "reviewqr-pricing-currency";

const errMsg = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

export const formatMoney = (minor: number, currency: SeatCurrency) =>
    currency === "INR"
        ? `₹${(minor / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
        : `$${(minor / 100).toFixed(2)}`;

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

type RazorpayCtor = new (options: Record<string, unknown>) => {
    open: () => void;
    close: () => void;
    on: (event: string, cb: (res: { error?: { description?: string } }) => void) => void;
};

/** Finishes a Lemon Squeezy seat purchase after the redirect back to /dashboard/team. */
export const useSeatPaymentReturn = (onDone: () => void) => {
    const [verifyLemonPayment] = useVerifyLemonPaymentMutation();
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get("seats") !== "success") return;
        ran.current = true;

        const rawOrderId = params.get("order_id");
        const orderId = rawOrderId && !rawOrderId.startsWith("[") ? rawOrderId : undefined;
        window.history.replaceState({}, "", "/dashboard/team");

        const id = toast.loading("Payment received — adding your seats…");
        verifyLemonPayment({ orderId, kind: "seats" })
            .unwrap()
            .then((res) => toast.success(res.message || "Seats added!", { id }))
            .catch((err) => toast.error(errMsg(err, "We couldn't confirm the payment yet. Refresh in a minute."), { id }))
            .finally(onDone);
    }, [verifyLemonPayment, onDone]);
};

interface Props {
    seats: TeamSeatsInfo;
    seatsUsed: number;
    canManage: boolean;
    onChanged: () => void;
}

const TeamSeatsCard: React.FC<Props> = ({ seats, seatsUsed, canManage, onChanged }) => {
    const user = useAppSelector((s) => s.auth.user);
    const { data: region } = useGetPricingRegionQuery();
    const [picked, setPicked] = useState<SeatCurrency | null>(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem(CURRENCY_STORAGE_KEY) : null;
        return stored === "INR" || stored === "USD" ? stored : null;
    });
    const currency: SeatCurrency = picked ?? region?.currency ?? "INR";

    const available = Math.max(0, seats.maxExtra - seats.extra);
    const [qty, setQty] = useState(1);
    const quantity = Math.min(Math.max(1, qty), Math.max(1, available));
    const canBuy = canManage && available > 0;

    const { data: quote, isFetching: quoting, error: quoteError } = useGetSeatQuoteQuery(
        { seats: quantity, currency },
        { skip: !canBuy }
    );
    const [createCheckout, { isLoading: startingCheckout }] = useCreateSeatCheckoutMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [paymentFailed] = usePaymentFailedMutation();
    const [reduceSeats, { isLoading: reducing }] = useReduceSeatsMutation();
    const [paying, setPaying] = useState(false);

    const minExtra = Math.max(0, seatsUsed - seats.included);
    const [reduceTo, setReduceTo] = useState<number | null>(null);

    const perSeat = seats.pricePerMonth[currency];
    const renewalSeatCost = seats.extra * perSeat;
    const expiry = seats.planExpiresAt ? new Date(seats.planExpiresAt).toLocaleDateString() : null;

    const switchCurrency = (c: SeatCurrency) => {
        setPicked(c);
        localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    };

    const handleBuy = async () => {
        setPaying(true);
        try {
            const checkout = await createCheckout({ seats: quantity, currency }).unwrap();

            if (checkout.provider === "lemon_squeezy") {
                window.location.href = checkout.checkoutUrl;
                return;
            }

            if (!(await loadRazorpay())) {
                toast.error("Razorpay failed to load. Are you offline?");
                setPaying(false);
                return;
            }

            const Razorpay = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
            const rzp = new Razorpay({
                key: checkout.keyId,
                name: "ReviewQR",
                description: checkout.label,
                order_id: checkout.razorpayOrderId,
                prefill: { name: user?.name, email: user?.email },
                theme: { color: "#1D9E75" },
                handler: async (res: RazorpayResponse) => {
                    try {
                        await verifyPayment({
                            razorpayOrderId: res.razorpay_order_id,
                            razorpayPaymentId: res.razorpay_payment_id,
                            razorpaySignature: res.razorpay_signature,
                        }).unwrap();
                        toast.success(`${checkout.label} added!`);
                        setQty(1);
                        onChanged();
                    } catch (err) {
                        toast.error(errMsg(err, "Payment verification failed. Contact support if you were charged."));
                    } finally {
                        setPaying(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPaying(false);
                        paymentFailed({ razorpayOrderId: checkout.razorpayOrderId });
                    },
                },
            });
            rzp.on("payment.failed", (res) => {
                toast.error(res.error?.description || "Payment failed");
                rzp.close();
                setPaying(false);
                paymentFailed({ razorpayOrderId: checkout.razorpayOrderId });
            });
            rzp.open();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't start checkout"));
            setPaying(false);
        }
    };

    const handleReduce = async () => {
        if (reduceTo === null) return;
        try {
            const res = await reduceSeats({ extraSeats: reduceTo }).unwrap();
            toast.success(res.message);
            setReduceTo(null);
            onChanged();
        } catch (err) {
            toast.error(errMsg(err, "Couldn't update seats"));
        }
    };

    return (
        <div id="team-seats" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                        <Armchair className="h-5 w-5 text-[#1A6B45]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Extra seats</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                            {seats.included} included with Agency
                            {seats.extra > 0 && <> + <span className="font-semibold text-gray-700">{seats.extra} extra</span></>}
                            {" "}· up to {seats.max} team members in total
                        </p>
                    </div>
                </div>
                <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
                    {(["INR", "USD"] as const).map((c) => (
                        <button
                            key={c}
                            onClick={() => switchCurrency(c)}
                            className={`rounded-md px-2.5 py-1 transition-colors ${currency === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {canBuy ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <div className="flex items-center gap-1 self-start rounded-xl border border-gray-200 p-1">
                        <button
                            onClick={() => setQty(quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Fewer seats"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-base font-semibold tabular-nums text-gray-900">{quantity}</span>
                        <button
                            onClick={() => setQty(quantity + 1)}
                            disabled={quantity >= available}
                            aria-label="More seats"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="text-sm">
                        <p className="text-gray-700">
                            <span className="font-semibold">{formatMoney(perSeat, currency)}</span>
                            <span className="text-gray-500"> per seat / month</span>
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {quote
                                ? <>Pay only for the {quote.days} day{quote.days === 1 ? "" : "s"} left{expiry && <> until {expiry}</>}</>
                                : quoteError
                                    ? errMsg(quoteError, "Couldn't price seats")
                                    : "Calculating…"}
                        </p>
                    </div>

                    <button
                        onClick={handleBuy}
                        disabled={!quote || quoting || paying || startingCheckout}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#1A6B45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#165a3a] disabled:opacity-50"
                    >
                        {(paying || startingCheckout || quoting) && <Loader2 className="h-4 w-4 animate-spin" />}
                        {quote ? `Pay ${formatMoney(quote.amount, currency)}` : "Add seats"}
                    </button>
                </div>
            ) : (
                <p className="mt-4 text-sm text-gray-500">
                    {!canManage
                        ? "Renew your Agency plan to add seats."
                        : `You have the maximum of ${seats.max} team seats.`}
                </p>
            )}

            {seats.extra > 0 && (
                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                    <p className="flex items-start gap-2 text-xs text-gray-500">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span>
                            Your {seats.extra} extra seat{seats.extra === 1 ? "" : "s"} renew with your Agency plan:{" "}
                            <span className="font-semibold text-gray-700">+{formatMoney(renewalSeatCost, currency)}/month</span> on each renewal.
                        </span>
                    </p>
                    {seats.extra > minExtra && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-gray-500">Don&apos;t need them all?</span>
                            <select
                                value={reduceTo ?? ""}
                                onChange={(e) => setReduceTo(e.target.value === "" ? null : Number(e.target.value))}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-[#1A6B45] focus:outline-none"
                            >
                                <option value="">Keep {seats.extra} extra</option>
                                {Array.from({ length: seats.extra - minExtra }, (_, i) => minExtra + i).map((n) => (
                                    <option key={n} value={n}>Reduce to {n} extra</option>
                                ))}
                            </select>
                            {reduceTo !== null && (
                                <button
                                    onClick={handleReduce}
                                    disabled={reducing}
                                    className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {reducing && <Loader2 className="h-3 w-3 animate-spin" />}
                                    Confirm
                                </button>
                            )}
                            <span className="w-full text-[11px] text-gray-400">
                                Removed seats aren&apos;t refunded for the current period, but you won&apos;t pay for them at renewal.
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamSeatsCard;
