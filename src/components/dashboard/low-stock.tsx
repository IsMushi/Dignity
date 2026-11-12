import { ArrowUpRight, Package } from "lucide-react";
import { lowStock } from "@/lib/data";

export function LowStock() {
  return (
    <section className="card-soft flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">Low stock</h2>
        <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-copper/10 px-1.5 text-[10.5px] font-bold text-copper">
          {lowStock.length}
        </span>
      </div>

      <ul className="mt-3 flex-1 divide-y divide-white/60">
        {lowStock.map((item) => (
          <li key={item.name} className="flex items-center gap-3 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border edge-strong bg-[#f6ead9]/70 text-copper">
              <Package className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold text-ink">
                {item.name}
              </span>
              <span className="block text-[10.5px] text-muted">
                {item.remaining} units remaining
              </span>
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="focus-ring mt-2 inline-flex items-center gap-1 border-t edge-soft pt-3 text-[11.5px] font-semibold text-brand hover:underline"
      >
        View stock
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
