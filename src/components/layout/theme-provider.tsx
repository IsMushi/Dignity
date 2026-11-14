"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createPreferenceStore } from "@/lib/preferences";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  THEME_STORAGE_KEY,
  canvasMode,
  clampBorderStrength,
  normalizeHex,
  parseTheme,
  serializeTheme,
  serializeThemeCookie,
  themeIsDark,
  themeStyle,
  withBorderStrength,
  withColor,
  withPreset,
  withScene,
  type BackgroundSceneId,
  type Theme,
  type ThemePresetId,
} from "@/lib/theme";

const themeStore = createPreferenceStore<Theme>({
  storageKey: THEME_STORAGE_KEY,
  cookieName: THEME_COOKIE,
  parse: parseTheme,
  fallback: DEFAULT_THEME,
  serialize: serializeTheme,
  serializeCookie: serializeThemeCookie,
});

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyPreset: (id: ThemePresetId) => void;
  setColor: (
    key: "background" | "text" | "accent" | "border",
    value: string,
  ) => void;
  setBorderStrength: (value: number) => void;
  setImage: (image: string | null) => void;
  setScene: (scene: BackgroundSceneId | null) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const style = themeStyle(theme);

  for (const [property, value] of Object.entries(style)) {
    root.style.setProperty(property, value);
  }

  root.dataset.canvas = canvasMode(theme);
  root.dataset.canvasTone = themeIsDark(theme) ? "dark" : "light";
  root.style.colorScheme = themeIsDark(theme) ? "dark" : "light";
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const getServerSnapshot = useCallback(() => initialTheme, [initialTheme]);
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((next: Theme) => {
    themeStore.set(next);
  }, []);

  const applyPreset = useCallback((id: ThemePresetId) => {
    themeStore.set(withPreset(id));
  }, []);

  const setColor = useCallback(
    (
      key: "background" | "text" | "accent" | "border",
      value: string,
    ) => {
      if (!normalizeHex(value)) return;
      themeStore.set(withColor(themeStore.getSnapshot(), key, value));
    },
    [],
  );

  const setBorderStrength = useCallback((value: number) => {
    themeStore.set(
      withBorderStrength(themeStore.getSnapshot(), clampBorderStrength(value)),
    );
  }, []);

  const setImage = useCallback((image: string | null) => {
    const current = themeStore.getSnapshot();
    themeStore.set({
      ...current,
      preset: "custom",
      image,
      scene: image ? null : current.scene,
    });
  }, []);

  const setScene = useCallback((scene: BackgroundSceneId | null) => {
    themeStore.set(withScene(themeStore.getSnapshot(), scene));
  }, []);

  const resetTheme = useCallback(() => {
    themeStore.set(DEFAULT_THEME);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      applyPreset,
      setColor,
      setBorderStrength,
      setImage,
      setScene,
      resetTheme,
    }),
    [
      theme,
      setTheme,
      applyPreset,
      setColor,
      setBorderStrength,
      setImage,
      setScene,
      resetTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
