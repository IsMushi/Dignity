"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { BusinessSwitcher } from "@/components/business-switcher";
import { useBusiness } from "@/components/business-provider";
import { useLayout } from "@/components/layout/layout-provider";

export function WorkspaceBar() {
  const { layout } = useLayout();
  const { business } = useBusiness();

  return (
    <div
      data-workspace-bar
      className={`mt-4 flex flex-wrap items-center gap-2 ${
        layout === "sidebar" ? "lg:hidden" : ""
      }`}
    >
      <BusinessSwitcher variant="chip" />

      <span className="px-0.5 text-[12px] text-muted/50" aria-hidden="true">
        /
      </span>

      <button
        type="button"
        className="chip focus-ring px-2.5 py-1.5 text-[12px] hover:bg-white/85"
      >
        <MapPin className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        <span key={business.branch} className="swap-in font-medium text-ink/80">
          {business.branch}
        </span>
        <ChevronDown className="h-3 w-3 text-muted" aria-hidden="true" />
      </button>

      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Workspace connected
      </span>
    </div>
  );
}
