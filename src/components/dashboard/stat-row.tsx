import { Boxes, Receipt, type LucideIcon } from "lucide-react";
import { formatCount, totals } from "@/lib/data";
import { QuickActions } from "./quick-actions";

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <section className={`card-soft relative p-5 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[12.5px] font-medium text-ink/75">{label}</h2>
        <span className="grid h-7 w-7 place-items-center rounded-lg border edge-strong glass-control text-brand/70">
          <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>
      <p className="num mt-5 text-[30px] font-semibold leading-none text-ink">
        {value}
      </p>
    </section>
  );
}

export function StatRow() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-12">
      <StatCard
        className="xl:col-span-3"
        label="Transactions"
        value={formatCount(totals.transactions)}
        icon={Receipt}
      />
      <StatCard
        className="xl:col-span-3"
        label="Low-stock products"
        value={formatCount(totals.lowStock)}
        icon={Boxes}
      />
      <div className="col-span-2 xl:col-span-6">
        <QuickActions />
      </div>
    </div>
  );
}
