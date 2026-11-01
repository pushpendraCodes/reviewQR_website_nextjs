'use client';

import { useRef, useEffect } from 'react';
import { Star, MapPin, Users, Phone, SmartphoneNfc, ScanLine } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import type { Business } from '../store/api/placesApi';
import { SITE_URL } from '../lib/seo/site';

/** Encoded in the on-screen preview before a QR is saved, so a screenshot never links straight to Google. */
const PREVIEW_QR_URL = `${SITE_URL}/google-review-qr-code-generator`;

export type QRDotShape = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
export type StandeeTemplate = 'minimal' | 'luxury' | 'bold' | 'festive' | 'classic' | 'midnight' | 'dual' | 'spotlight';
export type StandeeLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te';

/** What the standee shows besides the QR. Must match DEFAULT_STANDEE_DISPLAY in be/src/config/standee.js. */
export interface StandeeDisplay {
  logo: boolean;
  rating: boolean;
  address: boolean;
  phone: boolean;
  /** "Tap" badge; only useful when an NFC sticker is attached to the printed standee. */
  nfc: boolean;
}

export const DEFAULT_STANDEE_DISPLAY: StandeeDisplay = { logo: true, rating: true, address: true, phone: false, nfc: false };

export const resolveStandeeDisplay = (display?: Partial<StandeeDisplay> | null): StandeeDisplay => ({
  ...DEFAULT_STANDEE_DISPLAY,
  ...Object.fromEntries(Object.entries(display ?? {}).filter(([, v]) => typeof v === 'boolean')),
});

type Layout = 'stack' | 'classic' | 'dual' | 'spotlight';

interface TemplateConfig {
  layout: Layout;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  defaultAccent: string;
  borderStyle: string;
  borderRadius: string;
  decorBar?: string;
}

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
const WORDMARK_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
const STAR_GOLD = '#FBBC05';

const TEMPLATES: Record<StandeeTemplate, TemplateConfig> = {
  minimal: {
    layout: 'stack',
    cardBg: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#9ca3af',
    defaultAccent: '#1D9E75',
    borderStyle: '1px solid #f3f4f6',
    borderRadius: '16px',
  },
  luxury: {
    layout: 'stack',
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
    layout: 'stack',
    cardBg: '#1e40af',
    textPrimary: '#ffffff',
    textSecondary: '#bfdbfe',
    textMuted: '#93c5fd',
    defaultAccent: '#ffffff',
    borderStyle: '2px solid #3b82f660',
    borderRadius: '12px',
  },
  festive: {
    layout: 'stack',
    cardBg: '#fffbf0',
    textPrimary: '#7c2d12',
    textSecondary: '#9a3412',
    textMuted: '#b45309',
    defaultAccent: '#f97316',
    borderStyle: '2px solid #fed7aa',
    borderRadius: '16px',
    decorBar: 'linear-gradient(90deg, #f97316, #ef4444, #f59e0b)',
  },
  classic: {
    layout: 'classic',
    cardBg: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    defaultAccent: '#111827',
    borderStyle: '1px solid #e5e7eb',
    borderRadius: '20px',
  },
  midnight: {
    layout: 'classic',
    cardBg: '#0b0b0f',
    textPrimary: '#ffffff',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    defaultAccent: '#ffffff',
    borderStyle: '1px solid #1f2937',
    borderRadius: '20px',
  },
  dual: {
    layout: 'dual',
    cardBg: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    defaultAccent: '#111827',
    borderStyle: '1px solid #e5e7eb',
    borderRadius: '20px',
  },
  spotlight: {
    layout: 'spotlight',
    cardBg: '#111111',
    textPrimary: '#ffffff',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    defaultAccent: '#ffffff',
    borderStyle: '1px solid #262626',
    borderRadius: '20px',
  },
};

