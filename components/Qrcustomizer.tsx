'use client';

import { useState, useRef } from 'react';
import {
  Upload, X, Palette, Building2, EyeOff, Crown,
  ChevronDown, Users, Globe2, LayoutTemplate,
} from 'lucide-react';
import Link from 'next/link';;
import { usePlan } from '../hooks/Useplan';
import type { Plan } from '../hooks/Useplan';
import type { QRDotShape, StandeeTemplate, StandeeLanguage } from './StandeePreview';

interface QRCustomizerProps {
  plan: Plan;
  onLogoChange: (dataUrl: string | null) => void;
  onColorChange: (color: string) => void;
  onWhiteLabelChange?: (enabled: boolean, clientName: string) => void;
  onQRShapeChange?: (shape: QRDotShape) => void;
  onTemplateChange?: (template: StandeeTemplate) => void;
  onBgColorChange?: (color: string) => void;
  onSocialProofChange?: (text: string) => void;
  onLanguageChange?: (lang: StandeeLanguage) => void;
}

// ── QR dot shape options ─────────────────────────────────────────────
const QR_SHAPES: { value: QRDotShape; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'extra-rounded', label: 'Pill' },
];

// Mini SVG preview for each shape
const ShapeIcon = ({ shape, size = 24 }: { shape: QRDotShape; size?: number }) => {
  const rx = { square: 0, rounded: 2, dots: 6, classy: 3, 'extra-rounded': 6 }[shape];
  return (
    <svg viewBox="0 0 22 22" width={size} height={size}>
      <rect x="1" y="1" width="8" height="8" rx={rx} fill="currentColor" />
      <rect x="13" y="1" width="8" height="8" rx={rx} fill="currentColor" />
      <rect x="1" y="13" width="8" height="8" rx={rx} fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx={rx} fill="currentColor" />
    </svg>
  );
};

// ── Standee templates ────────────────────────────────────────────────
const TEMPLATES: { value: StandeeTemplate; label: string; bg: string; accent: string }[] = [
  { value: 'minimal', label: 'Minimal', bg: '#ffffff', accent: '#1D9E75' },
  { value: 'luxury', label: 'Luxury', bg: '#0d0d1a', accent: '#d4af37' },
  { value: 'bold', label: 'Bold', bg: '#1e40af', accent: '#ffffff' },
  { value: 'festive', label: 'Festive', bg: '#fffbf0', accent: '#f97316' },
];

