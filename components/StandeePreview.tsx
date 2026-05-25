'use client';

import { useRef, useEffect } from 'react';
import { Star, MapPin, Users } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import type { Business } from '../store/api/placesApi';

export type QRDotShape = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
export type StandeeTemplate = 'minimal' | 'luxury' | 'bold' | 'festive';
export type StandeeLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te';

interface TemplateConfig {
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  defaultAccent: string;
  borderStyle: string;
  borderRadius: string;
  decorBar?: string;
}

const TEMPLATES: Record<StandeeTemplate, TemplateConfig> = {
  minimal: {
    cardBg: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#9ca3af',
    defaultAccent: '#1D9E75',
    borderStyle: '1px solid #f3f4f6',
    borderRadius: '16px',
  },
  luxury: {
    cardBg: '#0d0d1a',
    textPrimary: '#fbbf24',
    textSecondary: '#e5e7eb',
    textMuted: '#6b7280',
    defaultAccent: '#d4af37',
    borderStyle: '1px solid #d4af3740',
    borderRadius: '4px',
    decorBar: 'linear-gradient(90deg, #d4af37, #a37c00, #d4af37)',
  },
  bold: {
    cardBg: '#1e40af',
    textPrimary: '#ffffff',
    textSecondary: '#bfdbfe',
    textMuted: '#93c5fd',
    defaultAccent: '#ffffff',
    borderStyle: '2px solid #3b82f660',
    borderRadius: '12px',
  },
  festive: {
    cardBg: '#fffbf0',
    textPrimary: '#7c2d12',
    textSecondary: '#9a3412',
    textMuted: '#b45309',
    defaultAccent: '#f97316',
    borderStyle: '2px solid #fed7aa',
    borderRadius: '16px',
    decorBar: 'linear-gradient(90deg, #f97316, #ef4444, #f59e0b)',
  },
};

const LANG: Record<StandeeLanguage, { cta: string; sub: string; reviews: string; poweredBy: string }> = {
  en: { cta: 'Scan to Review Us', sub: 'on Google Maps', reviews: 'Reviews', poweredBy: 'Powered by' },
  hi: { cta: 'समीक्षा करने के लिए स्कैन करें', sub: 'Google Maps पर', reviews: 'समीक्षाएं', poweredBy: 'द्वारा संचालित' },
  mr: { cta: 'पुनरावलोकनासाठी स्कॅन करा', sub: 'Google Maps वर', reviews: 'पुनरावलोकने', poweredBy: 'द्वारे संचालित' },
  ta: { cta: 'மதிப்பாய்வுக்கு ஸ்கேன் செய்யுங்கள்', sub: 'Google Maps இல்', reviews: 'மதிப்பாய்வுகள்', poweredBy: 'இயக்குவது' },
  te: { cta: 'సమీక్షకు స్కాన్ చేయండి', sub: 'Google Maps లో', reviews: 'సమీక్షలు', poweredBy: 'ద్వారా నడిచే' },
};

interface StandeePreviewProps {
  business: Business;
  reviewURL: string;
  shortURL?: string;
  plan: string;
  logo?: string | null;
  qrColor?: string;
  whiteLabel?: { enabled: boolean; clientName: string };
  qrShape?: QRDotShape;
  template?: StandeeTemplate;
  standeeBgColor?: string;
  socialProof?: string;
  language?: StandeeLanguage;
}

function getContrastTextColors(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const isDark = lum <= 0.179;

  return {
    textPrimary: isDark ? '#ffffff' : '#111827',
    textSecondary: isDark ? '#e5e7eb' : '#303947ff',
    textMuted: isDark ? '#9ca3af' : '#5a6678ff',
    accent: isDark ? '#ffffff' : '#111827',
  };
}

