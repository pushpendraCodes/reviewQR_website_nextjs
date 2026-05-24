'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';;
import { ArrowRight, Zap, Check, X } from 'lucide-react';
import PricingCard from '@/components/PricingCard';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { useCreateOrderMutation, useVerifyPaymentMutation, usePaymentFailedMutation } from '@/store/api/subscriptionApi';
import { useLazyGetProfileQuery } from '@/store/api/authApi';
import { updateUser } from '@/store/slices/authSlice';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const navigate = useRouter();
  const user = useSelector((state: any) => state.auth?.user);
  const dispatch = useDispatch();

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [paymentFailed] = usePaymentFailedMutation();
  const [getProfile] = useLazyGetProfileQuery();

  const handlePurchase = async (planKey: string) => {
    if (!user) {
      toast('Please log in to continue', { icon: '🔒' });
      navigate.push('/auth/login?returnTo=/pricing');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you offline?");
        return;
      }

      // Create Order
      const billingCycle = isAnnual ? 'annual' : 'monthly';
      const order = await createOrder({ plan: planKey, billingCycle }).unwrap();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ReviewQR",
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
              try {
                const profileRes = await getProfile().unwrap();
                if (profileRes.success && profileRes.user) {
                  dispatch(updateUser({ ...profileRes.user, isVerified: profileRes.user.isVerified }));
                }
              } catch (err) {
                console.error("Failed to fetch updated profile:", err);
              }
              toast.success("Payment successful! Plan activated.");
              navigate.push('/generate');
            } else {
              toast.error(verifyRes.message || "Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(err.data?.message || err.message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled.");
            paymentFailed({ razorpayOrderId: order.razorpayOrderId });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#1D9E75",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        toast.error(response.error.description || "Payment failed");
        paymentObject.close();
        paymentFailed({ razorpayOrderId: order.razorpayOrderId });
      });
      paymentObject.open();

    } catch (err: any) {
      toast.error(err.data?.message || err.message || "An error occurred while creating your order.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      monthlyPrice: '₹0',
      description: 'Try ReviewQR with zero commitment',
      qrLimit: '1',
      features: [
        'Basic QR code (square dots, green only)',
        'Watermarked standee',
        'PNG download only',
        'Copy review link',
        'WhatsApp share',
        'Community support',
      ],
      lockedFeatures: [
        'Custom logo & colors',
        'Standee templates',
        'SVG / PDF download',
        'Analytics',
        'White label',
      ],
      popular: false,
      isFree: true,
      ctaText: 'Get Started Free',
      ctaLink: '/generate',
    },
    {
      name: 'Starter',
      monthlyPrice: '₹299',
      annualMonthly: '₹209',
      annualPrice: '2,513',
      description: 'Clean standees for small businesses',
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
        'White label',
      ],
      popular: false,
      isFree: false,
      ctaText: 'Get Starter',
      ctaLink: '/generate',
    },
    {
      name: 'Pro',
      monthlyPrice: '₹699',
      annualMonthly: '₹489',
      annualPrice: '5,873',
      description: 'Full customisation for growing businesses',
      qrLimit: '10',
      features: [
        '10 QR codes',
        'No watermark',
        'Branded Landing Page for customers',
        'AI review suggestions ✨',
        'Custom logo in QR centre',
        'Custom QR color & dot shape',
        'All standee templates (Minimal, Luxury, Bold, Festive)',
        'Custom standee background color',
        'Social proof badge ("500+ happy customers")',
        'Multi-language standee (EN, हिन्दी, मराठी, தமிழ், తెలుగు)',
        'PNG, SVG & PDF Standee downloads',
        'Analytics dashboard',
        'Priority email support',
      ],
      lockedFeatures: [
        'White-label branding',
        'Client dashboard',
        'Bulk QR generation',
        'API & Webhooks',
      ],
      popular: true,
      isFree: false,
      ctaText: 'Get Pro',
      ctaLink: '/generate',
    },
    {
      name: 'Agency',
      monthlyPrice: '₹1,499',
      annualMonthly: '₹1,049',
      annualPrice: '12,593',
      description: 'For agencies managing multiple clients',
      qrLimit: 'Unlimited',
      features: [
        'Unlimited QR codes',
        'Everything in Pro',
        'White-label ("Powered by Your Brand")',
        'Client name on standee footer',
        'Client dashboard (read-only access)',
        // 'Bulk QR generation via CSV',
        'Analytics dashboard',
        // 'Webhook & API access',
        'Phone + WhatsApp support',
      ],
      lockedFeatures: [],
      popular: false,
      isFree: false,
      ctaText: 'Get Agency',
      ctaLink: '/contact',
    },
  ];

  // ── Feature comparison table rows ──────────────────────────────────
  const comparisonRows: {
    category: string;
    rows: { feature: string; free: string | boolean; starter: string | boolean; pro: string | boolean; agency: string | boolean }[];
  }[] = [
      {
        category: 'QR Code',
        rows: [
          { feature: 'QR codes', free: '1', starter: '3', pro: '10', agency: 'Unlimited' },
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
          { feature: 'Language support', free: 'English only', starter: 'English only', pro: '5 languages', agency: '5 languages' },
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
          { feature: 'One-tap copy to clipboard', free: false, starter: true, pro: true, agency: true },
        ],
      },
      {
        category: 'Advanced',
        rows: [
          { feature: 'Analytics', free: false, starter: false, pro: true, agency: true },
          // { feature: 'Bulk QR (CSV)', free: false, starter: false, pro: false, agency: true },
          // { feature: 'API & Webhooks', free: false, starter: false, pro: false, agency: true },
          { feature: 'Client dashboard', free: false, starter: false, pro: false, agency: true },
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
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Start free and upgrade as you grow. No hidden fees, no surprises.
          </p>

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
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                Save 30%
              </span>
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
              const displayCtaText = user?.planExpiredNotifSent && isPaidPlan
                ? `Renew ${plan.name}`
                : plan.ctaText;

              return (
                <PricingCard
                  key={index}
                  {...plan}
                  ctaText={displayCtaText}
                  isAnnual={isAnnual}
                  isLoading={loadingPlan === planKey}
                  onPurchase={isPaidPlan ? () => handlePurchase(planKey) : undefined}
                />
              );
            })}
          </div>

        </div>
      </section>

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
                href="/generate"
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