interface LangCopy {
  cta: string;
  sub: string;
  reviews: string;
  poweredBy: string;
  /** "Review us on [Google]" is split around the wordmark because word order differs by language. */
  reviewPre: string;
  reviewPost: string;
  tap: string;
  scan: string;
  tapHere: string;
  or: string;
  scanCta: string;
  tapScanCta: string;
}

const LANG: Record<StandeeLanguage, LangCopy> = {
  en: {
    cta: 'Tap or Scan to Review Us', sub: 'on Google Maps', reviews: 'Reviews', poweredBy: 'Powered by',
    reviewPre: 'Review us on', reviewPost: '', tap: 'Tap', scan: 'Scan', tapHere: 'Tap here', or: 'or',
    scanCta: 'Scan with your phone camera', tapScanCta: 'Tap your phone or scan the code',
  },
  hi: {
    cta: 'टैप या स्कैन करके समीक्षा करें', sub: 'Google Maps पर', reviews: 'समीक्षाएं', poweredBy: 'द्वारा संचालित',
    reviewPre: '', reviewPost: 'पर हमें रिव्यू दें', tap: 'टैप करें', scan: 'स्कैन करें', tapHere: 'यहाँ टैप करें', or: 'या',
    scanCta: 'फ़ोन कैमरा से स्कैन करें', tapScanCta: 'फ़ोन टैप करें या कोड स्कैन करें',
  },
  mr: {
    cta: 'टॅप किंवा स्कॅन करून रिव्ह्यू द्या', sub: 'Google Maps वर', reviews: 'पुनरावलोकने', poweredBy: 'द्वारे संचालित',
    reviewPre: '', reviewPost: 'वर आम्हाला रिव्ह्यू द्या', tap: 'टॅप करा', scan: 'स्कॅन करा', tapHere: 'इथे टॅप करा', or: 'किंवा',
    scanCta: 'फोन कॅमेऱ्याने स्कॅन करा', tapScanCta: 'फोन टॅप करा किंवा कोड स्कॅन करा',
  },
  ta: {
    cta: 'மதிப்பாய்வுக்கு ஸ்கேன் செய்யுங்கள்', sub: 'Google Maps இல்', reviews: 'மதிப்பாய்வுகள்', poweredBy: 'இயக்குவது',
    reviewPre: '', reviewPost: 'இல் எங்களை மதிப்பிடுங்கள்', tap: 'தட்டவும்', scan: 'ஸ்கேன்', tapHere: 'இங்கே தட்டவும்', or: 'அல்லது',
    scanCta: 'ஃபோன் கேமராவில் ஸ்கேன் செய்யுங்கள்', tapScanCta: 'ஃபோனைத் தட்டவும் அல்லது ஸ்கேன் செய்யவும்',
  },
  te: {
    cta: 'సమీక్షకు స్కాన్ చేయండి', sub: 'Google Maps లో', reviews: 'సమీక్షలు', poweredBy: 'ద్వారా నడిచే',
    reviewPre: '', reviewPost: 'లో మమ్మల్ని సమీక్షించండి', tap: 'ట్యాప్', scan: 'స్కాన్', tapHere: 'ఇక్కడ ట్యాప్ చేయండి', or: 'లేదా',
    scanCta: 'ఫోన్ కెమెరాతో స్కాన్ చేయండి', tapScanCta: 'ఫోన్ ట్యాప్ చేయండి లేదా స్కాన్ చేయండి',
  },
};

