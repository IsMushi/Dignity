"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type LayoutMode = "topbar" | "sidebar";

const STORAGE_KEY = "dignity:layout";
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
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "sidebar" || stored === "topbar") return stored;
  } catch {
    // Fall through to the cookie set for the server render.
  }

  return document.cookie
    .split("; ")
    .includes(`${STORAGE_KEY}=sidebar`)
    ? "sidebar"
    : "topbar";
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
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
      document.cookie = `${STORAGE_KEY}=${mode}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // The preference still applies for this session.
    }
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
