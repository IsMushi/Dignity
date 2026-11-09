"use client";

import Image from "next/image";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { useBusiness } from "@/components/business-provider";
import { navItems } from "@/lib/data";

export function AppRail() {
  const { business } = useBusiness();

  return (
    <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-white/50 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Image
          src="/brand/dignity-logo-transparent.png"
          alt="Dignity — Dignified works"
          width={2796}
          height={1015}
          priority
          className="h-10 w-auto"
        />
      </div>

      <nav
        aria-label="Workspace"
        className="scroll-thin mt-2 flex-1 overflow-y-auto px-3 pb-4"
      >
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          Workspace
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={
                  item.active
                    ? "focus-ring flex items-center gap-3 rounded-xl bg-brand px-3 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(9,65,151,0.95)]"
                    : "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink/75 transition hover:bg-white/65 hover:text-brand"
                }
              >
                <AppIcon name={item.icon} className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
                {item.active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
                ) : null}
              </a>
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-white/70" aria-hidden="true" />

        <a
          href="#apps"
          className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink/75 transition hover:bg-white/65 hover:text-brand"
        >
          <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
          <span>Apps</span>
          <span className="ml-auto rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            7
          </span>
        </a>

        <div className="mt-6 rounded-2xl border border-white/70 bg-white/45 p-3.5">
          <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Workspace connected
          </p>
          <p key={business.id} className="swap-in mt-2 text-[12px] leading-relaxed text-muted">
            {business.name} is synced. Sales, stock and credit are up to date.
          </p>
        </div>
      </nav>

      <div className="border-t border-white/60 p-3">
        <button
          type="button"
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/60"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-[#3b82f6] text-[11px] font-semibold text-white">
            AM
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              Alex Morgan
            </span>
            <span className="block text-[11px] text-muted">Owner</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

