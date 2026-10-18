'use client';

import { useState } from 'react';
import { Check, Copy, Nfc, QrCode, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface TapScanSetupProps {
  tapUrl?: string;
  compact?: boolean;
}

const COPY = {
  en: {
    title: 'Tap + Scan',
    intro:
      'QR and NFC use the same link. Scan with the camera, or tap a phone on a sticker behind the standee.',
    waitForLink: 'Generate your QR first — this box will show the exact URL to write on the sticker.',
    urlPlaceholder: 'Your tap URL appears here after you generate a QR',
    copied: 'Tap URL copied — write this on your NFC tag',
    write: 'Write NFC tag',
    writing: 'Hold phone on tag…',
    copyApp: 'Copy URL for writer app',
    nfcUnsupported:
      'NFC writing needs Chrome on Android. Copy the URL and use an NFC Tools app instead.',
    written: 'NFC tag written. Customers can tap their phone on it.',
    denied: 'NFC permission denied.',
    cancelled: 'NFC write cancelled.',
    writeFail: 'Could not write NFC tag.',
    guideTitle: 'How to write your NFC sticker',
    steps: [
      {
        title: 'Get NFC stickers',
        body: 'Buy NTAG213 or NTAG215 stickers (cheap, Amazon or a local shop). One sticker per standee.',
      },
      {
        title: 'Write this link on the sticker',
        body: 'Use Write NFC tag on Android Chrome, or NFC Tools: Write → Add record → URL → paste this link → Write, then hold the phone on the sticker.',
      },
      {
        title: 'Stick it on the standee',
        body: 'Place the sticker behind or just under the QR. Avoid thick metal unless the tag is “on-metal”.',
      },
      {
        title: 'Tap or scan',
        body: 'Customers scan the QR or tap the sticker. Both open the same Google review page. iPhone: top of phone. Android: back/center.',
      },
    ],
  },
  hi: {
    title: 'टैप + स्कैन',
    intro:
      'QR और NFC एक ही लिंक इस्तेमाल करते हैं। कैमरा से स्कैन करें, या स्टैंडी के पीछे स्टिकर पर फ़ोन टैप करें।',
    waitForLink: 'पहले QR बनाएँ — उसके बाद यहाँ वही URL दिखेगा जिसे स्टिकर पर लिखना है।',
    urlPlaceholder: 'QR बनने के बाद टैप URL यहाँ दिखेगा',
    copied: 'टैप URL कॉपी हो गया — इसे NFC टैग पर लिखें',
    write: 'NFC टैग लिखें',
    writing: 'फ़ोन स्टिकर पर रखें…',
    copyApp: 'राइटर ऐप के लिए URL कॉपी करें',
    nfcUnsupported:
      'NFC लिखने के लिए Android Chrome चाहिए। URL कॉपी करके NFC Tools ऐप इस्तेमाल करें।',
    written: 'NFC टैग लिख दिया गया। ग्राहक फ़ोन टैप करके खोल सकते हैं।',
    denied: 'NFC अनुमति नहीं मिली।',
    cancelled: 'NFC लिखना रद्द हुआ।',
    writeFail: 'NFC टैग नहीं लिखा जा सका।',
    guideTitle: 'NFC स्टिकर पर लिंक कैसे लिखें',
    steps: [
      {
        title: 'NFC स्टिकर लें',
        body: 'NTAG213 या NTAG215 स्टिकर खरीदें (सस्ते, Amazon या लोकल दुकान)। हर स्टैंडी के लिए एक स्टिकर।',
      },
      {
        title: 'इस लिंक को स्टिकर पर लिखें',
        body: 'Android Chrome में “NFC टैग लिखें” दबाएँ, या NFC Tools: Write → Add record → URL → यह लिंक पेस्ट करें → Write, फिर फ़ोन स्टिकर पर रखें।',
      },
      {
        title: 'स्टैंडी पर चिपकाएँ',
        body: 'स्टिकर QR के पीछे या ठीक नीचे लगाएँ। मोटी धातु पर न लगाएँ, जब तक टैग “on-metal” न हो।',
      },
      {
        title: 'टैप या स्कैन',
        body: 'ग्राहक QR स्कैन करें या स्टिकर पर टैप करें — दोनों एक ही रिव्यू पेज खोलते हैं। iPhone: फ़ोन का ऊपरी हिस्सा। Android: पीछे/बीच में।',
      },
    ],
  },
} as const;

export default function TapScanSetup({ tapUrl = '', compact = false }: TapScanSetupProps) {
  const [copied, setCopied] = useState(false);
  const [writing, setWriting] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const t = COPY[lang];
  const hasUrl = Boolean(tapUrl);

  const copyUrl = async () => {
    if (!tapUrl) {
      toast.error(t.waitForLink);
      return;
    }
    await navigator.clipboard.writeText(tapUrl);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const writeNfcTag = async () => {
    if (!tapUrl) {
      toast.error(t.waitForLink);
      return;
    }
    const NDEFReader = (window as any).NDEFReader;
    if (!NDEFReader) {
      toast.error(t.nfcUnsupported);
      return;
    }
    try {
      setWriting(true);
      const ndef = new NDEFReader();
      await ndef.write({ records: [{ recordType: 'url', data: tapUrl }] });
      toast.success(t.written);
    } catch (err: any) {
      const name = err?.name || '';
      if (name === 'NotAllowedError') toast.error(t.denied);
      else if (name === 'AbortError') toast.error(t.cancelled);
      else toast.error(err?.message || t.writeFail);
    } finally {
      setWriting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-emerald-100 bg-emerald-50/50 ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shrink-0">
          <Nfc className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-sm">{t.title}</h3>
            <div className="inline-flex rounded-lg bg-white border border-gray-200 p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-md ${lang === 'en' ? 'bg-primary text-white' : 'text-gray-500'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded-md ${lang === 'hi' ? 'bg-primary text-white' : 'text-gray-500'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{t.intro}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 mb-3">
        <code className="flex-1 text-[11px] text-gray-600 truncate font-mono">
          {hasUrl ? tapUrl : t.urlPlaceholder}
        </code>
        <button
          type="button"
          onClick={copyUrl}
          disabled={!hasUrl}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
          title="Copy tap URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
        </button>
      </div>

      {!hasUrl && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
          {t.waitForLink}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={writeNfcTag}
          disabled={writing || !hasUrl}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
        >
          <Smartphone className="w-3.5 h-3.5" />
          {writing ? t.writing : t.write}
        </button>
        <button
          type="button"
          onClick={copyUrl}
          disabled={!hasUrl}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:border-primary disabled:opacity-60"
        >
          <QrCode className="w-3.5 h-3.5" />
          {t.copyApp}
        </button>
      </div>

      <p className="text-xs font-bold text-gray-800 mb-2">{t.guideTitle}</p>
      <ol className="space-y-2.5">
        {t.steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-900">{step.title}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
