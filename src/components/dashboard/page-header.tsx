import { CalendarDays, ChevronDown, LayoutGrid, Plus } from "lucide-react";
import { CustomizeButton } from "@/components/customize-button";
import { workspace } from "@/lib/data";

export function PageHeader() {
  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[27px] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[31px]">
          Welcome back, {workspace.user.name.split(" ")[0]}.
        </h1>

        <div className="flex items-center gap-2">
          <CustomizeButton />
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_14px_28px_-16px_rgba(9,65,151,0.95)] transition hover:bg-[#0a4aa9]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New sale
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[12px] text-muted">
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-ink/70">Overview</span>
          <span className="text-muted/50" aria-hidden="true">
            ·
          </span>
          {workspace.date}
        </p>

        <button
          type="button"
          className="chip focus-ring px-2.5 py-1.5 text-[11.5px] hover:bg-white/85"
        >
          <CalendarDays className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          {workspace.period}
          <ChevronDown className="h-3 w-3 text-muted" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
