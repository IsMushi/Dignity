"use client";

import { useEffect, useRef } from "react";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  GitBranch,
} from "lucide-react";
import { useBusiness } from "@/components/business-provider";
import { businesses, type BusinessId } from "@/lib/data";
import { useDismissableMenu } from "@/lib/use-dismissable-menu";

type Variant = "bar" | "chip";

export function BusinessSwitcher({ variant }: { variant: Variant }) {
  const { business, businessId, setBusiness } = useBusiness();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    open,
    shown,
    close: closeMenu,
    toggle: toggleMenu,
    containerRef,
  } = useDismissableMenu({
    onEscape: () => triggerRef.current?.focus(),
  });

  useEffect(() => {
    if (!open || !shown) return;
    const selected = menuRef.current?.querySelector<HTMLElement>(
      '[role="menuitemradio"][aria-checked="true"]',
    );
    selected?.focus();
  }, [open, shown]);

  const select = (id: BusinessId) => {
    setBusiness(id);
    closeMenu();
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitemradio"]',
      ) ?? [],
    );
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    items[next]?.focus();
  };

  const triggerClass =
    variant === "bar"
      ? "focus-ring ml-1 hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-left transition hover:bg-white/60 sm:flex"
      : "chip focus-ring px-2.5 py-1.5 text-[12px] hover:bg-white/85";

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Select business, current: ${business.name}`}
        onClick={toggleMenu}
        className={triggerClass}
      >
        <span
          key={business.initials}
          className={`swap-in ${
            variant === "bar"
              ? "grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-[10.5px] font-bold text-brand"
              : "grid h-5 w-5 place-items-center rounded-md bg-brand/10 text-[9.5px] font-bold text-brand"
          }`}
        >
          {business.initials}
        </span>
        <span
          key={business.name}
          className={`swap-in ${
            variant === "bar"
              ? "text-[13px] font-semibold text-ink"
              : "font-semibold text-ink"
          }`}
        >
          {business.name}
        </span>
        <span
          className={
            variant === "bar"
              ? "text-[13px] text-muted"
              : "font-medium text-muted"
          }
        >
          · {business.kind}
        </span>
        {variant === "bar" ? (
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ease-out ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        ) : (
          <ChevronsUpDown
            className={`h-3 w-3 text-muted transition-transform duration-200 ease-out ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        )}
      </button>

      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Select business"
          onKeyDown={onMenuKeyDown}
          className={`glass-panel absolute left-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-2rem))] origin-top-left rounded-2xl p-2 transition duration-150 ease-out ${
            shown
              ? "scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
          }`}
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Businesses
          </p>

          {businesses.map((entry) => {
            const active = entry.id === businessId;
            return (
              <button
                key={entry.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => select(entry.id)}
                className={
                  active
                    ? "focus-ring flex w-full items-center gap-2.5 rounded-xl bg-brand/[0.06] px-2.5 py-2 text-left"
                    : "focus-ring flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-white/60"
                }
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-[10.5px] font-bold text-brand">
                  {entry.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-ink">
                    {entry.name}
                  </span>
                  <span className="block truncate text-[10.5px] text-muted">
                    {entry.branch} · {entry.kind}
                  </span>
                </span>
                {active ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}

          <p className="mt-1 border-t border-line/80 px-2.5 pb-1 pt-2 text-[10px] text-muted">
            Sample businesses for this demo.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function BusinessBranch({ className }: { className?: string }) {
  const { business } = useBusiness();

  return (
    <span className={className}>
      <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
      <span key={business.branch} className="swap-in">
        {business.branch}
      </span>
    </span>
  );
}
