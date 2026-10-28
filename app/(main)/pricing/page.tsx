'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';;
import { ArrowRight, Zap, Check, X } from 'lucide-react';
import PricingCard from '@/components/PricingCard';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { loadRazorpay } from '@/utils/loadRazorpay';
import {
  useGetPricingRegionQuery,
  useGetPricingConfigQuery,
  useCreateOrderMutation,
  useCreateLemonCheckoutMutation,
  useVerifyPaymentMutation,
  useVerifyLemonPaymentMutation,
  usePaymentFailedMutation,
  type PaymentCurrency,
} from '@/store/api/subscriptionApi';

const CURRENCY_STORAGE_KEY = 'reviewqr-pricing-currency';
import { useLazyGetProfileQuery } from '@/store/api/authApi';
import { updateUser } from '@/store/slices/authSlice';
import {
  getPlanDisplayPrices,
  annualSavingsPercent,
  formatPrice,
  priceTableFromConfig,
  PLAN_PRICES_INR,
  PLAN_PRICES_USD,
  type PaidPlanKey,
  type PlanPriceTable,
} from '@/lib/pricing';
import { CLIENT_BLOCK_DAYS, FREE_TRIAL_DAYS, PLAN_GRACE_DAYS } from '@/lib/agencyFeatures';
import AgencyFeaturesSection from '@/components/AgencyFeaturesSection';

const starterInr = getPlanDisplayPrices('starter', 'INR');
const proInr = getPlanDisplayPrices('pro', 'INR');
const agencyInr = getPlanDisplayPrices('agency', 'INR');
const starterUsd = getPlanDisplayPrices('starter', 'USD');
const proUsd = getPlanDisplayPrices('pro', 'USD');
const agencyUsd = getPlanDisplayPrices('agency', 'USD');

const PLAN_KEY_BY_NAME: Record<string, PaidPlanKey> = { Starter: 'starter', Pro: 'pro', Agency: 'agency' };

/** Replaced at runtime with the admin-configured seat numbers and price. */
const TEAM_FEATURE_PLACEHOLDER = 'Team logins for your staff';

const teamFeatureText = (
  team: { includedSeats: number; maxSeats: number; seatPriceMonthly: Record<PaymentCurrency, number> },
  currency: PaymentCurrency
) =>
  team.maxSeats > team.includedSeats
    ? `Team logins: ${team.includedSeats} staff included, up to ${team.maxSeats} (+${formatPrice(team.seatPriceMonthly[currency], currency)}/extra seat/mo)`
    : `Team logins for ${team.includedSeats} staff member${team.includedSeats === 1 ? '' : 's'}`;

const maxSavingsOf = (tables: PlanPriceTable[]) =>
  Math.max(
    0,
    ...tables.flatMap((t) => Object.values(t).map((p) => annualSavingsPercent(p.monthly, p.annual)))
  );

