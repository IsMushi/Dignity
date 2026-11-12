import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import {
  DEFAULT_GLASS_LEVEL,
  GLASS_COOKIE,
  isLiquidGlass,
  parseGlassLevel,
} from "@/lib/appearance";
import { GlassLens } from "@/components/layout/glass-lens";
import { AppProviders } from "@/components/app-providers";
import type { LayoutMode } from "@/components/layout/layout-provider";
import { defaultBusinessId, isBusinessId } from "@/lib/data";
import { BUSINESS_COOKIE, LAYOUT_COOKIE } from "@/lib/preferences";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  canvasMode,
  parseTheme,
  themeIsDark,
  themeStyle,
} from "@/lib/theme";
import "./globals.css";

const googleSans = localFont({
  src: "../fonts/google-sans-latin.woff2",
  variable: "--font-google-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const googleSansCode = localFont({
  src: "../fonts/google-sans-code-latin.woff2",
  variable: "--font-google-sans-code",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["ui-monospace", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  title: "Overview · Dignity",
  description: "Sales, stock and finances for Rwandan businesses.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const glassLevel =
    parseGlassLevel(cookieStore.get(GLASS_COOKIE)?.value) ??
    DEFAULT_GLASS_LEVEL;
  const theme =
    parseTheme(cookieStore.get(THEME_COOKIE)?.value) ?? DEFAULT_THEME;
  const initialLayout: LayoutMode =
    cookieStore.get(LAYOUT_COOKIE)?.value === "sidebar" ? "sidebar" : "topbar";
  const businessCookie = cookieStore.get(BUSINESS_COOKIE)?.value;
  const initialBusinessId = isBusinessId(businessCookie)
    ? businessCookie
    : defaultBusinessId;
  const glassStyle = {
    "--glass-level": glassLevel,
    ...themeStyle(theme),
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      data-glass={glassLevel === 0 ? "solid" : "on"}
      data-glass-liquid={isLiquidGlass(glassLevel) ? "true" : "false"}
      data-canvas={canvasMode(theme)}
      data-canvas-tone={themeIsDark(theme) ? "dark" : "light"}
      style={glassStyle}
      className={`${googleSans.variable} ${googleSansCode.variable}`}
    >
      <body>
        <div aria-hidden="true" className="page-canvas">
          <div className="liquid-wash">
            <span className="liquid-band liquid-band-brand" />
            <span className="liquid-band liquid-band-copper" />
            <span className="liquid-band liquid-band-teal" />
          </div>
        </div>
        <GlassLens />
        <AppProviders
          initialGlassLevel={glassLevel}
          initialBusinessId={initialBusinessId}
          initialLayout={initialLayout}
          initialTheme={theme}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
