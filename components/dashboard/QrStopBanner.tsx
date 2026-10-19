'use client';

import Link from 'next/link';
import { AlertTriangle, Clock } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useListQRCodesQuery } from '@/store/api/qrApi';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** Account-wide notice for owners whose QR codes are about to stop (Free period / plan grace) or already have. */
const QrStopBanner = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isStaff = user?.team?.role === 'staff';
  const { data } = useListQRCodesQuery({ limit: 1 }, { skip: !user || isStaff });

  const stop = data?.qrStop;
  const total = data?.accountTotal ?? 0;
  const paused = data?.accountPaused ?? 0;
  if (!data || isStaff || total === 0 || (!stop && paused === 0)) return null;

  const lapsed = stop?.reason === 'lapsed';
  const action = lapsed ? 'Renew plan' : 'Upgrade now';
  const qrs = total === 1 ? 'Your QR code' : 'Your QR codes';

  if (paused > 0) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-16 md:mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold">
              {paused === 1 ? 'Your QR code is' : `${paused} QR codes are`} paused
              {stop ? (lapsed ? ' because your plan expired.' : ` because your ${stop.trialDays}-day free period ended.`) : '.'}
            </span>{' '}
            Customers who scan {paused === 1 ? 'it' : 'them'} see a &quot;temporarily unavailable&quot; page. Choose a plan and {paused === 1 ? 'it starts' : 'they start'} working again instantly.
          </span>
        </p>
        <Link href="/pricing" className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-center text-xs font-semibold text-white hover:bg-red-700">
          {action}
        </Link>
      </div>
    );
  }

  if (!stop) return null;
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-16 md:mt-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2">
        <Clock size={16} className="mt-0.5 shrink-0" />
        <span>
          {lapsed ? (
            <>
              <span className="font-semibold">Your plan has expired.</span> {qrs} will stop working on{' '}
              <span className="font-semibold">{formatDate(stop.pauseOn)}</span> unless you renew.
            </>
          ) : (
            <>
              <span className="font-semibold">Free plan:</span> {qrs.toLowerCase()} work{total === 1 ? 's' : ''} until{' '}
              <span className="font-semibold">{formatDate(stop.pauseOn)}</span>. Upgrade to keep collecting reviews after that.
            </>
          )}
        </span>
      </p>
      <Link href="/pricing" className="shrink-0 rounded-lg bg-[#1A6B45] px-4 py-2 text-center text-xs font-semibold text-white hover:bg-[#165a3a]">
        {action}
      </Link>
    </div>
  );
};

export default QrStopBanner;
