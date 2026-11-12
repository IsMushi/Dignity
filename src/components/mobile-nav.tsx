"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { navItems } from "@/lib/data";
import { useLiquidNav } from "@/lib/use-liquid-nav";

const mobileItems = navItems.slice(0, 4);

export function MobileNav() {
  const { setList, active, moving, select } = useLiquidNav();

  return (
    <nav
      aria-label="Workspace"
      className="glass glass-bar fixed inset-x-0 bottom-0 z-40 border-t edge-soft pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul
        ref={setList}
        data-nav-moving={moving}
        style={{ "--nav-radius": "12px" } as React.CSSProperties}
        className="relative grid grid-cols-5"
      >
        <span className="nav-liquid" aria-hidden="true" />

        {mobileItems.map((item) => {
          const isActive = item.label === active;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                data-nav-active={isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={() => select(item.href)}
                className={
                  isActive
                    ? "focus-ring relative z-10 mx-1 my-1 flex flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold text-brand"
                    : "focus-ring relative z-10 mx-1 my-1 flex flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-medium text-muted"
                }
              >
                <AppIcon name={item.icon} className="h-[19px] w-[19px]" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/#apps"
            className="focus-ring flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted"
          >
            <LayoutGrid className="h-[19px] w-[19px]" strokeWidth={1.7} aria-hidden="true" />
            Apps
          </Link>
        </li>
      </ul>
    </nav>
  );
}
