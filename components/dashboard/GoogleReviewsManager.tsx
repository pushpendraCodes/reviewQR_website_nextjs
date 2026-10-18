'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Star,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Link2,
  Unlink,
  Loader2,
  Filter,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PlanGate from '@/components/dashboard/PlanGate';
import {
  useDisconnectGbpMutation,
  useGenerateGbpAiReplyMutation,
  useGetGbpReviewsQuery,
  useGetGbpStatusQuery,
  useLazyGetConnectUrlQuery,
  usePostGbpReplyMutation,
  useRefreshGbpLocationsMutation,
  useSelectGbpLocationMutation,
  useSyncGbpReviewsMutation,
  type GbpReview,
} from '@/store/api/gbpApi';

const STAR_OPTIONS = [5, 4, 3, 2, 1] as const;

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ReviewReplyPanel({
  review,
  onPosted,
}: {
  review: GbpReview;
  onPosted: () => void;
}) {
  const [draft, setDraft] = useState(review.replyComment || '');
  const [postReply, { isLoading: posting }] = usePostGbpReplyMutation();
  const [generateAi, { isLoading: aiLoading }] = useGenerateGbpAiReplyMutation();

  useEffect(() => {
    setDraft(review.replyComment || '');
  }, [review._id, review.replyComment]);

  const handleAi = async () => {
    const tid = toast.loading('Generating reply…');
    try {
      const res = await generateAi({ reviewId: review.googleReviewId }).unwrap();
      setDraft(res.suggestion);
      toast.success('AI reply ready — edit before posting', { id: tid });
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        'Could not generate reply';
      toast.error(msg, { id: tid });
    }
  };

  const handlePost = async () => {
    if (!draft.trim()) {
      toast.error('Write a reply first');
      return;
    }
    const tid = toast.loading('Posting to Google…');
    try {
      await postReply({ reviewId: review.googleReviewId, comment: draft }).unwrap();
      toast.success('Reply posted on Google', { id: tid });
      onPosted();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to post reply';
      toast.error(msg, { id: tid });
    }
  };

  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      {review.replyStatus === 'replied' && review.replyComment && (
        <div className="rounded-lg bg-[#E8F5EE]/60 px-3 py-2 text-xs text-gray-700">
          <span className="font-semibold text-[#1A6B45]">Your reply · </span>
          {review.replyComment}
          {review.replyUpdateTime && (
            <span className="block text-[10px] text-gray-400 mt-1">
              Updated {formatDate(review.replyUpdateTime)}
            </span>
          )}
        </div>
      )}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder="Write a public reply on Google…"
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20 focus:border-[#1A6B45]"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAi}
          disabled={aiLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50"
        >
          {aiLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          AI Generate Reply
        </button>
        <button
          type="button"
          onClick={handlePost}
          disabled={posting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A6B45] text-white hover:bg-[#155a38] disabled:opacity-50"
        >
          {posting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Post to Google
        </button>
      </div>
    </div>
  );
}

function GoogleReviewsContent() {
  const searchParams = useSearchParams();
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [replyFilter, setReplyFilter] = useState<'all' | 'replied' | 'unreplied'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: status, isLoading: statusLoading, refetch: refetchStatus } =
    useGetGbpStatusQuery();
  const [fetchConnectUrl, { isFetching: connecting }] = useLazyGetConnectUrlQuery();
  const [selectLocation, { isLoading: selectingLocation }] =
    useSelectGbpLocationMutation();
  const [refreshLocations, { isLoading: refreshingLocations }] =
    useRefreshGbpLocationsMutation();
  const [syncReviews, { isLoading: syncing }] = useSyncGbpReviewsMutation();
  const [disconnect, { isLoading: disconnecting }] = useDisconnectGbpMutation();

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 15,
      stars: starFilter.length ? starFilter.join(',') : undefined,
      replyStatus: replyFilter === 'all' ? undefined : replyFilter,
    }),
    [page, starFilter, replyFilter]
  );

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetGbpReviewsQuery(queryArgs, {
    skip: !status?.connected || !status?.selectedLocationResourceName,
  });

  useEffect(() => {
    if (searchParams.get('connected') === '1') {
      toast.success('Google Business Profile connected');
      refetchStatus();
    }
    const err = searchParams.get('error');
    if (err) toast.error(decodeURIComponent(err));
  }, [searchParams, refetchStatus]);

  const handleConnect = useCallback(async () => {
    try {
      const res = await fetchConnectUrl().unwrap();
      if (res.url) window.location.href = res.url;
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        'Could not start Google connection';
      toast.error(msg);
    }
  }, [fetchConnectUrl]);

  const handleSync = async () => {
    const tid = toast.loading('Syncing reviews from Google…');
    try {
      const res = await syncReviews().unwrap();
      toast.success(`Synced ${res.synced} review(s) from Google`, { id: tid });
      refetchReviews();
      refetchStatus();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        'Sync failed';
      toast.error(msg, { id: tid });
    }
  };

  const toggleStar = (star: number) => {
    setPage(1);
    setStarFilter((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const connected = status?.connected;
  const locations = status?.locations || [];

  return (
    <PlanGate requiredPlan="pro" featureName="Google Reviews Management">
      <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-8 mt-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Google Reviews
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Connect your Business Profile, sync reviews, and reply on Google — with AI
              drafts you can edit before posting.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {connected ? (
              <>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {syncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sync
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm('Disconnect Google Business Profile?')) return;
                    await disconnect().unwrap();
                    toast.success('Disconnected');
                  }}
                  disabled={disconnecting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Unlink className="w-4 h-4" />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting || statusLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#1A6B45] text-white hover:bg-[#155a38] disabled:opacity-50"
              >
                {connecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                Connect Google Business Profile
              </button>
            )}
          </div>
        </div>

        {!connected && !statusLoading && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No Business Profile connected</p>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Authorize with Google using the{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">business.manage</code>{' '}
              scope, then choose a verified location to manage reviews.
            </p>
          </div>
        )}

        {connected && status?.lastError && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold mb-1">Google Business Profile issue</p>
            <p className="text-amber-800/90 leading-relaxed">{status.lastError}</p>
            <button
              type="button"
              disabled={refreshingLocations}
              onClick={async () => {
                const tid = toast.loading('Refreshing locations…');
                try {
                  const res = await refreshLocations().unwrap();
                  toast.success(res.message || 'Locations refreshed', { id: tid });
                  refetchStatus();
                } catch (err: unknown) {
                  const msg =
                    (err as { data?: { message?: string } })?.data?.message ||
                    'Could not load locations';
                  toast.error(msg, { id: tid });
                }
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 underline"
            >
              {refreshingLocations ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              Retry load locations
            </button>
          </div>
        )}

        {connected && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Average</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {reviewsData?.stats.averageRating?.toFixed(1) || '—'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total reviews</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {reviewsData?.stats.totalReviewCount ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Needs reply</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">
                  {reviewsData?.stats.unrepliedCount ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Business location
                  </label>
                  <select
                    value={status?.selectedLocationResourceName || ''}
                    disabled={selectingLocation}
                    onChange={async (e) => {
                      await selectLocation({
                        locationResourceName: e.target.value,
                      }).unwrap();
                      setPage(1);
                      toast.success('Location updated');
                    }}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B45]/20"
                  >
                    {locations.map((loc) => (
                      <option key={loc.locationResourceName} value={loc.locationResourceName}>
                        {loc.title}
                        {loc.address ? ` — ${loc.address}` : ''}
                      </option>
                    ))}
                  </select>
                  {status?.accountDisplayName && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Account: {status.accountDisplayName}
                      {status.lastSyncAt &&
                        ` · Last sync ${formatDate(status.lastSyncAt)}`}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-2">
                    <Filter className="w-3 h-3" /> Filters
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {STAR_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleStar(s)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                          starFilter.includes(s)
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {s}★
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {(['all', 'unreplied', 'replied'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setReplyFilter(key);
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${
                          replyFilter === key
                            ? 'bg-[#E8F5EE] border-[#1A6B45]/30 text-[#1A6B45]'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {status?.lastError && (
                <p className="text-xs text-red-600 mt-3">{status.lastError}</p>
              )}
            </div>

            <div className="space-y-3">
              {reviewsLoading && (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1A6B45]" />
                </div>
              )}
              {!reviewsLoading &&
                (reviewsData?.reviews.length ? (
                  reviewsData.reviews.map((review) => (
                    <article
                      key={review._id}
                      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[#E8F5EE] flex items-center justify-center text-sm font-bold text-[#1A6B45] shrink-0">
                            {(review.reviewerDisplayName || '?')[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {review.reviewerDisplayName}
                            </p>
                            <StarRow count={review.starRating} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              review.replyStatus === 'replied'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {review.replyStatus}
                          </span>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {formatDate(review.createTime)}
                          </p>
                        </div>
                      </div>
                      {review.comment ? (
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic mt-3">No written comment</p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((id) =>
                            id === review._id ? null : review._id
                          )
                        }
                        className="mt-3 text-xs font-semibold text-[#1A6B45] hover:underline"
                      >
                        {expandedId === review._id ? 'Hide reply' : 'Reply on Google'}
                      </button>
                      {expandedId === review._id && (
                        <ReviewReplyPanel
                          review={review}
                          onPosted={() => {
                            refetchReviews();
                            setExpandedId(null);
                          }}
                        />
                      )}
                    </article>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-sm">No reviews match your filters.</p>
                    <button
                      type="button"
                      onClick={handleSync}
                      className="mt-3 text-sm font-semibold text-[#1A6B45] hover:underline"
                    >
                      Sync from Google
                    </button>
                  </div>
                ))}

              {(reviewsData?.pagination.pages || 0) > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 self-center">
                    Page {page} of {reviewsData?.pagination.pages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= (reviewsData?.pagination.pages || 1)}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PlanGate>
  );
}

export default function GoogleReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24 mt-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A6B45]" />
        </div>
      }
    >
      <GoogleReviewsContent />
    </Suspense>
  );
}
