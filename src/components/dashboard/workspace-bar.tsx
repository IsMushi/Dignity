"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { BusinessSwitcher } from "@/components/business-switcher";
import { useBusiness } from "@/components/business-provider";
import { useLayout } from "@/components/layout/layout-provider";
import { WorkspaceConnected } from "@/components/workspace-connected";

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
        className="chip focus-ring px-2.5 py-1.5 text-[12px]"
      >
        <MapPin className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        <span key={business.branch} className="swap-in font-medium text-ink/80">
          {business.branch}
        </span>
        <ChevronDown className="h-3 w-3 text-muted" aria-hidden="true" />
      </button>

      <WorkspaceConnected className="ml-auto" />
    </div>
  );
}
