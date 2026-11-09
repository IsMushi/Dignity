"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_GLASS_LEVEL,
  GLASS_COOKIE,
  GLASS_STORAGE_KEY,
  clampGlassLevel,
  parseGlassLevel,
} from "@/lib/appearance";
import { persistPreference, readCookie } from "@/lib/preferences";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): number {
  try {
    const stored = parseGlassLevel(
      window.localStorage.getItem(GLASS_STORAGE_KEY),
    );
    if (stored !== null) return stored;
  } catch {
    // Fall through to the cookie set for the server render.
  }

  const storedCookie = readCookie(GLASS_COOKIE);

  return parseGlassLevel(storedCookie) ?? DEFAULT_GLASS_LEVEL;
}

type GlassContextValue = {
  glassLevel: number;
  setGlassLevel: (level: number) => void;
};

const GlassContext = createContext<GlassContextValue | null>(null);

export function GlassProvider({
  children,
  initialGlassLevel = DEFAULT_GLASS_LEVEL,
}: {
  children: React.ReactNode;
  initialGlassLevel?: number;
}) {
  const initial = clampGlassLevel(initialGlassLevel);
  const getServerSnapshot = useCallback(() => initial, [initial]);
  const glassLevel = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setGlassLevel = useCallback((next: number) => {
    const value = clampGlassLevel(next);
    persistPreference(GLASS_STORAGE_KEY, GLASS_COOKIE, String(value));
    listeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass-level", String(glassLevel));
    root.dataset.glass = glassLevel === 0 ? "solid" : "on";
  }, [glassLevel]);

  const value = useMemo(
    () => ({ glassLevel, setGlassLevel }),
    [glassLevel, setGlassLevel],
  );

  return (
    <GlassContext.Provider value={value}>{children}</GlassContext.Provider>
  );
}

export function useGlass() {
  const context = useContext(GlassContext);
  if (!context) {
    throw new Error("useGlass must be used inside a GlassProvider");
  }
  return context;
}
