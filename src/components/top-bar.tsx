import Image from "next/image";
import { Bell, Search } from "lucide-react";
import { BusinessBranch, BusinessSwitcher } from "@/components/business-switcher";
import { WorkspaceConnected } from "@/components/workspace-connected";
import { workspace } from "@/lib/data";

export function TopBar() {
  return (
    <header className="glass glass-bar sticky top-0 z-30 border-b border-white/50">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <Image
            src="/brand/dignity-logo-transparent.png"
            alt="Dignity — Dignified works"
            width={2796}
            height={1015}
            priority
            className="h-9 w-auto"
          />
        </div>

        <BusinessSwitcher variant="bar" />

        <span className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />

        <BusinessBranch className="hidden items-center gap-1.5 px-2 py-1 text-[12px] text-muted md:flex" />

        <WorkspaceConnected className="hidden xl:inline-flex" />

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="focus-ring hidden items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[13px] text-muted transition hover:bg-white/85 md:flex"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search</span>
            <span className="kbd" aria-hidden="true">
              ⌘K
            </span>
            <span className="sr-only">Search the workspace</span>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="focus-ring relative grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/55 text-ink/70 transition hover:bg-white/85"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-copper" />
          </button>

          <button
            type="button"
            aria-label="Account menu"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-[#3b82f6] text-[11px] font-semibold text-white"
          >
            {workspace.user.initials}
          </button>
        </div>
      </div>
    </header>
  );
}

