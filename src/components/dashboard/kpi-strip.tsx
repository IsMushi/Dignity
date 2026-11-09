import { ArrowUpRight, Boxes, ChevronDown, Receipt } from "lucide-react";
import { formatRwf, totals, workspace } from "@/lib/data";

const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.16em] text-muted";

export function KpiStrip() {
  return (
    <section className="glass mt-6 overflow-hidden rounded-[24px]">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-6">
        <p className={labelClass}>Performance</p>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/55 px-2.5 py-1 text-[11.5px] font-medium text-ink/75 transition hover:bg-white/85"
        >
          {workspace.period}
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-px bg-white/55 lg:grid-cols-4">
        <div className="bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <p className={labelClass}>Net sales</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="num text-[27px] font-semibold leading-none text-ink sm:text-[36px]">
              {formatRwf(totals.netSales)}
            </span>
            <span className="text-[11px] font-semibold text-muted">RWF</span>
          </p>
          <p className="mt-1.5 text-[11.5px] text-muted">All time</p>
        </div>

        <div className="bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <p className={labelClass}>Gross sales</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-semibold leading-none text-ink sm:text-[26px]">
              {formatRwf(totals.grossSales)}
            </span>
            <span className="text-[11px] font-semibold text-muted">RWF</span>
          </p>
          <p className="mt-1.5 text-[11.5px] text-muted">All time</p>
        </div>

        <div className="bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <p className={labelClass}>Returns</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-semibold leading-none text-ink sm:text-[26px]">
              {formatRwf(totals.returns)}
            </span>
            <span className="text-[11px] font-semibold text-muted">RWF</span>
          </p>
          <p className="mt-1.5 text-[11.5px] text-muted">All time</p>
        </div>

        <div className="bg-white/35 px-5 py-4 sm:px-6 sm:py-5">
          <p className="flex flex-wrap items-center gap-2">
            <span className={labelClass}>Customer credit</span>
            <span className="rounded-full bg-copper/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-copper">
              Outstanding
            </span>
          </p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-semibold leading-none text-copper sm:text-[26px]">
              {formatRwf(totals.creditOutstanding)}
            </span>
            <span className="text-[11px] font-semibold text-muted">RWF</span>
          </p>
          <a
            href="#"
            className="focus-ring mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
          >
            View credit
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/70 px-5 py-3 text-[12px] text-muted sm:px-6">
        <span className="inline-flex items-center gap-2">
          <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
          Transactions
          <b className="num font-semibold text-ink">{totals.transactions}</b>
        </span>
        <span className="inline-flex items-center gap-2">
          <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
          Low-stock products
          <b className="num font-semibold text-ink">{totals.lowStock}</b>
        </span>
        <span className="ml-auto hidden text-[11px] text-muted sm:block">
          Demo workspace · sample data
        </span>
      </div>
    </section>
  );
}
