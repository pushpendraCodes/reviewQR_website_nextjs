'use client';

import Link from 'next/link';
import { Eye, Image as ImageIcon, MapPin, Phone, SmartphoneNfc, Star } from 'lucide-react';
import type { StandeeDisplay } from './StandeePreview';

interface StandeeDisplayOptionsProps {
  display: StandeeDisplay;
  onDisplayChange: (display: StandeeDisplay) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  /** Logo on the standee is a Pro feature; hide the toggle below that. */
  canUseLogo: boolean;
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

const StandeeDisplayOptions = ({ display, onDisplayChange, phone, onPhoneChange, canUseLogo }: StandeeDisplayOptionsProps) => {
  const set = (key: keyof StandeeDisplay) => onDisplayChange({ ...display, [key]: !display[key] });

  const rows: { key: keyof StandeeDisplay; icon: typeof Star; title: string; hint: string }[] = [
    ...(canUseLogo ? [{ key: 'logo' as const, icon: ImageIcon, title: 'Logo', hint: 'Your uploaded logo at the top of the standee' }] : []),
    { key: 'rating', icon: Star, title: 'Google rating', hint: 'Live star rating and review count' },
    { key: 'address', icon: MapPin, title: 'Address', hint: 'Business address from Google' },
    { key: 'phone', icon: Phone, title: 'Phone number', hint: 'Printed under the address' },
    { key: 'nfc', icon: SmartphoneNfc, title: 'Tap (NFC) badge', hint: 'Shows "Tap here" next to the QR' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 px-6 py-5">
      <div className="flex items-center gap-2 mb-1">
        <Eye className="w-4 h-4 text-primary" />
        <p className="text-sm font-bold text-gray-900">Show on standee</p>
      </div>
      <p className="text-xs text-gray-500 mb-4">Turn details on or off. The preview updates instantly.</p>

      <div className="divide-y divide-gray-50">
        {rows.map(({ key, icon: Icon, title, hint }) => (
          <div key={key} className="py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{hint}</p>
              </div>
              <Toggle on={display[key]} onClick={() => set(key)} label={title} />
            </div>

            {key === 'phone' && display.phone && (
              <input
                type="tel"
                value={phone}
                maxLength={25}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="mt-2.5 w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-gray-400"
              />
            )}

            {key === 'nfc' && display.nfc && (
              <p className="mt-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                Only turn this on if you stick an NFC tag on the printed standee, otherwise &quot;Tap&quot; won&apos;t do anything.
                After downloading, follow the <span className="font-semibold">Tap + Scan</span> guide at the bottom of this page
                (or in <Link href="/dashboard/standees" className="underline font-semibold">My QR codes</Link>) to write your link on the tag.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandeeDisplayOptions;
