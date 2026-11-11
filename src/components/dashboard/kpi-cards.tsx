import { ArrowUpRight, CreditCard, TrendingUp } from "lucide-react";
import { formatRwf, totals, workspace } from "@/lib/data";
import { CoinStack } from "./coin-stack";
import { CreditArt } from "./credit-art";

export function KpiCards() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="relative min-h-[220px] overflow-hidden rounded-[24px] p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="kpi-art pointer-events-none absolute -right-2 bottom-3 top-0 hidden w-[48%] sm:block"
        >
          <CoinStack />
        </div>

        <div
          aria-hidden="true"
          className="card-kpi card-kpi-sales absolute inset-0 z-[2]"
        />

        <div className="relative z-10 max-w-[62%] sm:max-w-[58%]">
          <div className="flex flex-wrap items-center gap-2">
            <TrendingUp className="h-4 w-4 text-ink/55" strokeWidth={1.8} aria-hidden="true" />
            <h2 className="text-[12.5px] font-medium text-ink/75">Net sales</h2>
            <span className="rounded-full border border-white/80 bg-white/55 px-2 py-0.5 text-[9.5px] font-semibold text-muted">
              {workspace.period}
            </span>
          </div>

          <p className="mt-6 flex items-baseline gap-2">
            <span className="num text-[32px] font-semibold leading-none text-ink sm:text-[38px]">
              {formatRwf(totals.netSales)}
            </span>
            <span className="text-[11.5px] font-semibold text-muted">RWF</span>
          </p>

          <div className="mt-6 flex gap-7 border-t border-white/70 pt-3">
            <div>
              <p className="text-[10.5px] text-muted">Gross sales</p>
              <p className="num mt-0.5 text-[11.5px] font-semibold text-ink/85">
                {formatRwf(totals.grossSales)} RWF
              </p>
            </div>
            <div>
              <p className="text-[10.5px] text-muted">Returns</p>
              <p className="num mt-0.5 text-[11.5px] font-semibold text-ink/85">
                {formatRwf(totals.returns)} RWF
              </p>
            </div>
          </div>
        </div>

        <a
          href="#"
          aria-label="Open net sales"
          className="focus-ring absolute bottom-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/85 bg-white/75 text-ink/65 shadow-sm transition hover:bg-white hover:text-brand"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>

      <section className="relative min-h-[220px] overflow-hidden rounded-[24px] p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="kpi-art pointer-events-none absolute right-4 bottom-7 top-0 hidden w-[50%] sm:block"
        >
          <CreditArt />
        </div>

        <div
          aria-hidden="true"
          className="card-kpi card-kpi-credit absolute inset-0 z-[2]"
        />

        <div className="relative z-10 max-w-[60%] sm:max-w-[56%]">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-ink/55" strokeWidth={1.8} aria-hidden="true" />
            <h2 className="text-[12.5px] font-medium text-ink/75">Customer credit</h2>
          </div>

          <p className="mt-6 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
            Outstanding
          </p>
          <p className="mt-1.5 flex items-baseline gap-2">
            <span className="num text-[28px] font-semibold leading-none text-ink sm:text-[32px]">
              {formatRwf(totals.creditOutstanding)}
            </span>
            <span className="text-[11px] font-semibold text-muted">RWF</span>
          </p>

          <a
            href="#"
            className="focus-ring mt-4 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
          >
            View credit
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        <span className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7fb2e5]" aria-hidden="true" />
          {workspace.period}
        </span>
      </section>
    </div>
  );
}