interface StandeePreviewProps {
  business: Business;
  shortURL?: string;
  /**
   * What the QR image encodes (defaults to shortURL). Never the raw Google review link:
   * every printed QR must go through /r/ so it can be tracked and paused.
   */
  qrEncodeURL?: string;
  plan: string;
  logo?: string | null;
  qrColor?: string;
  whiteLabel?: { enabled: boolean; clientName: string };
  qrShape?: QRDotShape;
  template?: StandeeTemplate;
  standeeBgColor?: string;
  socialProof?: string;
  language?: StandeeLanguage;
  display?: Partial<StandeeDisplay> | null;
  /** Phone printed on the standee; falls back to the business phone from Google. */
  phone?: string;
  /** Small gallery copy: no page id and no shadow, so several can render beside the real preview. */
  thumbnail?: boolean;
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
    isDark,
    textPrimary: isDark ? '#ffffff' : '#111827',
    textSecondary: isDark ? '#e5e7eb' : '#303947ff',
    textMuted: isDark ? '#9ca3af' : '#5a6678ff',
    accent: isDark ? '#ffffff' : '#111827',
  };
}

function GoogleG({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function GoogleWordmark({ size }: { size: number }) {
  return (
    <span className="inline-flex items-baseline font-bold leading-none" style={{ fontSize: size, letterSpacing: '-0.01em' }}>
      {['G', 'o', 'o', 'g', 'l', 'e'].map((l, i) => (
        <span key={i} style={{ color: WORDMARK_COLORS[i] }}>{l}</span>
      ))}
    </span>
  );
}

function ColorBar({ height = 6, className = '', rounded = false }: { height?: number; className?: string; rounded?: boolean }) {
  return (
    <div className={`flex w-full overflow-hidden ${rounded ? 'rounded-full' : ''} ${className}`} style={{ height }}>
      {GOOGLE_COLORS.map((c) => <div key={c} className="flex-1" style={{ background: c }} />)}
    </div>
  );
}

function FiveStars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} style={{ width: size, height: size, color: STAR_GOLD, fill: STAR_GOLD }} />
      ))}
    </div>
  );
}

