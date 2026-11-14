import type { Metadata } from "next";
import { LiquidGlassLab } from "./liquid-glass-lab";

export const metadata: Metadata = {
  title: "Glass lab · Dignity",
  description:
    "Side-by-side comparison of backdrop-filter and filter with the same feDisplacementMap.",
  robots: { index: false, follow: false },
};

export default function LiquidGlassTestPage() {
  return <LiquidGlassLab />;
}