const StandeePreview = ({
  business, reviewURL, shortURL, plan, logo, qrColor, whiteLabel,
  qrShape = 'square',
  template = 'minimal',
  standeeBgColor,
  socialProof,
  language = 'en',
}: StandeePreviewProps) => {

  const isPaid = plan === 'starter' || plan === 'pro' || plan === 'agency';
  const isProPlus = plan === 'pro' || plan === 'agency';

  const tmpl = TEMPLATES[isProPlus ? template : 'minimal'];
  const resolvedColor = isPaid && qrColor ? qrColor : '#1D9E75';

  const cardBg = isProPlus && standeeBgColor ? standeeBgColor : tmpl.cardBg;

  const contrastOverride = isProPlus && standeeBgColor
    ? getContrastTextColors(standeeBgColor)
    : null;

  // ✅ These now shadow tmpl.* and are used consistently throughout JSX
  const textPrimary = contrastOverride?.textPrimary ?? tmpl.textPrimary;
  const textSecondary = contrastOverride?.textSecondary ?? tmpl.textSecondary;
  const textMuted = contrastOverride?.textMuted ?? tmpl.textMuted;
  const accent = isProPlus
    ? (standeeBgColor ? contrastOverride!.accent : resolvedColor)
    : '#1D9E75';

  const brandName = isPaid && whiteLabel?.enabled && whiteLabel.clientName
    ? whiteLabel.clientName
    : 'getreviewqr.com';
  const t = LANG[isProPlus ? language : 'en'];

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrRef.current) return;

    const cornerType = (isProPlus && (qrShape === 'extra-rounded' || qrShape === 'rounded'))
      ? 'extra-rounded' : 'square';

    const qrInstance = new QRCodeStyling({
      width: 160,
      height: 160,
      data: shortURL || reviewURL || 'https://getreviewqr.com',
      dotsOptions: { type: isProPlus ? qrShape : 'square', color: resolvedColor },
      cornersSquareOptions: { type: cornerType, color: resolvedColor },
      cornersDotOptions: { type: isProPlus && qrShape === 'dots' ? 'dot' : 'square', color: resolvedColor },
      backgroundOptions: { color: '#ffffff' },
      image: isProPlus && logo ? logo : undefined,
      imageOptions: { crossOrigin: 'anonymous', margin: 4, hideBackgroundDots: true, imageSize: 0.32 },
      qrOptions: { errorCorrectionLevel: 'H' },
    });

    qrRef.current.innerHTML = '';
    qrInstance.append(qrRef.current);
  }, [reviewURL, shortURL, resolvedColor, qrShape, logo, isProPlus]);

  const renderStars = (rating: number) => {
    // ✅ Star color also respects the bg — amber on light, white on dark
    const starColor = contrastOverride
      ? (contrastOverride.textPrimary === '#ffffff' ? '#facc15' : '#f59e0b')
      : (template === 'luxury' && isProPlus ? '#fbbf24' : '#f59e0b');
    return Array.from({ length: 5 }, (_, i) => {
      const full = i < Math.floor(rating);
      const half = !full && i === Math.floor(rating) && rating % 1 >= 0.5;
      return (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{ color: starColor, fill: full ? starColor : half ? `${starColor}80` : 'transparent' }}
        />
      );
    });
  };

  return (
    <div className="flex justify-center">
      <div
        id="standee-preview"
        className="relative w-full max-w-[320px] overflow-hidden shadow-xl"
        style={{ backgroundColor: cardBg, borderRadius: tmpl.borderRadius, border: tmpl.borderStyle, minHeight: '420px' }}
      >
        {isProPlus && tmpl.decorBar && (
          <div style={{ height: '4px', background: tmpl.decorBar }} />
        )}

        {!isPaid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
            style={{ zIndex: 0 }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-[11px] font-bold whitespace-nowrap"
                style={{
                  color: '#e5e7eb',
                  letterSpacing: '0.12em',
                  transform: `rotate(-35deg) translate(${(i % 3 - 1) * 95}px, ${(Math.floor(i / 3) - 1) * 68}px)`,
                }}
              >
                REVIEW QR
              </span>
            ))}
          </div>
        )}

        <div className="relative flex flex-col items-center text-center px-6 py-6" style={{ zIndex: 1 }}>

          {isPaid && logo && (
            <div className="mb-3">
              <img src={logo} alt="Logo" className="h-15 max-w-[100px] object-cover rounded-lg" />
            </div>
          )}

          {/* Google wordmark — letters always keep brand colors, only "Reviews" label adapts */}
          <div className="mb-3">
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {['G', 'o', 'o', 'g', 'l', 'e'].map((l, i) => (
                <span key={i} className="text-xl font-bold"
                  style={{ color: ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'][i] }}>
                  {l}
                </span>
              ))}
            </div>
            {/* ✅ textMuted (was tmpl.textMuted) */}
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: textMuted }}>
              {t.reviews}
            </p>
          </div>

          {/* ✅ textPrimary (was tmpl.textPrimary) */}
          {isPaid && (
            <h2 className="text-base font-bold leading-tight mb-1.5 px-1 w-full break-words"
              style={{ color: textPrimary }}>
              {business.name}
            </h2>
          )}

          {/* ✅ textSecondary (was tmpl.textSecondary) */}
          {isPaid && (
            <div className="flex items-center gap-0.5 mb-4">
              {renderStars(business.rating ?? 0)}
              <span className="text-xs font-semibold ml-1" style={{ color: textSecondary }}>
                {business.rating ?? 0}
              </span>
            </div>
          )}

          <div className="mb-3 p-2 rounded-xl" style={{ background: '#fff', border: `2px solid ${accent}22` }}>
            <div ref={qrRef} />
          </div>

          {isProPlus && socialProof && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
              style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
            >
              <Users className="w-3 h-3" />
              {socialProof}
            </div>
          )}

          <div className="mb-3">
            <p className="text-sm font-bold mb-0.5" style={{ color: accent }}>{t.cta}</p>
            {/* ✅ textMuted (was tmpl.textMuted) */}
            <p className="text-xs" style={{ color: textMuted }}>{t.sub}</p>
          </div>

          {/* ✅ textMuted (was tmpl.textMuted) — address and MapPin icon */}
          {isPaid && (
            <div className="flex items-start gap-1 text-[11px] w-full px-1 mb-2" style={{ color: textMuted }}>
              <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
              <span className="text-left leading-relaxed break-words min-w-0 flex-1"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {business.address}
              </span>
            </div>
          )}

          {/* ✅ textMuted (was tmpl.textMuted) */}
          <p className="text-[9px] mt-1" style={{ color: textMuted }}>
            {t.poweredBy} {brandName}
          </p>
        </div>

        {isProPlus && template === 'festive' && tmpl.decorBar && (
          <div style={{ height: '4px', background: tmpl.decorBar }} />
        )}
      </div>
    </div>
  );
};

export default StandeePreview;