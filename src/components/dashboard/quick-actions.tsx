import { AppIcon } from "@/components/app-icon";
import { quickActions } from "@/lib/data";

export function QuickActions() {
  return (
    <section className="card-soft h-full p-5">
      <h2 className="text-[12.5px] font-medium text-ink/75">Quick actions</h2>
      <div className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="focus-ring glass-hover group flex flex-col items-center gap-2 rounded-xl px-2 py-2 transition"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border edge-strong glass-control text-brand shadow-[0_8px_18px_-14px_rgba(9,65,151,0.7)] transition">
              <AppIcon name={action.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[11px] font-medium text-ink/75">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
