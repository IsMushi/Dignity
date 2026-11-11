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
  const glassStyle = { "--glass-level": glassLevel } as React.CSSProperties;

  return (
    <html
      lang="en"
      data-glass={glassLevel === 0 ? "solid" : "on"}
      data-glass-liquid={isLiquidGlass(glassLevel) ? "true" : "false"}
      style={glassStyle}
      className={`${googleSans.variable} ${googleSansCode.variable}`}
    >
      <body>
        <div
          aria-hidden="true"
          className="ambient-field pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="ambient-blob absolute -left-44 -top-56 h-[560px] w-[560px] rounded-full bg-sky-200 opacity-50 blur-[90px]" />
          <div className="ambient-blob absolute -top-40 right-[-8%] h-[520px] w-[520px] rounded-full bg-sky-100 opacity-70 blur-[80px]" />
          <div className="ambient-blob absolute left-[26%] top-[4%] h-[420px] w-[620px] rounded-full bg-sky-200 opacity-40 blur-[100px]" />
          <div className="ambient-blob absolute bottom-[-22%] left-[28%] h-[420px] w-[640px] rounded-full bg-sky-100 opacity-40 blur-[100px]" />
          <div className="liquid-wash absolute inset-0 overflow-hidden">
            <div className="liquid-band liquid-band-brand" />
            <div className="liquid-band liquid-band-copper" />
            <div className="liquid-band liquid-band-teal" />
          </div>
        </div>
        <GlassLens />
        {children}
      </body>
    </html>
  );
}
