import Image from "next/image";
import { ChevronDown, LayoutGrid, Search } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { navItems, workspace } from "@/lib/data";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#d8ecfd]/80 via-[#d8ecfd]/40 to-transparent px-3 pb-2 pt-3 sm:px-4">
      <div className="glass glass-bar mx-auto flex h-16 max-w-[1440px] items-center gap-2 rounded-[22px] border border-white/70 px-3 shadow-[0_20px_44px_-34px_rgba(20,55,104,0.55)] sm:gap-3 sm:px-4">
        <a
          href="#"
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
        </a>

        <nav
          aria-label="Primary"
          className="ml-2 hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? "page" : undefined}
              className={
                item.active
                  ? "focus-ring inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-brand shadow-[0_10px_22px_-16px_rgba(9,65,151,0.9)] ring-1 ring-brand/15"
                  : "focus-ring rounded-full px-3.5 py-2 text-[12.5px] font-medium text-ink/75 transition hover:bg-white/70 hover:text-brand"
              }
            >
              {item.active ? (
                <AppIcon name={item.icon} className="h-4 w-4" />
              ) : null}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <a
            href="#apps"
            className="focus-ring hidden items-center gap-2 rounded-full px-3 py-2 text-[12.5px] font-medium text-ink/75 transition hover:bg-white/70 hover:text-brand sm:inline-flex"
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
            Apps
          </a>

          <span className="hidden h-6 w-px bg-ink/10 sm:block" aria-hidden="true" />

          <button
            type="button"
            aria-label="Search the workspace"
            className="focus-ring hidden items-center gap-2 rounded-full border border-white/80 bg-white/55 px-2.5 py-1.5 text-muted transition hover:bg-white/85 sm:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="kbd" aria-hidden="true">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="focus-ring flex items-center gap-1 rounded-full border border-white/80 bg-white/70 py-1 pl-1 pr-1.5 text-ink/70 transition hover:bg-white"
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

