import type { Metadata } from "next";
import { AppearanceScreen } from "@/components/appearance/appearance-screen";
import { LayoutShell } from "@/components/layout/layout-shell";

export const metadata: Metadata = {
  title: "Appearance · Dignity",
  description:
    "Customize the Dignity canvas, text and accent colours, and the glass level.",
};

export default function AppearancePage() {
  return (
    <LayoutShell>
      <AppearanceScreen />

      <footer className="mx-auto mt-8 flex w-full max-w-[1120px] items-center justify-between border-t edge-soft pt-4 text-[11px] text-muted">
        <span>Dignity</span>
        <span>Saved on this device</span>
      </footer>
    </LayoutShell>
  );
}
