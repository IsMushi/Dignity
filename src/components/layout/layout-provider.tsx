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
  createPreferenceStore,
} from "@/lib/preferences";

export type LayoutMode = "topbar" | "sidebar";

const layoutStore = createPreferenceStore<LayoutMode>({
  storageKey: LAYOUT_STORAGE_KEY,
  cookieName: LAYOUT_COOKIE,
  parse: (value) =>
    value === "sidebar" || value === "topbar" ? value : null,
  fallback: "topbar",
});

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
    layoutStore.subscribe,
    layoutStore.getSnapshot,
    getServerSnapshot,
  );

  const setLayout = useCallback((mode: LayoutMode) => {
    layoutStore.set(mode);
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