// ── Languages ────────────────────────────────────────────────────────
const LANGUAGES: { value: StandeeLanguage; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { value: 'mr', label: 'Marathi', native: 'मराठी' },
  { value: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { value: 'te', label: 'Telugu', native: 'తెలుగు' },
];

// ── Preset QR colors ─────────────────────────────────────────────────
const PRESET_COLORS = [
  '#1a56db', '#7c3aed', '#059669', '#dc2626',
  '#d97706', '#0891b2', '#db2777', '#374151',
];

const QRCustomizer = ({
  plan,
  onLogoChange, onColorChange, onWhiteLabelChange,
  onQRShapeChange, onTemplateChange, onBgColorChange,
  onSocialProofChange, onLanguageChange,
}: QRCustomizerProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState(PRESET_COLORS[0]);
  const [activeShape, setActiveShape] = useState<QRDotShape>('square');
  const [activeTemplate, setActiveTemplate] = useState<StandeeTemplate>('minimal');
  const [socialProof, setSocialProof] = useState('');
  const [activeLang, setActiveLang] = useState<StandeeLanguage>('en');
  const [whiteLabelOn, setWhiteLabelOn] = useState(false);
  const [clientName, setClientName] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const isAgency = plan === 'agency';
  const isProPlus = plan === 'pro' || plan === 'agency';

  // ── Handlers ──
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setLogoPreview(url);
      onLogoChange(url);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    onLogoChange(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const pickColor = (c: string) => { setActiveColor(c); onColorChange(c); };
  const pickShape = (s: QRDotShape) => { setActiveShape(s); onQRShapeChange?.(s); };
  const pickTemplate = (t: StandeeTemplate) => { setActiveTemplate(t); onTemplateChange?.(t); };
  const pickLang = (l: StandeeLanguage) => { setActiveLang(l); onLanguageChange?.(l); };

  const handleWhiteLabel = (enabled: boolean) => {
    setWhiteLabelOn(enabled);
    onWhiteLabelChange?.(enabled, clientName);
  };

  const handleClientName = (name: string) => {
    setClientName(name);
    onWhiteLabelChange?.(whiteLabelOn, name);
  };

  const handleSocialProof = (text: string) => {
    setSocialProof(text);
    onSocialProofChange?.(text);
  };

  // ── Shared subsection header ──
  const SubHead = ({ label }: { label: string }) => (
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{label}</p>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
      {/* Panel header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">Customize QR &amp; Standee</p>
            <p className="text-xs text-gray-500">
              {isAgency ? 'Shape · Template · Colors · Language · White Label' : 'Shape · Template · Colors · Language'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${isAgency ? 'bg-rose-500' : 'bg-violet-500'}`}>
            {isAgency ? 'Agency' : 'Pro'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} />
        </div>
      </button>

      {!collapsed && (
        <div className="border-t border-gray-50 divide-y divide-gray-50">

          {/* ── A: Logo & Color ────────────────────────────────────── */}
          <div className="px-6 py-5 space-y-5">
            {/* Logo upload */}
            <div>
              <SubHead label="Center Logo" />
              {!logoPreview ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-9 h-9 bg-gray-100 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors">
                    <Upload className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors">
                    Upload your logo
                  </p>
                  <p className="text-xs text-gray-400">PNG or JPG, max 2MB</p>
                </button>
              ) : (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-200 p-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Logo uploaded ✓</p>
                    <p className="text-xs text-gray-500 mt-0.5">Appears in the QR center</p>
                  </div>
                  <button onClick={removeLogo} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFile} className="hidden" />
            </div>

            {/* Color picker */}
            <div>
              <SubHead label="QR Color" />
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => pickColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${activeColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                    title={c}
                  />
                ))}
                <label className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center cursor-pointer transition-colors overflow-hidden" title="Custom color">
                  <input type="color" className="opacity-0 absolute w-0 h-0" onChange={e => pickColor(e.target.value)} />
                  <span className="text-xs text-gray-400 font-bold">+</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── B: QR Dot Shape (Pro+) ───────────────────────────────── */}
          <div className="px-6 py-5">
            <SubHead label="QR Dot Shape" />
            <div className="grid grid-cols-5 gap-2">
              {QR_SHAPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => pickShape(value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${activeShape === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ShapeIcon shape={value} size={22} />
                  <span className="text-[10px] leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── C: Standee Template & Background (Pro+) ─────────────── */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LayoutTemplate className="w-3.5 h-3.5 text-gray-400" />
                <SubHead label="Standee Template" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {TEMPLATES.map(({ value, label, bg, accent }) => (
                  <button
                    key={value}
                    onClick={() => pickTemplate(value)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${activeTemplate === value
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {/* Mini standee swatch */}
                    <div
                      className="w-full h-10 rounded-lg flex items-center justify-center gap-0.5"
                      style={{ backgroundColor: bg, border: `1px solid ${accent}30` }}
                    >
                      <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: accent, opacity: 0.8 }} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom background color */}
            <div>
              <SubHead label="Background Color Override" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="color"
                    defaultValue="#ffffff"
                    onChange={e => onBgColorChange?.(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <span className="text-sm text-gray-600">Pick a custom background</span>
                </label>
                <button
                  onClick={() => onBgColorChange?.('')}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ── D: Content — Social Proof + Language (Pro+) ─────────── */}
          <div className="px-6 py-5 space-y-4">
            {/* Social proof */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <SubHead label="Social Proof Text" />
              </div>
              <input
                type="text"
                value={socialProof}
                onChange={e => handleSocialProof(e.target.value)}
                placeholder='e.g. "500+ happy customers"'
                maxLength={40}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1.5">Shown as a badge below the QR. Leave blank to hide.</p>
            </div>

            {/* Language */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                <SubHead label="Standee Language" />
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(({ value, label, native }) => (
                  <button
                    key={value}
                    onClick={() => pickLang(value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${activeLang === value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    {native}
                    <span className="ml-1 text-gray-400 font-normal">({label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── E: White Label — Agency only ────────────────────────── */}
          {isAgency && (
            <div className="px-6 py-5">
              <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">White Label</span>
                  </div>
                  <button
                    onClick={() => handleWhiteLabel(!whiteLabelOn)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${whiteLabelOn ? 'bg-rose-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${whiteLabelOn ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {whiteLabelOn
                    ? 'ReviewQR branding removed — your brand appears instead.'
                    : 'Enable to remove "Powered by ReviewQR" and use your agency brand.'}
                </p>
                {whiteLabelOn && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={e => handleClientName(e.target.value)}
                      placeholder="Your agency / client name"
                      className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 placeholder:text-gray-400"
                    />
                  </div>
                )}
                {whiteLabelOn && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2">
                    <EyeOff className="w-3.5 h-3.5" />
                    "Powered by ReviewQR" is hidden on all outputs
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const QRCustomizerTeaser = ({ requiredPlan }: { requiredPlan: 'pro' | 'agency' }) => {
  const { planExpiredNotifSent } = usePlan();
  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-violet-50 to-primary/5 border border-violet-100 rounded-2xl px-5 py-4 mb-6">
      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Palette className="w-5 h-5 text-violet-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">
          Custom shapes, templates &amp; languages on{' '}
          <span className="text-violet-600 capitalize">{requiredPlan}</span> plan
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Dot shapes, standee themes, social proof badges, Hindi/Marathi support and more
        </p>
      </div>
      <Link href="/pricing" className="flex-shrink-0 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
        {planExpiredNotifSent ? 'Renew' : 'Upgrade'}
      </Link>
    </div>
  );
};

export default QRCustomizer;