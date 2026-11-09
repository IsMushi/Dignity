"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  LAYOUT_COOKIE,
  LAYOUT_STORAGE_KEY,
  persistPreference,
  readCookie,
} from "@/lib/preferences";

export type LayoutMode = "topbar" | "sidebar";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): LayoutMode {
  try {
    const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (stored === "sidebar" || stored === "topbar") return stored;
  } catch {
    // Fall through to the cookie set for the server render.
  }

  return readCookie(LAYOUT_COOKIE) === "sidebar" ? "sidebar" : "topbar";
}

type LayoutContextValue = {
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({
  children,
  initialLayout = "topbar",
}: {
  children: React.ReactNode;
  initialLayout?: LayoutMode;
}) {
  const getServerSnapshot = useCallback(() => initialLayout, [initialLayout]);
  const layout = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setLayout = useCallback((mode: LayoutMode) => {
    persistPreference(LAYOUT_STORAGE_KEY, LAYOUT_COOKIE, mode);
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(() => ({ layout, setLayout }), [layout, setLayout]);

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used inside a LayoutProvider");
  }
  return context;
}
