'use client';

import { Lock, ArrowRight, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePlan } from '../hooks/Useplan';
import dummy_logo from '../assets/dummy_bussiness_logo.png';

const DUMMY = {
  name: 'Sharma Sweet House',
  address: '12, MG Road, Indore, MP',
  rating: 4.7,
  proof: '500+ happy customers',
  logo: dummy_logo.src,
};

const STANDEES = [
  {
    id: 'minimal', label: 'Minimal', plan: 'Starter', planColor: 'bg-blue-500',
    cardBg: '#ffffff', textPri: '#111827', textSec: '#374151', textMut: '#9ca3af',
    accent: '#1D9E75', border: '#f3f4f6', decorBar: null,
    dark: false, showLogo: false, showProof: false, qrStyle: 'square' as const,
  },
  {
    id: 'luxury', label: 'Luxury', plan: 'Pro', planColor: 'bg-violet-500',
    cardBg: '#0d0d1a', textPri: '#fbbf24', textSec: '#e5e7eb', textMut: '#6b7280',
    accent: '#d4af37', border: '#d4af3740', decorBar: ['#d4af37', '#a37c00', '#d4af37'],
    dark: true, showLogo: true, showProof: true, qrStyle: 'rounded' as const,
  },
  {
    id: 'bold', label: 'Bold', plan: 'Pro', planColor: 'bg-violet-500',
    cardBg: '#1e40af', textPri: '#ffffff', textSec: '#bfdbfe', textMut: '#93c5fd',
    accent: '#ffffff', border: '#3b82f660', decorBar: null,
    dark: true, showLogo: true, showProof: true, qrStyle: 'dots' as const,
  },
  {
    id: 'festive', label: 'Festive', plan: 'Agency', planColor: 'bg-rose-500',
    cardBg: '#fffbf0', textPri: '#7c2d12', textSec: '#9a3412', textMut: '#b45309',
    accent: '#f97316', border: '#fed7aa', decorBar: ['#f97316', '#ef4444', '#f59e0b'],
    dark: false, showLogo: true, showProof: true, qrStyle: 'extra-rounded' as const,
  },
];

type QRStyle = 'square' | 'rounded' | 'dots' | 'extra-rounded';

const QRDots = ({ x, y, size, color, style, centerClear }: {
  x: number; y: number; size: number;
  color: string; style: QRStyle; centerClear?: boolean;
}) => {
  const cell = size / 7;
  const cx = x + size / 2;
  const cy = y + size / 2;

  const isCornerFinder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= 4) || (r >= 4 && c < 3);

  const rx = { square: 0, rounded: cell * 0.25, dots: cell * 0.45, 'extra-rounded': cell * 0.45 }[style];

  const dots = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const dotCx = x + c * cell + cell / 2;
      const dotCy = y + r * cell + cell / 2;
      // skip centre 2×2 area if logo present
      if (centerClear && Math.abs(dotCx - cx) < cell * 1.5 && Math.abs(dotCy - cy) < cell * 1.5) continue;

      const filled = isCornerFinder(r, c) || Math.sin(r * 5.1 + c * 3.7 + 1.3) > 0.05;
      if (!filled) continue;

      dots.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * cell + cell * 0.05}
          y={y + r * cell + cell * 0.05}
          width={cell * 0.9}
          height={cell * 0.9}
          rx={rx}
          fill={color}
          opacity={isCornerFinder(r, c) ? 1 : 0.82}
        />
      );
    }
  }
  return <>{dots}</>;
};

