'use client';

// src/components/QRErrorOverlay.tsx
import { useRouter } from 'next/navigation';;
import { ShieldAlert, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { usePlan } from '../hooks/Useplan';

type QRError = "limit_reached" | "rate_limited" | "unknown";

interface QRErrorOverlayProps {
  error: QRError;
  onRetry: () => void;
}

const ERROR_CONFIG = {
  limit_reached: {
    icon: ShieldAlert,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    badge: 'Plan Limit Reached',
    badgeBg: 'bg-orange-100 text-orange-700',
    title: "You've reached your free plan limit",
    description:
      'Upgrade to Pro to generate unlimited QR codes, access analytics, and unlock custom branding.',
    primaryLabel: 'Upgrade to Pro',
    primaryTo: '/pricing',
    showRetry: false,
  },
  rate_limited: {
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    badge: 'Too Many Requests',
    badgeBg: 'bg-yellow-100 text-yellow-700',
    title: 'Slow down — you are moving too fast!',
    description:
      'You have hit the rate limit. Please wait a moment before trying again, or upgrade to Pro for higher limits.',
    primaryLabel: 'Upgrade to Pro',
    primaryTo: '/pricing',
    showRetry: true,
  },
  unknown: {
    icon: RefreshCw,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    badge: 'Error',
    badgeBg: 'bg-red-100 text-red-700',
    title: 'Something went wrong',
    description:
      'We couldnt generate your QR code. Please try again. If the issue persists, contact support.',
    primaryLabel: 'Go to Support',
    primaryTo: '/support',
    showRetry: true,
  },
};

const QRErrorOverlay = ({ error, onRetry }: QRErrorOverlayProps) => {
  const navigate = useRouter();
  const { planExpiredNotifSent } = usePlan();
  
  const cfg = { ...ERROR_CONFIG[error] };

  if (planExpiredNotifSent) {
    if (error === 'limit_reached') {
      cfg.title = "Your plan has expired";
      cfg.description = "Renew your plan now to continue generating QR codes, access detailed analytics, and unlock premium standees.";
      cfg.primaryLabel = "Renew Your Plan";
    } else if (error === 'rate_limited') {
      cfg.description = "You have hit the rate limit. Please wait a moment before trying again, or renew your plan for higher limits.";
      cfg.primaryLabel = "Renew Your Plan";
    }
  }

  const Icon = cfg.icon;

  return (
    <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden">
      {/* Blurred backdrop of underlying QR content */}
      <div className="absolute inset-0 backdrop-blur-[0.5px] bg-white/70" />

      {/* Card */}
      <div className="relative z-20 flex items-center justify-center h-full p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-xl p-7 text-center">
          {/* Icon */}
          <div className={`w-14 h-14 ${cfg.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
          </div>

          {/* Badge */}
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${cfg.badgeBg}`}>
            {cfg.badge}
          </span>

          {/* Title & description */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{cfg.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{cfg.description}</p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate.push(cfg.primaryTo)}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all active:scale-95"
            >
              {cfg.primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </button>

            {cfg.showRetry && (
              <button
                onClick={onRetry}
                className="w-full px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRErrorOverlay;