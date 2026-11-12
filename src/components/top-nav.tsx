"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LayoutGrid, Search } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { navItems, workspace } from "@/lib/data";
import { useLiquidNav } from "@/lib/use-liquid-nav";

export function TopNav() {
  const { setList, active, moving, select } = useLiquidNav();

  return (
    <header className="sticky top-0 z-40 bg-transparent px-3 pb-2 pt-3 sm:px-4">
      <div className="glass glass-bar mx-auto flex h-16 max-w-[1440px] items-center gap-2 rounded-[22px] border edge px-3 sm:gap-3 sm:px-4">
        <Link
          href="/"
          aria-label="Dignity home"
          className="focus-ring flex shrink-0 items-center rounded-lg"
        >
          <Image
            src="/brand/dignity-logo-transparent.png"
            alt="Dignity — Dignified works"
            width={2796}
            height={1015}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav
          ref={setList}
          aria-label="Primary"
          data-nav-moving={moving}
          className="relative ml-2 hidden items-center gap-1 lg:flex"
        >
          <span className="nav-liquid" aria-hidden="true" />

          {navItems.map((item) => {
            const isActive = item.label === active;

            return (
              <Link
                key={item.label}
                href={item.href}
                data-nav-active={isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={() => select(item.href)}
                className={
                  isActive
                    ? "focus-ring relative z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-brand"
                    : "focus-ring glass-hover relative z-10 rounded-full px-3.5 py-2 text-[12.5px] font-medium text-ink/75 transition hover:text-brand"
                }
              >
                {isActive ? <AppIcon name={item.icon} className="h-4 w-4" /> : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/#apps"
            className="focus-ring glass-hover hidden items-center gap-2 rounded-full px-3 py-2 text-[12.5px] font-medium text-ink/75 transition hover:text-brand sm:inline-flex"
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
            Apps
          </Link>

          <span className="hidden h-6 w-px bg-ink/10 sm:block" aria-hidden="true" />

          <button
            type="button"
            aria-label="Search the workspace"
            className="focus-ring glass-control hidden items-center gap-2 rounded-full border edge px-2.5 py-1.5 text-muted transition sm:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="kbd" aria-hidden="true">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="focus-ring glass-control flex items-center gap-1 rounded-full border edge py-1 pl-1 pr-1.5 text-ink/70 transition"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[11px] font-semibold text-brand ring-1 ring-ink/10">
              {workspace.user.initials}
            </span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
