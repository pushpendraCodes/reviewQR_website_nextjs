'use client';

import { Suspense, useState, useEffect } from 'react';
import {
  Info, Loader2, Download, Share2, Copy,
  FileImage, FileType, Check, Lock, MapPin,
  X, ArrowRight,
} from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import BusinessSearchBar from '@/components/BusinessSearchBar';
import { useAppSelector } from '@/store/hooks';
import BusinessResultCard from '@/components/BusinessResultCard';
import QRErrorOverlay from '@/components/QRErrorOverlay';
import UpsellBanner from '@/components/UpsellBanner';
import QRCustomizer, { QRCustomizerTeaser } from '@/components/Qrcustomizer';
import StandeeTeaser from '@/components/Standeeteaser';
import StandeePreview from '@/components/StandeePreview';
import { useBusinessSearch } from '@/hooks/useBusinessSearch';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { usePlan } from '@/hooks/Useplan';
import type { QRDotShape, StandeeLanguage, StandeeTemplate } from '@/components/StandeePreview';
import { useStandeeDownload } from '@/hooks/useStandeeDownload';
import toast from 'react-hot-toast';
import { useGenerateQRMutation, useGetQRCodeQuery } from '@/store/api/qrApi';

const GeneratePageContent = () => {
  const { plan, hasAccess, planExpiredNotifSent } = usePlan();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && e.key === 'p') || // Print
        (e.metaKey && e.shiftKey && ['s', 'S', '3', '4', '5'].includes(e.key)) || // Mac/Windows shortcuts
        (e.ctrlKey && e.shiftKey && ['s', 'S'].includes(e.key))
      ) {
        e.preventDefault();
        toast.error('Screenshots are not allowed on this page!', {
          duration: 3000,
          icon: '🛑',
        });
        navigator.clipboard.writeText('');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('Screenshots are not allowed on this page!', {
          duration: 3000,
          icon: '🛑',
        });
        navigator.clipboard.writeText('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const searchParams = useSearchParams();
  const {
    query, setQuery, results, isLoading, isError,
    hasSearched, selectedCategory, setSelectedCategory, searchNow,
  } = useBusinessSearch({ initialQuery: searchParams.get('q') || undefined });


  const { data: existingData, isLoading: isDetailLoading } = useGetQRCodeQuery(id || '', { skip: !id });

  const {
    selectedBusiness, reviewURL, shortURL, setShortURL,
    isGenerating, qrError, selectBusiness,
    setSelectedBusiness, setReviewURL,
    clearSelection,
  } = useQRGenerator();

  // ── Customizer state ──────────────────────────────────────────────
  const [_logo, setLogo] = useState<string | null>(null);
  const [_qrColor, setQrColor] = useState('#1D9E75');
  const [_whiteLabel, setWhiteLabel] = useState({ enabled: false, clientName: '' });
  const [_qrShape, setQrShape] = useState<QRDotShape>('square');
  const [_template, setTemplate] = useState<StandeeTemplate>('minimal');
  const [_standeeBgColor, setStandeeBgColor] = useState('');
  const [_socialProof, setSocialProof] = useState('');
  const [_language, setLanguage] = useState<StandeeLanguage>('en');

  const [initialized, setInitialized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingDownloadLabel, setPendingDownloadLabel] = useState<string | null>(null);

  // ── Restore pending design after login ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pendingStr = sessionStorage.getItem('pending_qr_design');
    if (pendingStr) {
      try {
        const pending = JSON.parse(pendingStr);
        if (pending.selectedBusiness) {
          setSelectedBusiness(pending.selectedBusiness);
          if (pending.reviewURL) setReviewURL(pending.reviewURL);
          if (pending.shortURL) setShortURL(pending.shortURL);

          if (pending.customizer) {
            if (pending.customizer.logo !== undefined) setLogo(pending.customizer.logo);
            if (pending.customizer.qrColor !== undefined) setQrColor(pending.customizer.qrColor);
            if (pending.customizer.whiteLabel !== undefined) setWhiteLabel(pending.customizer.whiteLabel);
            if (pending.customizer.qrShape !== undefined) setQrShape(pending.customizer.qrShape);
            if (pending.customizer.template !== undefined) setTemplate(pending.customizer.template);
            if (pending.customizer.standeeBgColor !== undefined) setStandeeBgColor(pending.customizer.standeeBgColor);
            if (pending.customizer.socialProof !== undefined) setSocialProof(pending.customizer.socialProof);
            if (pending.customizer.language !== undefined) setLanguage(pending.customizer.language);
          }
        }
      } catch (e) {
        console.error('Failed to parse pending QR design', e);
      } finally {
        sessionStorage.removeItem('pending_qr_design');
      }
    }
  }, [setSelectedBusiness, setReviewURL, setShortURL]);

  // ── Sync existing data if editing ──────────────────────────────────
  useEffect(() => {
    if (existingData?.success && existingData.qr && !initialized) {
      const qr = existingData.qr;

      // 1. Set business context
      setSelectedBusiness({
        placeId: qr.placeId,
        name: qr.businessName,
        address: qr.placeAddress,
        rating: qr.placeRating,
        totalReviews: qr.totalReviews,
      });
      setReviewURL(qr.reviewURL);
      setShortURL(qr.shortURL);

      // 2. Set customizer state
      setQrColor(qr.qrConfig.color);
      setQrShape(qr.qrConfig.shape);
      setLogo(qr.qrConfig.logoUrl || null);

      // 3. Set standee state
      if (qr.standeeConfig) {
        setTemplate(qr.standeeConfig.template);
        setStandeeBgColor(qr.standeeConfig.bgColor || '');
        setSocialProof(qr.standeeConfig.socialProof || '');
        setLanguage(qr.standeeConfig.language);
        setWhiteLabel(qr.standeeConfig.whiteLabel);
      }
      setInitialized(true);
    }
  }, [existingData, initialized, setSelectedBusiness, setReviewURL, setShortURL]);

  // ── Copy link ─────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!reviewURL) return;
    navigator.clipboard.writeText(reviewURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const {
    standeeRef,
    downloading,
    downloadPNG,
    downloadSVG,
    downloadPDF,
  } = useStandeeDownload(selectedBusiness?.name ?? '');

  const [generateQR] = useGenerateQRMutation();

  // ── handleDownload: save config to backend first, then download ────
  // label is 'PNG' | 'SVG' | 'PDF Standee' | 'PDF'
  const handleDownload = async (
    fn: () => Promise<void>,
    label: string,
  ) => {
    if (!selectedBusiness) return;

    if (!isAuthenticated) {
      const design = {
        selectedBusiness,
        reviewURL,
        shortURL,
        customizer: {
          logo: _logo,
          qrColor: _qrColor,
          whiteLabel: _whiteLabel,
          qrShape: _qrShape,
          template: _template,
          standeeBgColor: _standeeBgColor,
          socialProof: _socialProof,
          language: _language,
        }
      };
      sessionStorage.setItem('pending_qr_design', JSON.stringify(design));
      setPendingDownloadLabel(label);
      setShowAuthModal(true);
      return;
    }

    const format = label.toLowerCase().startsWith('pdf')
      ? 'pdf'
      : (label.toLowerCase() as 'png' | 'svg');

    const tid = toast.loading(`Preparing ${label}…`);

    try {
      // 1️⃣  Persist / update QR config on the backend
      const result = await generateQR({
        placeId: selectedBusiness.placeId,
        businessName: selectedBusiness.name,
        placeAddress: selectedBusiness.address,
        placeRating: selectedBusiness.rating,
        totalReviews: selectedBusiness.totalReviews,
        format,
        // QR config (backend strips disallowed fields per plan)
        color: _qrColor,
        shape: _qrShape,
        logoData: _logo,
        // Standee config
        template: _template,
        bgColor: _standeeBgColor,
        socialProof: _socialProof,
        language: _language,
        whiteLabel: _whiteLabel,
      }).unwrap();

      if (!result.success) {
        toast.error(result.message || `Failed to save QR config`, { id: tid });
        return;
      }

      // 2️⃣  API succeeded — now update shortURL for preview captured image
      if (result.qr?.shortURL) {
        setShortURL(result.qr.shortURL);
        // Delay to ensure StandeePreview re-renders
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      await fn();
      toast.success(`${label} downloaded!`, { id: tid });
    } catch (err: any) {
      const status = err?.status;
      if (status === 403) {
        toast.error(
          err?.data?.message ||
          "You've reached your plan limit. Upgrade to generate more QR codes.",
          { id: tid },
        );
      } else {
        toast.error(`Failed to download ${label}`, { id: tid });
      }
    }
  };

  // ── Download button (plan-gated) ──────────────────────────────────
  const DownloadButton = ({
    label, icon: Icon, format, requiredPlan, onClick,
  }: {
    label: string;
    icon: React.ElementType;
    format: string;
    requiredPlan: 'free' | 'starter' | 'pro' | 'agency';
    onClick?: () => void;
  }) => {
    const allowed = !isAuthenticated || hasAccess(requiredPlan);
    return (
      <button
        onClick={allowed ? onClick : undefined}
        title={allowed ? `Download ${format}` : `Requires ${requiredPlan} plan`}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${allowed
          ? 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:shadow-sm active:scale-95'
          : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
      >
        <Icon className="w-4 h-4" />
        {label}
        {!allowed && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-gray-500" />
          </div>
        )}
      </button>
    );
  };

  // When editing an existing QR (id param present), show loading until
  // data is fetched AND selectedBusiness is populated — prevents the
  // search section from flashing before the preview.

  const isEditLoading = isEditMode && !initialized && (isDetailLoading || !selectedBusiness);

  if (isEditLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading QR Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">


      {/* ── Page Header ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-white via-primary-light/20 to-white py-10 sm:py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {isEditMode ? 'Edit & Re-download Your QR Standee' : 'Generate Your Google Review QR Code'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {isEditMode
              ? 'Customize your standee design and re-download in your preferred format.'
              : 'Search your business and download a QR. Paid plans add AI review suggestions so customers finish reviews faster.'}
          </p>
          <div className="mt-4 inline-flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${plan === 'free' ? 'bg-gray-400' :
              plan === 'starter' ? 'bg-blue-500' :
                plan === 'pro' ? 'bg-violet-500' :
                  'bg-rose-500'
              }`}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </span>
            {plan === 'free' && (
              <Link href="/pricing" className="text-xs text-primary font-semibold hover:underline">
                {planExpiredNotifSent ? 'Renew your plan for more features →' : 'Upgrade for more features →'}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── STEP 1: SEARCH ────────────────────────────────────────── */}
        {!selectedBusiness && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-xl font-bold text-gray-900">Search Your Business</h2>
            </div>

            <BusinessSearchBar
              query={query}
              setQuery={setQuery}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearch={searchNow}
            />

            {/* Loading skeleton */}
            {isLoading && (
              <div className="mt-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="skeleton h-5 w-48 mb-3" />
                        <div className="skeleton h-4 w-64 mb-2" />
                        <div className="skeleton h-4 w-32" />
                      </div>
                      <div className="skeleton w-8 h-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* API Error */}
            {isError && !isLoading && (
              <div className="mt-8 text-center py-10">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
                <p className="text-sm text-gray-500">Failed to fetch results. Please try again.</p>
                <button
                  onClick={searchNow}
                  className="mt-4 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Results */}
            {!isLoading && !isError && hasSearched && (
              <div className="mt-8">
                {results.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      Found <span className="font-semibold text-gray-700">{results.length}</span>{' '}
                      business{results.length > 1 ? 'es' : ''} — click to select
                    </p>
                    <div className="space-y-3 stagger-children">
                      {results.map((business, index) => (
                        <BusinessResultCard
                          key={index}
                          business={business}
                          onSelect={selectBusiness}
                          index={index}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      Try a different name, address, or category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: TWO-COLUMN LAYOUT ─────────────────────────────── */}
        {selectedBusiness && (
          <div>
            {/* Step header — full width */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-xl font-bold text-gray-900">
                {isGenerating
                  ? 'Generating QR Code...'
                  : qrError
                    ? 'Unable to Generate QR Code'
                    : 'Your QR Code is Ready!'}
              </h2>
              {isGenerating && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            </div>

            {/* ── Two-column grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

              {/* ════ LEFT COLUMN: controls ════════════════════════════ */}
              <div className="space-y-5 min-w-0">

                {/* Selected business card */}
                <div className="flex items-center justify-between p-4 bg-primary-light rounded-xl border border-primary/20">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedBusiness.name}</h3>
                    <div className="flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-500 line-clamp-1">{selectedBusiness.address}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-sm">★</span>
                      <span className="text-sm font-medium text-gray-700">{selectedBusiness.rating}</span>
                      <span className="text-sm text-gray-400">· {selectedBusiness.totalReviews} reviews</span>
                    </div>
                  </div>
                  {!isEditMode && (
                    <button
                      onClick={clearSelection}
                      className="ml-4 flex-shrink-0 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Free plan watermark notice */}
                {plan === 'free' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    This QR includes a ReviewQR watermark.{' '}
                    <Link href="/pricing" className="underline font-semibold">
                      {planExpiredNotifSent ? 'Renew to remove it.' : 'Upgrade to remove it.'}
                    </Link>
                  </div>
                )}

                {/* Pro/Agency: full customizer */}
                {hasAccess('pro') && (
                  <QRCustomizer
                    plan={plan}
                    onLogoChange={setLogo}
                    onColorChange={setQrColor}
                    onWhiteLabelChange={(enabled, clientName) => setWhiteLabel({ enabled, clientName })}
                    onQRShapeChange={setQrShape}
                    onTemplateChange={setTemplate}
                    onBgColorChange={setStandeeBgColor}
                    onSocialProofChange={setSocialProof}
                    onLanguageChange={setLanguage}
                  />
                )}

                {/* Free/Starter: customizer teaser */}
                {!hasAccess('pro') && <QRCustomizerTeaser requiredPlan="pro" />}

                {/* QR error overlay */}
                {qrError && !isGenerating && (
                  <QRErrorOverlay
                    error={qrError}
                    onRetry={() => selectBusiness(selectedBusiness)}
                  />
                )}

                {/* Download & Share row */}
                {!qrError && !isGenerating && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                      Download &amp; Share
                    </p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <DownloadButton
                        label={downloading === 'png' ? 'Saving…' : 'PNG'}
                        icon={FileImage}
                        format="PNG"
                        requiredPlan="free"
                        onClick={() => handleDownload(downloadPNG, 'PNG')}
                      />

                      <DownloadButton
                        label={downloading === 'svg' ? 'Saving…' : 'SVG'}
                        icon={FileType}
                        format="SVG"
                        requiredPlan="starter"
                        onClick={() => handleDownload(downloadSVG, 'SVG')}
                      />

                      <DownloadButton
                        label={downloading === 'pdf' ? 'Saving…' : 'PDF Standee'}
                        icon={Download}
                        format="PDF"
                        requiredPlan="starter"
                        onClick={() => handleDownload(downloadPDF, 'PDF Standee')}
                      />


                      <a href={`https://wa.me/?text=${encodeURIComponent(reviewURL ?? '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-200 active:scale-95"
                      >
                        <Share2 className="w-4 h-4" />
                        WhatsApp
                      </a>

                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
                      >
                        {copied ? (
                          <><Check className="w-4 h-4 text-green-500" /><span className="text-green-600">Copied!</span></>
                        ) : (
                          <><Copy className="w-4 h-4" />Copy Link</>
                        )}
                      </button>
                    </div>

                    {/* Review URL strip */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <code className="flex-1 text-xs text-gray-500 truncate">{reviewURL}</code>
                      <button
                        onClick={handleCopy}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copied
                          ? <Check className="w-3.5 h-3.5 text-green-500" />
                          : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                    </div>

                    {!hasAccess('starter') && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-3">
                        <Lock className="w-3 h-3" />
                        SVG &amp; PDF Standee available on{' '}
                        <Link href="/pricing" className="text-primary font-semibold hover:underline">
                          Starter plan (₹299/mo)
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                {/* Upsell banners */}
                {plan === 'free' && !qrError && <StandeeTeaser />}
                {hasAccess('starter') && !hasAccess('pro') && !qrError && <UpsellBanner />}
              </div>

              {/* ════ RIGHT COLUMN: sticky standee preview ════════════ */}
              {/* ════ RIGHT COLUMN: sticky standee preview ════════════ */}
              <div className="lg:sticky lg:top-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
                    Live Preview
                  </p>

                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-sm text-gray-400">Generating your QR…</p>
                    </div>
                  ) : (
                    // ← ref goes on this wrapper div, NOT on StandeePreview itself
                    // so we capture only the standee card, not the outer padding
                    <div ref={standeeRef} className="inline-block w-full">
                      <StandeePreview
                        business={selectedBusiness}
                        reviewURL={reviewURL}
                        shortURL={shortURL}
                        plan={plan}
                        logo={_logo}
                        qrColor={_qrColor}
                        whiteLabel={_whiteLabel}
                        qrShape={_qrShape}
                        template={_template}
                        standeeBgColor={_standeeBgColor}
                        socialProof={_socialProof}
                        language={_language}
                      />
                    </div>
                  )}

                  {/* quick download shortcut right below the preview */}
                  {!isGenerating && !qrError && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        { label: 'PNG', fn: downloadPNG, fmt: 'png' as const, plan: 'free' as const },
                        { label: 'SVG', fn: downloadSVG, fmt: 'svg' as const, plan: 'starter' as const },
                        { label: 'PDF', fn: downloadPDF, fmt: 'pdf' as const, plan: 'starter' as const },
                      ].map(({ label, fn, fmt, plan: req }) => {
                        const allowed = !isAuthenticated || hasAccess(req);
                        const busy = downloading === fmt;
                        return (
                          <button
                            key={label}
                            onClick={allowed ? () => handleDownload(fn, label) : undefined}
                            disabled={!!downloading}
                            title={allowed ? `Download ${label}` : `Requires ${req} plan`}
                            className={`relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all ${allowed
                              ? 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50'
                              : 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                              }`}
                          >
                            {busy
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Download className="w-3.5 h-3.5" />}
                            {busy ? 'Saving…' : label}
                            {!allowed && (
                              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <Lock className="w-2 h-2 text-gray-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>{/* end two-column grid */}
          </div>
        )}
      </div>

      {/* Auth Modal for Gating Download */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 animate-scale-up">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header icon */}
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-primary" />
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Save &amp; Download Your QR Code
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              To download your custom <span className="font-semibold text-gray-700">{pendingDownloadLabel || 'QR Code'}</span>, please create a free account. Your customization settings will be saved automatically!
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                href={`/auth/signup?redirect=/google-review-qr-code-generator`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 active:scale-95 text-sm"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/auth/login?redirect=/google-review-qr-code-generator`}
                className="w-full flex items-center justify-center py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-200 active:scale-95 text-sm"
              >
                Sign In
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              No credit card required. Free plan includes custom QR downloads.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const GeneratePage = () => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
};

export default GeneratePage;