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
  cookieValue: string = value,
) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // The value still persists in the cookie.
  }

  try {
    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
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
 * The preference providers all need the same external-store shape: read
 * `localStorage` first, fall back to the server-set cookie, notify every
 * mounted provider when the value changes. One factory keeps that behaviour
 * (and the `storage` event wiring) in one place.
 *
 * `useSyncExternalStore` compares snapshots with `Object.is`, so a parser
 * that builds a fresh object every read would loop forever. The parsed value
 * is cached against the raw stored strings, which changes only when a
 * preference is saved or another tab writes one.
 */
export function createPreferenceStore<T>({
  storageKey,
  cookieName,
  parse,
  fallback,
  serialize = String,
  serializeCookie = serialize,
}: {
  storageKey: string;
  cookieName: string;
  parse: (value: string | null | undefined) => T | null;
  fallback: T;
  serialize?: (value: T) => string;
  /** Keeps oversized values (e.g. a background image) out of the cookie. */
  serializeCookie?: (value: T) => string;
}): PreferenceStore<T> {
  const listeners = new Set<() => void>();
  let cachedKey: string | null = null;
  let cachedValue: T = fallback;

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    window.addEventListener("storage", callback);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", callback);
    };
  };

  const readKey = () => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(storageKey);
    } catch {
      // Fall through to the cookie set for the server render.
    }

    const cookie = readCookie(cookieName);
    return {
      key: `${stored ?? "\u0000"}|${cookie ?? "\u0000"}`,
      stored,
      cookie,
    };
  };

  const getSnapshot = (): T => {
    const { key, stored, cookie } = readKey();
    if (key === cachedKey) return cachedValue;

    cachedKey = key;
    cachedValue = parse(stored) ?? parse(cookie) ?? fallback;
    return cachedValue;
  };

  const set = (value: T) => {
    persistPreference(
      storageKey,
      cookieName,
      serialize(value),
      serializeCookie(value),
    );

    /*
      Trust the value we just wrote. If storage is full or disabled, the
      reads below still see the old strings; caching the new value under that
      key keeps the change applied for the session instead of snapping back.
    */
    cachedKey = readKey().key;
    cachedValue = value;
    listeners.forEach((listener) => listener());
  };

  return { subscribe, getSnapshot, set };
}
