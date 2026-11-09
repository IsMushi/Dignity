/**
 * Names and helpers for the preferences that are persisted in both
 * `localStorage` (client) and a cookie (so the server can render the same
 * state on first paint). Keeping the names here stops the cookie from being
 * re-typed in `page.tsx` and drifting away from the provider.
 */

export const LAYOUT_STORAGE_KEY = "dignity:layout";
export const LAYOUT_COOKIE = LAYOUT_STORAGE_KEY;
export const BUSINESS_STORAGE_KEY = "dignity:business";
export const BUSINESS_COOKIE = BUSINESS_STORAGE_KEY;

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function readCookie(name: string) {
  const prefix = `${name}=`;
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

export function persistPreference(
  storageKey: string,
  cookieName: string,
  value: string,
) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // The value still persists in the cookie.
  }

  try {
    document.cookie = `${cookieName}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    // The value still applies for this session.
  }
}
