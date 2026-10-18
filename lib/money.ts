import type { BillingCurrency, PaymentClaimMethod } from "@/store/api/clientPortalApi";

export const BILLING_CURRENCIES: { code: BillingCurrency; label: string }[] = [
    { code: "INR", label: "₹ INR — Indian Rupee" },
    { code: "USD", label: "$ USD — US Dollar" },
    { code: "EUR", label: "€ EUR — Euro" },
    { code: "GBP", label: "£ GBP — British Pound" },
    { code: "AUD", label: "A$ AUD — Australian Dollar" },
    { code: "CAD", label: "C$ CAD — Canadian Dollar" },
    { code: "AED", label: "AED — UAE Dirham" },
    { code: "SGD", label: "S$ SGD — Singapore Dollar" },
];

/** Must match BLOCK_AFTER_DAYS in be/src/services/clientBilling.service.js. */
export const BLOCK_AFTER_DAYS = 15;

export const formatAmount = (n: number, currency: string = "INR") => {
    try {
        return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: n % 1 ? 2 : 0,
            maximumFractionDigits: 2,
        }).format(n);
    } catch {
        return `${currency} ${n.toLocaleString()}`;
    }
};

export const currencySymbol = (currency: string = "INR") =>
    formatAmount(0, currency).replace(/[\d.,\s]/g, "") || currency;

/** Opens the payer's UPI app with payee, amount and note pre-filled. */
export const upiPayUrl = (upiId: string, payeeName: string, amount: number, note: string) => {
    const params = new URLSearchParams({ pa: upiId, cu: "INR", tn: note.slice(0, 50) });
    if (payeeName) params.set("pn", payeeName);
    if (amount > 0) params.set("am", amount.toFixed(2));
    return `upi://pay?${params.toString()}`;
};

export const paypalPayUrl = (handle: string, amount: number, currency: string) =>
    `https://paypal.me/${encodeURIComponent(handle)}${amount > 0 ? `/${amount}${currency}` : ""}`;

export const CLAIM_METHOD_LABEL: Record<PaymentClaimMethod, string> = {
    upi: "UPI",
    link: "Card / online",
    paypal: "PayPal",
    bank: "Bank transfer",
    other: "Other",
};
