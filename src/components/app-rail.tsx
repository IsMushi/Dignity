"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { useBusiness } from "@/components/business-provider";
import { businessApps, navItems, workspace } from "@/lib/data";
import { useLiquidNav } from "@/lib/use-liquid-nav";

export function AppRail() {
  const { business } = useBusiness();
  const { setList, active, moving, select } = useLiquidNav();

  return (
    <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r edge-soft lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/" aria-label="Dignity home" className="focus-ring rounded-lg">
          <Image
            src="/brand/dignity-logo-transparent.png"
            alt="Dignity — Dignified works"
            width={2796}
            height={1015}
            priority
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <nav
        aria-label="Workspace"
        className="scroll-thin mt-2 flex-1 overflow-y-auto px-3 pb-4"
      >
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          Workspace
        </p>
        <ul
          ref={setList}
          data-nav-moving={moving}
          style={{ "--nav-radius": "12px" } as React.CSSProperties}
          className="relative space-y-1"
        >
          <span className="nav-liquid" aria-hidden="true" />

          {navItems.map((item) => {
            const isActive = item.label === active;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  data-nav-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => select(item.href)}
                  className={
                    isActive
                      ? "focus-ring relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-brand"
                      : "focus-ring glass-hover relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink/75 transition hover:text-brand"
                  }
                >
                  <AppIcon name={item.icon} className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand/60" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-4 h-px bg-white/70" aria-hidden="true" />

        <Link
          href="/#apps"
          className="focus-ring glass-hover flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink/75 transition hover:text-brand"
        >
          <AppIcon name="apps" className="h-[18px] w-[18px]" />
          <span>Apps</span>
          <span className="ml-auto rounded-md glass-control px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            {businessApps.length}
          </span>
        </Link>

        {workspace.connected ? (
          <div className="mt-6 rounded-2xl border edge glass-control p-3.5">
            <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Workspace connected
            </p>
            <p key={business.id} className="swap-in mt-2 text-[12px] leading-relaxed text-muted">
              {business.name} is synced. Sales, stock and credit are up to date.
            </p>
          </div>
        ) : null}
      </nav>

      <div className="border-t edge-soft p-3">
        <button
          type="button"
          className="focus-ring glass-hover flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[11px] font-semibold text-[var(--color-on-brand)]">
            {workspace.user.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              {workspace.user.name}
            </span>
            <span className="block text-[11px] text-muted">
              {workspace.user.role}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
