"use client";

import { AppRail } from "@/components/app-rail";
import { MobileNav } from "@/components/mobile-nav";
import { TopBar } from "@/components/top-bar";
import { TopNav } from "@/components/top-nav";
import { useLayout } from "./layout-provider";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { layout } = useLayout();

  if (layout === "sidebar") {
    return (
      <div className="min-h-dvh">
        <AppRail />

        <div className="lg:pl-[264px]">
          <TopBar />
          <main className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-2 sm:px-6 lg:px-8 lg:pb-16">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
