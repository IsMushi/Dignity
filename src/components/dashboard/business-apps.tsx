import { ArrowUpRight } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { businessApps } from "@/lib/data";

export function BusinessApps() {
  return (
    <section id="apps" className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">Business apps</h2>
        <a
          href="#"
          className="focus-ring glass-hover inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-semibold text-brand transition"
        >
          All apps
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {businessApps.map((app) => (
          <a
            key={app.label}
            href="#"
            className="card-soft card-hover focus-ring flex items-center gap-3 p-3.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border edge-strong glass-control text-brand">
              <AppIcon name={app.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[12px] font-semibold leading-tight text-ink/85">
              {app.label}
            </span>
            <ArrowUpRight
              className="ml-auto h-3.5 w-3.5 text-muted/60"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
