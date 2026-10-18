type QrGoogleStats = {
  currentRating: number;
  totalReviews: number;
  googleSyncedAt?: string | null;
};

/** Aggregate Google rating data across a user's QR codes. */
export function summarizeGoogleStats(qrCodes: QrGoogleStats[] = []) {
  const totalReviews = qrCodes.reduce((acc, qr) => acc + (qr.totalReviews || 0), 0);
  const rated = qrCodes.filter((qr) => (qr.currentRating || 0) > 0);

  // Weight by review count when available; otherwise plain average of rated QRs.
  const avgRating =
    totalReviews > 0
      ? qrCodes.reduce((acc, qr) => acc + (qr.currentRating || 0) * (qr.totalReviews || 0), 0) /
        totalReviews
      : rated.length
        ? rated.reduce((acc, qr) => acc + qr.currentRating, 0) / rated.length
        : 0;

  const syncTimes = qrCodes
    .map((qr) => (qr.googleSyncedAt ? new Date(qr.googleSyncedAt).getTime() : 0))
    .filter(Boolean);

  return {
    totalReviews,
    avgRating: Math.round(avgRating * 10) / 10,
    lastSyncedAt: syncTimes.length ? new Date(Math.min(...syncTimes)) : null,
  };
}

export function formatSyncedAgo(date: Date | null) {
  if (!date) return 'Not synced yet';
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'Synced just now';
  if (mins < 60) return `Synced ${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Synced ${hours}h ago`;
  return `Synced ${Math.round(hours / 24)}d ago`;
}
