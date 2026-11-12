import { ArrowUpRight } from "lucide-react";
import { chartData, formatRwf, totals, workspace } from "@/lib/data";

const max = Math.max(...chartData.map((day) => day.value));
const gridLines = [20700, 10400, 0];

const summary = chartData
  .map((day) => `${day.date}: ${formatRwf(day.value)} RWF`)
  .join(", ");

export function SalesChart() {
  return (
    <section className="card-soft h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            Sales performance
            <span className="h-1.5 w-1.5 rounded-full bg-brand/60" aria-hidden="true" />
          </h2>
          <p className="mt-0.5 text-[11px] text-muted">
            Gross sales · {workspace.period} · {workspace.periodRange}
          </p>
        </div>
        <a
          href="#"
          className="focus-ring glass-hover inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-semibold text-brand transition"
        >
          Explore
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-4 flex items-baseline gap-2">
        <span className="num text-[26px] font-semibold leading-none text-ink">
          {formatRwf(totals.grossSales)}
        </span>
        <span className="text-[11px] font-semibold text-muted">RWF</span>
      </p>

      <div className="mt-6 pl-10 sm:pl-11">
        <div
          role="img"
          aria-label={`Bar chart of gross sales by day. ${summary}.`}
          className="relative h-[180px]"
        >
          {gridLines.map((line) => (
            <div
              key={line}
              className="absolute inset-x-0"
              style={{ bottom: `${(line / max) * 100}%` }}
            >
              <span className="num absolute -left-10 -translate-y-1/2 text-[9.5px] text-muted sm:-left-11">
                {line === 0 ? "0" : `${(line / 1000).toFixed(1)}K`}
              </span>
              <div
                className={
                  line === 0
                    ? "h-px w-full bg-line"
                    : "h-px w-full border-t border-dashed border-line"
                }
              />
            </div>
          ))}

          <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-3">
            {chartData.map((day, index) => {
              const height = (day.value / max) * 100;

              return (
                <div
                  key={day.date}
                  className="group relative flex h-full flex-1 items-end justify-center"
                >
                  {day.value > 0 ? (
                    <div
                      className="bar-grow relative w-full max-w-[46px] rounded-t-[8px] bg-brand/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-colors duration-200 group-hover:bg-brand"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${120 + index * 45}ms`,
                      }}
                    >
                      <span className="num pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-1 text-[10px] font-semibold text-[var(--theme-canvas)] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                        {formatRwf(day.value)} RWF
                      </span>
                    </div>
                  ) : (
                    <span
                      className="h-[3px] w-full max-w-[46px] rounded-full bg-ink/10"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex gap-1.5 sm:gap-3">
          {chartData.map((day) => (
            <span
              key={day.date}
              className="flex-1 whitespace-nowrap text-center text-[8.5px] text-muted sm:text-[9.5px]"
            >
              {day.date}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
