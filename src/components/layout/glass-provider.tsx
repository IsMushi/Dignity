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
import { createPreferenceStore } from "@/lib/preferences";

const glassStore = createPreferenceStore({
  storageKey: GLASS_STORAGE_KEY,
  cookieName: GLASS_COOKIE,
  parse: parseGlassLevel,
  fallback: DEFAULT_GLASS_LEVEL,
});

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
    glassStore.subscribe,
    glassStore.getSnapshot,
    getServerSnapshot,
  );

  const setGlassLevel = useCallback((next: number) => {
    glassStore.set(clampGlassLevel(next));
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
