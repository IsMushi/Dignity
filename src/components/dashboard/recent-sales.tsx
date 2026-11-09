import { ArrowUpRight, Check } from "lucide-react";
import { formatRwf, recentSales } from "@/lib/data";

export function RecentSales() {
  return (
    <section className="card-soft overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-[13px] font-semibold text-ink">Recent sales</h2>
        <a
          href="#"
          className="focus-ring inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-semibold text-brand transition hover:bg-white/70"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-y border-white/70 bg-white/35 text-[9.5px] uppercase tracking-[0.14em] text-muted">
              <th scope="col" className="px-5 py-2.5 font-semibold">
                Transaction
              </th>
              <th scope="col" className="px-5 py-2.5 font-semibold">
                Date
              </th>
              <th scope="col" className="px-5 py-2.5 font-semibold">
                Team member
              </th>
              <th scope="col" className="px-5 py-2.5 text-right font-semibold">
                Amount
              </th>
              <th scope="col" className="px-5 py-2.5 pr-5 font-semibold">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {recentSales.map((sale) => (
              <tr key={sale.id} className="transition-colors hover:bg-white/45">
                <td className="whitespace-nowrap px-5 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md border border-white/80 bg-white/60 text-brand/60">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11.5px] tracking-tight text-ink/70">
                      {sale.id}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-[11.5px] text-muted">
                  {sale.date}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-[11.5px] text-ink/85">
                  {sale.member}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right">
                  <span className="num text-[12px] font-semibold text-ink">
                    {formatRwf(sale.amount)}
                  </span>{" "}
                  <span className="text-[10px] font-medium text-muted">RWF</span>
                </td>
                <td className="px-5 py-3 pr-5">
                  <span className="text-[11.5px] font-semibold text-brand">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
