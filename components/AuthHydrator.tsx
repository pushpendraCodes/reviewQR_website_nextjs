'use client';

import { useEffect } from 'react';
import { syncAccessTokenCookieFromStorage } from '@/lib/authCookie';

/**
 * Keeps the middleware cookie in sync with localStorage.
 * Without this, session cookies can disappear while localStorage still
 * shows the user as logged in → dashboard → login flash → home.
 */
export default function AuthHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncAccessTokenCookieFromStorage();

    // Re-sync when the tab becomes visible again (cookie may have been cleared).
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        syncAccessTokenCookieFromStorage();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  return <>{children}</>;
}