const INR_PLANS = [
  {
    name: 'Free',
    monthlyPrice: '₹0',
    description: `Try ReviewQR free for ${FREE_TRIAL_DAYS} days`,
    qrLimit: '1',
    features: [
      `QR works for ${FREE_TRIAL_DAYS} days`,
      'Basic QR code (square dots, green only)',
      'Watermarked standee',
      'PNG download only',
      'Copy review link',
      'WhatsApp share',
      'Community support',
    ],
    lockedFeatures: [
      'AI review suggestions',
      'Branded landing page',
      'Custom logo & colors',
      'SVG / PDF download',
      'Analytics',
    ],
    popular: false,
    isFree: true,
    ctaText: 'Get Started Free',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Starter',
    monthlyPrice: starterInr.monthlyPrice,
    annualMonthly: starterInr.annualMonthly,
    annualPrice: starterInr.annualPrice,
    currencySymbol: starterInr.currencySymbol,
    annualSavingsPercent: starterInr.savingsPercent,
    description: 'AI reviews + clean standees for small businesses',
    qrLimit: '3',
    features: [
      '3 QR codes',
      'No watermark',
      'Branded Landing Page for customers',
      'AI review suggestions ✨',
      'Business name, rating & address on standee',
      'PNG, SVG & PDF Standee downloads',
      'WhatsApp share',
      'Email support',
    ],
    lockedFeatures: [
      'Custom logo & QR colors',
      'Dot shape customisation',
      'Standee templates (Luxury, Bold, Festive)',
      'Social proof badge',
      'Multi-language standee',
      'Personalised AI reviews (services, staff, 21 languages)',
      'Analytics & Google rating tracking',
      'White label',
      'Team logins',
    ],
    popular: false,
    isFree: false,
    ctaText: 'Get Starter',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Pro',
    monthlyPrice: proInr.monthlyPrice,
    annualMonthly: proInr.annualMonthly,
    annualPrice: proInr.annualPrice,
    currencySymbol: proInr.currencySymbol,
    annualSavingsPercent: proInr.savingsPercent,
    description: 'Personalised AI reviews + full customisation for growing businesses',
    qrLimit: '10',
    features: [
      '10 QR codes',
      'No watermark',
      'Branded Landing Page for customers',
      'Personalised AI reviews: customers pick services & staff ✨',
      'AI reviews in 21 languages (हिंदी, मराठी, தமிழ், 中文, Français…)',
      'Custom logo in QR centre',
      'Custom QR color & dot shape',
      'All standee templates (Minimal, Luxury, Bold, Festive)',
      'Custom standee background color',
      'Social proof badge ("500+ happy customers")',
      'Multi-language standee (EN, हिन्दी, मराठी, தமிழ், తెలుగు)',
      'PNG, SVG & PDF Standee downloads',
      'Analytics dashboard (scan trends & locations)',
      'Live Google rating & review count tracking',
      'Weekly performance report by email',
      'Priority email support',
    ],
    lockedFeatures: [
      'White-label branding',
      'Team logins for your staff',
      'Client logins & dashboard',
      'Client billing & payment collection',
    ],
    popular: true,
    isFree: false,
    ctaText: 'Get Pro',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Agency',
    monthlyPrice: agencyInr.monthlyPrice,
    annualMonthly: agencyInr.annualMonthly,
    annualPrice: agencyInr.annualPrice,
    currencySymbol: agencyInr.currencySymbol,
    annualSavingsPercent: agencyInr.savingsPercent,
    description: 'For agencies managing multiple clients',
    qrLimit: 'Unlimited',
    features: [
      'Unlimited QR codes',
      'Everything in Pro',
      TEAM_FEATURE_PLACEHOLDER,
      'Staff add clients & QRs and see only their own; you see everything',
      'Filter QRs, analytics & Google rating by QR or team member',
      'Client logins: scans, rating, reviews & standee downloads',
      'Client billing tracker (plan, due date, currency, payments)',
      'Collect payments: UPI, payment link, PayPal or bank details',
      'Clients tap "I\'ve paid" and you confirm in one click',
      `Auto-block clients ${CLIENT_BLOCK_DAYS} days after an unpaid due date`,
      'Email alerts for payments and new team clients & QRs',
      'White-label ("Powered by Your Brand")',
      'Client name on standee footer',
      'Phone + WhatsApp support',
    ],
    lockedFeatures: [],
    popular: false,
    isFree: false,
    ctaText: 'Get Agency',
    ctaLink: '/contact',
  },
];