const StandeePreview = ({
  business, shortURL, qrEncodeURL, plan, logo, qrColor, whiteLabel,
  qrShape = 'square',
  template = 'minimal',
  standeeBgColor,
  socialProof,
  language = 'en',
  display,
  phone,
  thumbnail = false,
}: StandeePreviewProps) => {

  const isPaid = plan === 'starter' || plan === 'pro' || plan === 'agency';
  const isProPlus = plan === 'pro' || plan === 'agency';

  const templateKey: StandeeTemplate = isProPlus && TEMPLATES[template] ? template : 'minimal';
  const tmpl = TEMPLATES[templateKey];
  const layout = tmpl.layout;
  const resolvedColor = isPaid && qrColor ? qrColor : '#1D9E75';

  const cardBg = isProPlus && standeeBgColor ? standeeBgColor : tmpl.cardBg;

  const contrastOverride = isProPlus && standeeBgColor
    ? getContrastTextColors(standeeBgColor)
    : null;

  const textPrimary = contrastOverride?.textPrimary ?? tmpl.textPrimary;
  const textSecondary = contrastOverride?.textSecondary ?? tmpl.textSecondary;
  const textMuted = contrastOverride?.textMuted ?? tmpl.textMuted;
  const isDarkCard = contrastOverride ? contrastOverride.isDark : getContrastTextColors(tmpl.cardBg).isDark;
  const accent = isProPlus
    ? (standeeBgColor ? contrastOverride!.accent : layout === 'stack' ? resolvedColor : tmpl.defaultAccent)
    : '#1D9E75';

  const show = resolveStandeeDisplay(display);
  const rating = business.rating ?? 0;
  const reviewCount = business.totalReviews ?? business.totalRatings ?? 0;
  const phoneText = (phone ?? business.phone ?? '').trim();
  const showLogo = isPaid && Boolean(logo) && show.logo;
  const showRating = isPaid && show.rating;
  const showAddress = isPaid && show.address && Boolean(business.address);
  const showPhone = isPaid && show.phone && Boolean(phoneText);
  const showNfc = isPaid && show.nfc;

  const brandName = isPaid && whiteLabel?.enabled && whiteLabel.clientName
    ? whiteLabel.clientName
    : 'getreviewqr.com';
  const t = LANG[isProPlus ? language : 'en'];

  const qrSize = layout === 'classic' && showNfc ? 128
    : layout === 'dual' && showNfc ? 116
      : layout === 'spotlight' ? 150
        : 160;

  const qrRef = useRef<HTMLDivElement>(null);
  const liveUrl = qrEncodeURL || shortURL || '';
  const encodedUrl = liveUrl || PREVIEW_QR_URL;

  useEffect(() => {
    if (!qrRef.current) return;

    const cornerType = (isProPlus && (qrShape === 'extra-rounded' || qrShape === 'rounded'))
      ? 'extra-rounded' : 'square';

    const qrInstance = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: encodedUrl,
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
    qrRef.current.dataset.qrUrl = liveUrl;
  }, [encodedUrl, liveUrl, resolvedColor, qrShape, logo, isProPlus, qrSize]);

  const renderStars = (value: number, size = 14) => {
    const starColor = contrastOverride
      ? (contrastOverride.textPrimary === '#ffffff' ? '#facc15' : '#f59e0b')
      : (templateKey === 'luxury' ? '#fbbf24' : layout === 'stack' ? '#f59e0b' : STAR_GOLD);
    return Array.from({ length: 5 }, (_, i) => {
      const full = i < Math.floor(value);
      const half = !full && i === Math.floor(value) && value % 1 >= 0.5;
      return (
        <Star
          key={i}
          style={{ width: size, height: size, color: starColor, fill: full ? starColor : half ? `${starColor}80` : 'transparent' }}
        />
      );
    });
  };

  /** Real rating when shown; otherwise decorative stars on the Google-style designs. */
  const ratingRow = (size: number) => showRating && rating > 0 ? (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-0.5">
        {renderStars(rating, size)}
        <span className="text-xs font-bold ml-1" style={{ color: textPrimary }}>{rating.toFixed(1)}</span>
      </div>
      {reviewCount > 0 && (
        <span className="text-[10px]" style={{ color: textMuted }}>{reviewCount.toLocaleString()} {t.reviews}</span>
      )}
    </div>
  ) : <FiveStars size={size} />;

  // The QR node must render exactly once per layout: qrRef and the download hook both read it.
  const qrBlock = (padding = 'p-2') => (
    <div className={`relative ${padding} rounded-xl shrink-0`} style={{ background: '#fff', border: layout === 'stack' ? `2px solid ${accent}22` : '1px solid #e5e7eb' }}>
      <div ref={qrRef} data-standee-qr />
      {!liveUrl && (
        <div className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-lg bg-white/85 px-3 text-center backdrop-blur-[2px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Preview</span>
          <span className="text-[10px] leading-snug text-gray-500">Your scannable QR is created when you download</span>
        </div>
      )}
    </div>
  );

  const logoBlock = (cls = 'mb-3') => showLogo && (
    <div className={cls}>
      <img src={logo!} alt="Logo" className="h-14 max-w-[100px] object-cover rounded-lg" />
    </div>
  );

  const businessName = (cls = 'text-base') => isPaid && (
    <h2 className={`${cls} font-bold leading-tight px-1 w-full break-words`} style={{ color: textPrimary }}>
      {business.name}
    </h2>
  );

  const socialProofPill = isProPlus && socialProof && (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
    >
      <Users className="w-3 h-3" />
      {socialProof}
    </div>
  );

  const contactLines = (showAddress || showPhone) && (
    <div className="w-full space-y-1 px-1">
      {showAddress && (
        <div className="flex items-start justify-center gap-1 text-[11px]" style={{ color: textMuted }}>
          <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: layout === 'stack' ? undefined : '#EA4335' }} />
          <span className="leading-relaxed break-words min-w-0"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {business.address}
          </span>
        </div>
      )}
      {showPhone && (
        <div className="flex items-center justify-center gap-1 text-[11px] font-medium" style={{ color: textSecondary }}>
          <Phone className="w-3 h-3 shrink-0" />
          <span>{phoneText}</span>
        </div>
      )}
    </div>
  );

  const poweredBy = (
    <p className="w-full text-right text-[10px] leading-tight pr-1" style={{ color: textMuted }}>
      {t.poweredBy}{' '}
      <span className="font-bold" style={{ color: textSecondary }}>{brandName}</span>
    </p>
  );

  const reviewUsHeading = (wordmarkSize: number, preSize = 15) => (
    <div className="flex flex-col items-center gap-1">
      {t.reviewPre && (
        <span className="font-semibold leading-tight" style={{ color: textPrimary, fontSize: preSize }}>{t.reviewPre}</span>
      )}
      <GoogleWordmark size={wordmarkSize} />
      {t.reviewPost && (
        <span className="font-semibold leading-tight" style={{ color: textPrimary, fontSize: preSize - 1 }}>{t.reviewPost}</span>
      )}
    </div>
  );

  const nfcInk = isDarkCard ? '#ffffff' : '#111827';

  // ── Layouts ──────────────────────────────────────────────────────────
  const renderStack = () => (
    <div className="relative flex flex-col items-center text-center px-6 py-6" style={{ zIndex: 1 }}>
      {logoBlock()}

      <div className="mb-3">
        <div className="flex items-center justify-center gap-0.5 mb-1">
          {['G', 'o', 'o', 'g', 'l', 'e'].map((l, i) => (
            <span key={i} className="text-xl font-bold" style={{ color: WORDMARK_COLORS[i] }}>{l}</span>
          ))}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: textMuted }}>
          {t.reviews}
        </p>
      </div>

      {isPaid && <div className="mb-1.5 w-full">{businessName()}</div>}

      {showRating && (
        <div className="flex items-center gap-0.5 mb-4">
          {renderStars(rating)}
          <span className="text-xs font-semibold ml-1" style={{ color: textSecondary }}>{rating}</span>
        </div>
      )}
      {isPaid && !showRating && <div className="mb-3" />}

      <div className="mb-3">{qrBlock()}</div>

      {socialProofPill && <div className="mb-3">{socialProofPill}</div>}

      <div className="mb-3">
        <p className="text-sm font-bold mb-0.5" style={{ color: accent }}>{t.cta}</p>
        <p className="text-xs" style={{ color: textMuted }}>{t.sub}</p>
      </div>

      {showNfc && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[11px] font-semibold"
          style={{ color: textSecondary, border: `1px dashed ${textMuted}` }}>
          <SmartphoneNfc className="w-3.5 h-3.5" />
          {t.tapHere} (NFC)
        </div>
      )}

      {contactLines && <div className="mb-2 w-full">{contactLines}</div>}

      <div className="mt-1 w-full">{poweredBy}</div>
    </div>
  );

  const renderClassic = () => (
    <div className="relative flex flex-col items-center text-center px-5 py-6 gap-3" style={{ zIndex: 1 }}>
      {showLogo && (
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white" style={{ border: `2px solid ${isDarkCard ? '#374151' : '#e5e7eb'}` }}>
          <img src={logo!} alt="Logo" className="w-full h-full object-cover" />
        </div>
      )}
      {reviewUsHeading(26, 17)}
      {ratingRow(18)}
      {businessName('text-sm')}

      <div className={`flex items-center justify-center ${showNfc ? 'gap-3' : ''} w-full`}>
        {showNfc && (
          <div className="relative w-[112px] h-[112px] rounded-full shrink-0"
            style={{ background: `conic-gradient(${GOOGLE_COLORS[0]} 0 25%, ${GOOGLE_COLORS[1]} 0 50%, ${GOOGLE_COLORS[2]} 0 75%, ${GOOGLE_COLORS[3]} 0)` }}>
            <div className="absolute inset-[7px] rounded-full flex flex-col items-center justify-center gap-1" style={{ background: cardBg }}>
              <SmartphoneNfc className="w-6 h-6" style={{ color: nfcInk }} />
              <span className="text-[9px] font-extrabold uppercase tracking-wide leading-tight px-2" style={{ color: nfcInk }}>{t.tapHere}</span>
              <GoogleWordmark size={12} />
            </div>
          </div>
        )}
        {qrBlock('p-1.5')}
      </div>

      <p className="text-xs font-semibold" style={{ color: textSecondary }}>{showNfc ? t.tapScanCta : t.scanCta}</p>
      {socialProofPill}
      {contactLines}
      {poweredBy}
    </div>
  );

  const renderDual = () => (
    <div className="relative flex flex-col items-center text-center" style={{ zIndex: 1 }}>
      <div className="flex flex-col items-center gap-2.5 px-5 pt-6 pb-4 w-full">
        {showLogo ? logoBlock('mb-0') : <GoogleG size={40} />}
        {ratingRow(17)}
        {reviewUsHeading(28, 16)}
        {businessName('text-sm')}

        <div className="w-full rounded-2xl p-[2px]"
          style={{ background: `linear-gradient(90deg, ${GOOGLE_COLORS.join(', ')})` }}>
          <div className={`rounded-[14px] grid ${showNfc ? 'grid-cols-2' : 'grid-cols-1'} gap-2 p-3`} style={{ background: cardBg }}>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: textSecondary }}>{t.scan}</span>
              {qrBlock('p-1')}
            </div>
            {showNfc && (
              <div className="flex flex-col items-center gap-1.5" style={{ borderLeft: `1px solid ${isDarkCard ? '#374151' : '#e5e7eb'}` }}>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: textSecondary }}>{t.tap}</span>
                <div className="flex-1 flex flex-col items-center justify-center gap-1">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ border: `2px solid ${nfcInk}` }}>
                    <SmartphoneNfc className="w-9 h-9" style={{ color: nfcInk }} />
                  </div>
                  <span className="text-[10px] font-extrabold tracking-widest" style={{ color: nfcInk }}>NFC</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {socialProofPill}
        {contactLines}
        {poweredBy}
      </div>
      <ColorBar height={10} />
    </div>
  );

  const renderSpotlight = () => (
    <div className="relative flex flex-col items-center text-center px-6 py-7 gap-3" style={{ zIndex: 1 }}>
      {logoBlock('mb-0')}
      {reviewUsHeading(46, 18)}
      {ratingRow(22)}
      <ColorBar height={5} rounded className="max-w-[220px]" />
      {businessName('text-sm')}

      {qrBlock('p-2')}

      {showNfc ? (
        <div className="flex items-center justify-center gap-4" style={{ color: textPrimary }}>
          <div className="flex flex-col items-center gap-0.5">
            <SmartphoneNfc className="w-7 h-7" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">{t.tap}</span>
          </div>
          <span className="text-xs font-bold uppercase" style={{ color: textMuted }}>{t.or}</span>
          <div className="flex flex-col items-center gap-0.5">
            <ScanLine className="w-7 h-7" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">{t.scan}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: textPrimary }}>
          <ScanLine className="w-4 h-4" />
          {t.scanCta}
        </div>
      )}

      {socialProofPill}
      {contactLines}
      {poweredBy}
    </div>
  );

  const body = layout === 'classic' ? renderClassic()
    : layout === 'dual' ? renderDual()
      : layout === 'spotlight' ? renderSpotlight()
        : renderStack();

  return (
    <div className="flex justify-center">
      <div
        id={thumbnail ? undefined : 'standee-preview'}
        className={`relative w-full max-w-[320px] overflow-hidden ${thumbnail ? '' : 'shadow-xl'}`}
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

        {body}

        {isProPlus && templateKey === 'festive' && tmpl.decorBar && (
          <div style={{ height: '4px', background: tmpl.decorBar }} />
        )}
      </div>
    </div>
  );
};

export default StandeePreview;
