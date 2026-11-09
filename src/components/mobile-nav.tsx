import { LayoutGrid } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { navItems } from "@/lib/data";

const mobileItems = navItems.slice(0, 4);

export function MobileNav() {
  return (
    <nav
      aria-label="Workspace"
      className="glass glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/60 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {mobileItems.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              aria-current={item.active ? "page" : undefined}
              className={
                item.active
                  ? "focus-ring flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-brand"
                  : "focus-ring flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted"
              }
            >
              <AppIcon name={item.icon} className="h-[19px] w-[19px]" />
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#apps"
            className="focus-ring flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted"
          >
            <LayoutGrid className="h-[19px] w-[19px]" strokeWidth={1.7} aria-hidden="true" />
            Apps
          </a>
        </li>
      </ul>
    </nav>
  );
}