const StandeeSVG = ({ s }: { s: typeof STANDEES[number] }) => {
  const W = 160;
  const H = 310; // ← increased from 260

  // QR block position — lower when top logo is shown
  const qrY = s.showLogo ? 102 : 68;
  const qrSize = 100;
  const qrX = (W - qrSize) / 2;  // centred = 30
  const qrBg = s.dark ? '#1a1a2e' : '#f9fafb';

  // Centre of QR (for inline logo)
  const qrCx = qrX + qrSize / 2;
  const qrCy = qrY + qrSize / 2;

  // Clip IDs must be unique per standee
  const topClipId = `clip-top-${s.id}`;
  const qrClipId = `clip-qr-${s.id}`;

  const gColors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
  const gLetters = ['G', 'o', 'o', 'g', 'l', 'e'];

  // vertical anchors
  const gWordY = s.showLogo ? 50 : 26;
  const reviewsY = s.showLogo ? 60 : 36;
  const nameY = s.showLogo ? 75 : 50;
  const starsY = s.showLogo ? 88 : 62;

  const proofBadgeY = qrY + qrSize + 8;
  const ctaY = qrY + qrSize + (s.showProof ? 36 : 22);
  const subY = ctaY + 11;
  const addrY = H - 28;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Gradient for decorative bars */}
        {s.decorBar && (
          <linearGradient id={`bar-${s.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={s.decorBar[0]} />
            <stop offset="50%" stopColor={s.decorBar[1]} />
            <stop offset="100%" stopColor={s.decorBar[2]} />
          </linearGradient>
        )}

        {/* Clip path for top logo */}
        <clipPath id={topClipId}>
          <rect x={W / 2 - 12} y="10" width="24" height="24" rx="5" />
        </clipPath>

        {/* Clip path for QR centre logo */}
        <clipPath id={qrClipId}>
          <rect x={qrCx - 12} y={qrCy - 12} width="24" height="24" rx="5" />
        </clipPath>
      </defs>

      {/* ── Card background ── */}
      <rect width={W} height={H} rx="10" fill={s.cardBg} />
      <rect width={W} height={H} rx="10" fill="none" stroke={s.border} strokeWidth="1" />

      {/* ── Top decor bar ── */}
      {s.decorBar && (
        <rect x="0" y="0" width={W} height="4" rx="2" fill={`url(#bar-${s.id})`} />
      )}

      {/* ── Top logo (paid plans) ── */}
      {s.showLogo && (
        <>
          {/* white backing */}
          <rect x={W / 2 - 14} y="8" width="28" height="28" rx="6"
            fill={s.dark ? '#ffffff22' : '#f3f4f6'} />
          {/* actual logo image */}
          <image
            href={DUMMY.logo}
            x={W / 2 - 14} y="8"
            width="28" height="28"
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${topClipId})`}
          />
        </>
      )}

      {/* ── Google wordmark ── */}
      {gLetters.map((l, i) => (
        <text key={i} x={52 + i * 9} y={gWordY}
          fill={gColors[i]} fontSize="11" fontWeight="700" fontFamily="sans-serif">
          {l}
        </text>
      ))}
      <text x={W / 2} y={reviewsY}
        textAnchor="middle" fill={s.textMut}
        fontSize="5.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="1.5">
        REVIEWS
      </text>

      {/* ── Business name & stars (paid plans) ── */}
      {/* {s.showLogo && ( */}
      <>
        <text x={W / 2} y={nameY}
          textAnchor="middle" fill={s.textPri}
          fontSize="8" fontWeight="700" fontFamily="sans-serif">
          {DUMMY.name}
        </text>
        {[0, 1, 2, 3, 4].map(i => (
          <text key={i} x={50 + i * 11} y={starsY}
            fill={s.accent} fontSize="9" fontFamily="sans-serif">★</text>
        ))}
        <text x={W / 2 + 28} y={starsY}
          fill={s.textSec} fontSize="6.5" fontFamily="sans-serif">
          {DUMMY.rating}
        </text>
      </>
      {/* )} */}

      {/* ── QR background ── */}
      <rect x={qrX} y={qrY} width={qrSize} height={qrSize}
        rx="6" fill={qrBg}
        stroke={s.accent} strokeWidth="1.5" strokeOpacity="0.25" />

      {/* ── QR dots (centre cleared for logo on paid plans) ── */}
      <QRDots
        x={qrX + 6} y={qrY + 6}
        size={qrSize - 12}
        color={s.accent}
        style={s.qrStyle}
        centerClear={s.showLogo}
      />

      {/* ── QR centre logo (paid plans) — rendered AFTER dots ── */}
      {s.showLogo && (
        <>
          {/* white backing punches through dots */}
          <rect x={qrCx - 14} y={qrCy - 14} width="28" height="28" rx="5" fill="#ffffff" />
          {/* logo image */}
          <image
            href={DUMMY.logo}
            x={qrCx - 12} y={qrCy - 12}
            width="24" height="24"
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${qrClipId})`}
          />
        </>
      )}

      {/* ── Social proof badge ── */}
      {s.showProof && (
        <>
          <rect x="28" y={proofBadgeY} width="104" height="14"
            rx="7" fill={s.accent} fillOpacity="0.12"
            stroke={s.accent} strokeWidth="0.8" strokeOpacity="0.3" />
          <text x={W / 2} y={proofBadgeY + 10}
            textAnchor="middle" fill={s.accent}
            fontSize="6" fontWeight="700" fontFamily="sans-serif">
            {DUMMY.proof}
          </text>
        </>
      )}

      {/* ── CTA ── */}
      <text x={W / 2} y={ctaY}
        textAnchor="middle" fill={s.accent}
        fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
        Scan to Review Us
      </text>
      <text x={W / 2} y={subY}
        textAnchor="middle" fill={s.textMut}
        fontSize="6" fontFamily="sans-serif">
        on Google Maps
      </text>

      {/* ── Address (paid plans) ── */}
      {/* {s.showLogo && ( */}
      <text x={W / 2} y={addrY}
        textAnchor="middle" fill={s.textMut}
        fontSize="5.5" fontFamily="sans-serif">
        📍 {DUMMY.address}
      </text>
      {/* )} */}

      {/* ── Bottom decor bar (festive) ── */}
      {s.id === 'festive' && s.decorBar && (
        <rect x="0" y={H - 18} width={W} height="4" rx="2"
          fill={`url(#bar-${s.id})`} />
      )}

      {/* ── Powered by strip ── */}
      <rect x="0" y={H - 14} width={W} height="14"
        rx="2" fill={s.accent} fillOpacity="0.07" />
      <text x={W / 2} y={H - 5}
        textAnchor="middle" fill={s.accent}
        fontSize="5" fontWeight="600" fontFamily="sans-serif">
        Powered by getreviewqr.com
      </text>
    </svg>
  );
};