const USD_PLANS = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    currencySymbol: '$',
    description: `Try ReviewQR free for ${FREE_TRIAL_DAYS} days`,
    qrLimit: '1',
    features: INR_PLANS[0].features,
    lockedFeatures: INR_PLANS[0].lockedFeatures,
    popular: false,
    isFree: true,
    ctaText: 'Get Started Free',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Starter',
    monthlyPrice: starterUsd.monthlyPrice,
    annualMonthly: starterUsd.annualMonthly,
    annualPrice: starterUsd.annualPrice,
    currencySymbol: starterUsd.currencySymbol,
    annualSavingsPercent: starterUsd.savingsPercent,
    description: INR_PLANS[1].description,
    qrLimit: '3',
    features: INR_PLANS[1].features,
    lockedFeatures: INR_PLANS[1].lockedFeatures,
    popular: false,
    isFree: false,
    ctaText: 'Get Starter',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Pro',
    monthlyPrice: proUsd.monthlyPrice,
    annualMonthly: proUsd.annualMonthly,
    annualPrice: proUsd.annualPrice,
    currencySymbol: proUsd.currencySymbol,
    annualSavingsPercent: proUsd.savingsPercent,
    description: INR_PLANS[2].description,
    qrLimit: '10',
    features: INR_PLANS[2].features,
    lockedFeatures: INR_PLANS[2].lockedFeatures,
    popular: true,
    isFree: false,
    ctaText: 'Get Pro',
    ctaLink: '/google-review-qr-code-generator',
  },
  {
    name: 'Agency',
    monthlyPrice: agencyUsd.monthlyPrice,
    annualMonthly: agencyUsd.annualMonthly,
    annualPrice: agencyUsd.annualPrice,
    currencySymbol: agencyUsd.currencySymbol,
    annualSavingsPercent: agencyUsd.savingsPercent,
    description: INR_PLANS[3].description,
    qrLimit: 'Unlimited',
    features: INR_PLANS[3].features,
    lockedFeatures: INR_PLANS[3].lockedFeatures,
    popular: false,
    isFree: false,
    ctaText: 'Get Agency',
    ctaLink: '/contact',
  },
];

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<PaymentCurrency | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const navigate = useRouter();
  const user = useSelector((state: any) => state.auth?.user);
  const dispatch = useDispatch();

  const { data: pricingRegion } = useGetPricingRegionQuery();

  const effectiveCurrency: PaymentCurrency =
    selectedCurrency ?? pricingRegion?.currency ?? 'INR';
  const isUsd = effectiveCurrency === 'USD';
  const currencyOverridden =
    selectedCurrency !== null && selectedCurrency !== pricingRegion?.currency;

  const { data: pricingConfig, isLoading: pricesLoading } = useGetPricingConfigQuery();

  const { plans, maxAnnualSavings } = useMemo(() => {
    const currency: PaymentCurrency = isUsd ? 'USD' : 'INR';
    const inrTable = pricingConfig ? priceTableFromConfig(pricingConfig.plans, 'INR') : PLAN_PRICES_INR;
    const usdTable = pricingConfig ? priceTableFromConfig(pricingConfig.plans, 'USD') : PLAN_PRICES_USD;
    const table = isUsd ? usdTable : inrTable;
    const team = pricingConfig?.team;

    const list = (isUsd ? USD_PLANS : INR_PLANS).map((plan) => {
      const key = PLAN_KEY_BY_NAME[plan.name];
      if (!key) return plan;
      const d = getPlanDisplayPrices(key, currency, table);
      const priced = {
        ...plan,
        monthlyPrice: d.monthlyPrice,
        annualMonthly: d.annualMonthly,
        annualPrice: d.annualPrice,
        annualTotal: d.annualTotal,
        currencySymbol: d.currencySymbol,
        annualSavingsPercent: d.savingsPercent,
      };
      if (key !== 'agency' || !team) return priced;
      return {
        ...priced,
        features: plan.features
          .map((f) => (f === TEAM_FEATURE_PLACEHOLDER ? (team.maxSeats > 0 ? teamFeatureText(team, currency) : null) : f))
          .filter((f): f is string => f !== null),
      };
    });

    return { plans: list, maxAnnualSavings: maxSavingsOf([inrTable, usdTable]) };
  }, [isUsd, pricingConfig]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (selectedCurrency !== null) return;
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored === 'INR' || stored === 'USD') {
      setSelectedCurrency(stored);
      return;
    }
    if (pricingRegion?.currency) {
      setSelectedCurrency(pricingRegion.currency);
    }
  }, [pricingRegion, selectedCurrency]);

  const handleCurrencyChange = (currency: PaymentCurrency) => {
    setSelectedCurrency(currency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  };

  const [createOrder] = useCreateOrderMutation();
  const [createLemonCheckout] = useCreateLemonCheckoutMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [verifyLemonPayment] = useVerifyLemonPaymentMutation();
  const [paymentFailed] = usePaymentFailedMutation();
  const [getProfile] = useLazyGetProfileQuery();

  const refreshProfileAfterPayment = async () => {
    try {
      const profileRes = await getProfile().unwrap();
      if (profileRes.success && profileRes.user) {
        dispatch(updateUser({ ...profileRes.user, isVerified: profileRes.user.isVerified }));
      }
    } catch (err) {
      console.error('Failed to fetch updated profile:', err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'success') return;

    const orderId = params.get('order_id');
    let cancelled = false;

    const run = async () => {
      toast.success('Payment received! Activating your plan…');

      // Prefer explicit verify (works on localhost where Lemon webhooks cannot reach us).
      try {
        const verifyRes = await verifyLemonPayment(
          orderId ? { orderId } : {}
        ).unwrap();
        if (verifyRes.success) {
          await refreshProfileAfterPayment();
          toast.success('Payment successful! Plan activated.');
          window.history.replaceState({}, '', '/pricing');
          navigate.push('/google-review-qr-code-generator');
          return;
        }
      } catch (err: any) {
        console.error('Lemon verify failed, falling back to profile poll:', err);
      }

      // Fallback: poll profile in case webhook already activated the plan.
      for (let i = 0; i < 8; i++) {
        if (cancelled) return;
        try {
          const profileRes = await getProfile().unwrap();
          const nextPlan = profileRes?.user?.plan;
          if (profileRes?.success && profileRes?.user && nextPlan && nextPlan !== 'free') {
            dispatch(updateUser(profileRes.user));
            toast.success('Payment successful! Plan activated.');
            break;
          }
        } catch {
          // ignore and retry
        }

        await new Promise((r) => setTimeout(r, 2000));
      }

      window.history.replaceState({}, '', '/pricing');
      navigate.push('/google-review-qr-code-generator');
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getProfile, navigate, verifyLemonPayment]);

  const handleRazorpayPurchase = async (planKey: string, billingCycle: 'monthly' | 'annual') => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error('Razorpay SDK failed to load. Are you offline?');
      return;
    }

    const order = await createOrder({ plan: planKey, billingCycle, currency: 'INR' }).unwrap();

    const options = {
      key: (order.keyId || '').trim(),
      name: 'ReviewQR',
      description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan - ${billingCycle}`,
      order_id: order.razorpayOrderId,
      handler: async function (response: any) {
        try {
          const verifyRes = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }).unwrap();

          if (verifyRes.success) {
            await refreshProfileAfterPayment();
            toast.success('Payment successful! Plan activated.');
            navigate.push('/google-review-qr-code-generator');
          } else {
            toast.error(verifyRes.message || 'Payment verification failed.');
          }
        } catch (err: any) {
          toast.error(err.data?.message || err.message || 'Payment verification failed.');
        }
      },
      modal: {
        ondismiss: function () {
          toast.error('Payment cancelled.');
          paymentFailed({ razorpayOrderId: order.razorpayOrderId });
        },
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: '#1D9E75',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      toast.error(response.error.description || 'Payment failed');
      paymentObject.close();
      paymentFailed({ razorpayOrderId: order.razorpayOrderId });
    });
    paymentObject.open();
  };

  const handleLemonPurchase = async (planKey: string, billingCycle: 'monthly' | 'annual') => {
    const checkout = await createLemonCheckout({ plan: planKey, billingCycle, currency: 'USD' }).unwrap();
    if (!checkout.checkoutUrl) {
      toast.error('Could not start checkout. Please try again.');
      return;
    }
    window.location.href = checkout.checkoutUrl;
  };

  const handlePurchase = async (planKey: string) => {
    console.log('handlePurchase', planKey);
    if (!user) {
      toast('Please log in to continue', { icon: '🔒' });
      navigate.push('/auth/login?redirect=/pricing');
      return;
    }

    if (isUsd && pricingRegion && !pricingRegion.lemonSqueezyEnabled) {
      toast.error('USD payments are not available yet. Please pay in INR or contact support.');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const billingCycle = isAnnual ? 'annual' : 'monthly';
      if (isUsd) {
        await handleLemonPurchase(planKey, billingCycle);
      } else {
        await handleRazorpayPurchase(planKey, billingCycle);
      }
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'An error occurred while creating your order.');
    } finally {
      setLoadingPlan(null);
    }
  };

  // ── Feature comparison table rows ──────────────────────────────────
  const comparisonRows: {
    category: string;
    rows: { feature: string; free: string | boolean; starter: string | boolean; pro: string | boolean; agency: string | boolean }[];
  }[] = [
      {
        category: 'QR Code',
        rows: [
          { feature: 'QR codes', free: '1', starter: '3', pro: '10', agency: 'Unlimited' },
          { feature: 'QR keeps working', free: `${FREE_TRIAL_DAYS} days`, starter: true, pro: true, agency: true },
          { feature: 'Dot shape', free: 'Square only', starter: 'Square only', pro: '5 shapes', agency: '5 shapes' },
          { feature: 'Custom QR color', free: false, starter: false, pro: true, agency: true },
          { feature: 'Logo in QR centre', free: false, starter: false, pro: true, agency: true },
        ],
      },
      {
        category: 'Standee',
        rows: [
          { feature: 'Watermark', free: 'Always', starter: 'None', pro: 'None', agency: 'None' },
          { feature: 'Business info', free: false, starter: true, pro: true, agency: true },
          { feature: 'Templates', free: 'Default only', starter: 'Minimal only', pro: 'All 4', agency: 'All 4' },
          { feature: 'Custom background', free: false, starter: false, pro: true, agency: true },
          { feature: 'Social proof badge', free: false, starter: false, pro: true, agency: true },
          { feature: 'Standee languages', free: 'English only', starter: 'English only', pro: '5 languages', agency: '5 languages' },
          { feature: 'White label footer', free: false, starter: false, pro: false, agency: true },
        ],
      },
      {
        category: 'Downloads',
        rows: [
          { feature: 'PNG download', free: true, starter: true, pro: true, agency: true },
          { feature: 'SVG download', free: false, starter: true, pro: true, agency: true },
          { feature: 'PDF Standee', free: false, starter: true, pro: true, agency: true },
        ],
      },
      {
        category: 'Customer Experience',
        rows: [
          { feature: 'Branded landing page', free: false, starter: true, pro: true, agency: true },
          { feature: 'AI review suggestions', free: false, starter: true, pro: true, agency: true },
          { feature: 'Personalised AI reviews (services, highlights, staff)', free: false, starter: false, pro: true, agency: true },
          { feature: 'AI review languages', free: false, starter: 'English', pro: '21 languages', agency: '21 languages' },
          { feature: 'One-tap copy to clipboard', free: false, starter: true, pro: true, agency: true },
        ],
      },
      {
        category: 'Insights',
        rows: [
          { feature: 'Dashboard overview', free: false, starter: false, pro: true, agency: true },
          { feature: 'Scan analytics (trends & locations)', free: false, starter: false, pro: true, agency: true },
          { feature: 'Live Google rating & review count', free: false, starter: false, pro: true, agency: true },
          { feature: 'Weekly performance email', free: false, starter: false, pro: true, agency: true },
          { feature: 'Reply to Google reviews with AI', free: false, starter: false, pro: 'Coming soon', agency: 'Coming soon' },
        ],
      },
      {
        category: 'Agency & team',
        rows: [
          {
            feature: 'Team member logins',
            free: false,
            starter: false,
            pro: false,
            agency: pricingConfig
              ? pricingConfig.team.maxSeats > pricingConfig.team.includedSeats
                ? `${pricingConfig.team.includedSeats} included, up to ${pricingConfig.team.maxSeats}`
                : pricingConfig.team.maxSeats > 0
                  ? `${pricingConfig.team.includedSeats} staff`
                  : false
              : true,
          },
          ...(pricingConfig && pricingConfig.team.maxSeats > pricingConfig.team.includedSeats
            ? [{
                feature: 'Extra team seats',
                free: false,
                starter: false,
                pro: false,
                agency: `${formatPrice(pricingConfig.team.seatPriceMonthly[effectiveCurrency], effectiveCurrency)}/seat/mo`,
              }]
            : []),
          { feature: 'Staff see only their own QRs', free: false, starter: false, pro: false, agency: true },
          { feature: 'Staff can add clients, not change billing', free: false, starter: false, pro: false, agency: true },
          { feature: 'See every QR, filter by team member', free: false, starter: false, pro: false, agency: true },
          { feature: 'Email alerts when staff add clients or QRs', free: false, starter: false, pro: false, agency: true },
        ],
      },
      {
        category: 'Clients & billing',
        rows: [
          { feature: 'Client logins (scans, rating & reviews)', free: false, starter: false, pro: false, agency: true },
          { feature: 'Clients download their own standees', free: false, starter: false, pro: false, agency: true },
          { feature: 'Client billing tracker (plan & due dates)', free: false, starter: false, pro: false, agency: true },
          { feature: 'Bill each client in INR, USD and more', free: false, starter: false, pro: false, agency: true },
          { feature: 'Your payment methods (UPI, link, PayPal, bank)', free: false, starter: false, pro: false, agency: true },
          { feature: '"I\'ve paid" claims with one-click confirm', free: false, starter: false, pro: false, agency: true },
          { feature: 'Email when a client reports a payment', free: false, starter: false, pro: false, agency: true },
          { feature: 'Auto-block overdue clients', free: false, starter: false, pro: false, agency: `After ${CLIENT_BLOCK_DAYS} days` },
        ],
      },
    ];

  const planNames = ['Free', 'Starter', 'Pro', 'Agency'];
  const planKeys = ['free', 'starter', 'pro', 'agency'] as const;

  const Cell = ({ value }: { value: string | boolean }) => {
    if (value === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
    if (value === false) return <X className="w-4 h-4 text-gray-200 mx-auto" />;
    return <span className="text-xs text-gray-600 font-medium">{value}</span>;
  };

  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-white via-primary-light/20 to-white py-14 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <Zap className="w-4 h-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
            Start free. Upgrade for AI review suggestions, branded landing pages, print-ready standees and Google rating
            tracking. Pro adds personalised AI reviews that mention the services your customers actually used, in 21 languages. Agencies get team logins, client dashboards and client billing with payment collection.
          </p>

          {/* Currency switcher */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pay in
            </span>
            <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleCurrencyChange('INR')}
                className={`px-4 py-2 cursor-pointer text-sm font-semibold rounded-lg transition-all duration-200 ${
                  !isUsd ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange('USD')}
                disabled={pricingRegion !== undefined && !pricingRegion.lemonSqueezyEnabled}
                className={`px-4 py-2 text-sm cursor-pointer font-semibold rounded-lg transition-all duration-200 ${
                  isUsd ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                $ USD
              </button>
            </div>
            {pricingRegion && (
              <p className="text-xs text-gray-400 max-w-md">
                {currencyOverridden
                  ? `Showing ${effectiveCurrency} prices (your choice)`
                  : `Suggested for your region${pricingRegion.country !== 'unknown' ? ` (${pricingRegion.country})` : ''}`}
                {isUsd ? ' · Card checkout via Lemon Squeezy' : ' · UPI & cards via Razorpay'}
              </p>
            )}
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${!isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Annual
              {maxAnnualSavings > 0 && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Save up to {maxAnnualSavings}%
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {plans.map((plan, index) => {
              const planKey = plan.name.toLowerCase();
              const isPaidPlan = planKey === 'starter' || planKey === 'pro' || planKey === 'agency';
              const displayCtaText =
                hydrated && user?.planExpiredNotifSent && isPaidPlan
                  ? `Renew ${plan.name}`
                  : plan.ctaText;

              return (
                <PricingCard
                  key={index}
                  {...plan}
                  ctaText={displayCtaText}
                  isAnnual={isAnnual}
                  isPriceLoading={pricesLoading && isPaidPlan}
                  isLoading={loadingPlan === planKey}
                  onPurchase={isPaidPlan ? () => handlePurchase(planKey) : undefined}
                />
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            On the Free plan, your QR code works for {FREE_TRIAL_DAYS} days from when you create it. If a paid plan
            isn&apos;t renewed, every QR code keeps working for {PLAN_GRACE_DAYS} days. We email you 3 days before
            anything stops, and upgrading brings paused QR codes back instantly — nothing is deleted or needs reprinting.
          </p>
        </div>
      </section>

      <AgencyFeaturesSection showCta={false} />

      {/* ── Feature comparison table ─────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-2">
            Compare plans in detail
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Exactly what you get at each tier — no surprises.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm border-collapse">
              {/* Header */}
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-semibold text-gray-400 w-[40%]">Feature</th>
                  {planNames.map((name, i) => (
                    <th key={name} className="p-4 text-center">
                      <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${i === 0 ? 'bg-gray-400' :
                        i === 1 ? 'bg-blue-500' :
                          i === 2 ? 'bg-violet-500' :
                            'bg-rose-500'
                        }`}>
                        {name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>



              <tbody>
                {comparisonRows.map((group) => (
                  <Fragment key={group.category}>
                    {/* Category row */}
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {group.category}
                      </td>
                    </tr>

                    {group.rows.map((row) => (
                      <tr key={row.feature} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-600">{row.feature}</td>
                        {planKeys.map((key) => (
                          <td key={key} className="p-4 text-center">
                            <Cell value={row[key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-light to-secondary-light rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Not sure which plan is right?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Start with the Free plan — no credit card required. Upgrade anytime as
              your business grows. Our team is happy to help you decide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/google-review-qr-code-generator"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-95 flex items-center gap-2 group"
              >
                Try Free Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-secondary hover:text-secondary transition-all duration-200 active:scale-95"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;