import Cookies from 'js-cookie';

export const ACCESS_TOKEN_COOKIE = 'accessToken';

/** Persist access token for Next.js middleware (must match localStorage). */
export function persistAccessTokenCookie(token: string) {
  Cookies.set(ACCESS_TOKEN_COOKIE, token, {
    expires: 7, // align with refresh-token lifetime
    path: '/',
    sameSite: 'Lax',
    // Secure cookies are rejected on http://localhost
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  });
}

export function clearAccessTokenCookie() {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/' });
}

/** If localStorage has a token but the cookie is missing, restore it. */
export function syncAccessTokenCookieFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(ACCESS_TOKEN_COOKIE);
  if (!token) return null;
  if (!Cookies.get(ACCESS_TOKEN_COOKIE)) {
    persistAccessTokenCookie(token);
  }
  return token;
}
