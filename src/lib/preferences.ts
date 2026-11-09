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

type PreferenceStore<T> = {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => T;
  set: (value: T) => void;
};

/**
 * The three preference providers all need the same external-store shape:
 * read `localStorage` first, fall back to the server-set cookie, notify every
 * mounted provider when the value changes. One factory keeps that behaviour
 * (and the `storage` event wiring) in one place.
 */
export function createPreferenceStore<T>({
  storageKey,
  cookieName,
  parse,
  fallback,
}: {
  storageKey: string;
  cookieName: string;
  parse: (value: string | null | undefined) => T | null;
  fallback: T;
}): PreferenceStore<T> {
  const listeners = new Set<() => void>();

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    window.addEventListener("storage", callback);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", callback);
    };
  };

  const getSnapshot = (): T => {
    try {
      const stored = parse(window.localStorage.getItem(storageKey));
      if (stored !== null) return stored;
    } catch {
      // Fall through to the cookie set for the server render.
    }

    return parse(readCookie(cookieName)) ?? fallback;
  };

  const set = (value: T) => {
    persistPreference(storageKey, cookieName, String(value));
    listeners.forEach((listener) => listener());
  };

  return { subscribe, getSnapshot, set };
}