// ── Main component ─────────────────────────────────────────────────────
const StandeeTeaser = () => {
  const { planExpiredNotifSent } = usePlan();
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Premium Standee Designs
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">
            Make your QR code impossible to ignore
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Unlock professional standees your customers will actually scan
          </p>
        </div>
        <Link href="/pricing"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
          See plans <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STANDEES.map((s) => (
          <div key={s.id} className="relative group">
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
              <StandeeSVG s={s} />
            </div>

            <div className="absolute inset-0 rounded-xl bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${s.planColor}`}>
                {s.plan}+
              </span>
              <Link href="/pricing"
                className="text-xs font-semibold text-gray-700 underline hover:text-primary transition-colors">
                {planExpiredNotifSent ? 'Renew' : 'Upgrade'}
              </Link>
            </div>

            <div className="mt-2 flex items-center justify-between px-0.5">
              <span className="text-xs font-semibold text-gray-700">{s.label}</span>
              <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${s.planColor}`}>
                {s.plan}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border border-primary/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Businesses with standees get <span className="text-primary">3× more reviews</span>
            </p>
            <p className="text-xs text-gray-500">Starting at just ₹299/month — less than a cup of coffee a day</p>
          </div>
        </div>
        <Link href="/pricing"
          className="flex-shrink-0 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 active:scale-95 flex items-center gap-2 group">
          {planExpiredNotifSent ? 'Renew Now' : 'Upgrade Now'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default StandeeTeaser;