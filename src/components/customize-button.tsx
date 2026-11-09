"use client";

import { Check, PanelLeft, PanelTop, SlidersHorizontal, X } from "lucide-react";
import {
  useLayout,
  type LayoutMode,
} from "@/components/layout/layout-provider";
import { useGlass } from "@/components/layout/glass-provider";
import { GLASS_PRESETS, glassLevelLabel } from "@/lib/appearance";
import { useDismissableMenu } from "@/lib/use-dismissable-menu";

export function CustomizeButton() {
  const { layout, setLayout } = useLayout();
  const { glassLevel, setGlassLevel } = useGlass();
  const glassLabel = glassLevelLabel(glassLevel);
  const {
    open,
    shown,
    close: closeMenu,
    toggle: toggleMenu,
    containerRef,
  } = useDismissableMenu();

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggleMenu}
        className="glass focus-ring inline-flex items-center gap-2 rounded-full border border-white/80 px-4 py-2.5 text-[13px] font-semibold text-ink/80 transition hover:bg-white/30"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Customize
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Customize layout"
          className={`scroll-thin glass-panel absolute left-0 top-full z-50 mt-2 max-h-[calc(100dvh-7rem)] w-[min(340px,calc(100vw-2rem))] origin-top-left overflow-y-auto rounded-2xl p-4 transition duration-150 ease-out sm:left-auto sm:right-0 sm:origin-top-right ${
            shown
              ? "scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-ink">Customize</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Choose where navigation lives.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close customize panel"
              onClick={closeMenu}
              className="focus-ring grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-line/60 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Layout
          </p>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <LayoutOption
              mode="topbar"
              current={layout}
              onSelect={setLayout}
              label="Top bar"
              description="Wide canvas"
            >
              <span className="absolute inset-x-1.5 top-1.5 h-2.5 rounded-[3px] bg-white shadow-sm" />
              <span className="absolute inset-x-2.5 top-6 h-1 rounded-full bg-[#c9dcf1]" />
              <span className="absolute inset-x-2.5 top-8 h-1 w-2/3 rounded-full bg-[#dbe8f6]" />
            </LayoutOption>

            <LayoutOption
              mode="sidebar"
              current={layout}
              onSelect={setLayout}
              label="Sidebar"
              description="Rail + content"
            >
              <span className="absolute inset-y-1.5 left-1.5 w-3.5 rounded-[3px] bg-white shadow-sm" />
              <span className="absolute left-6 right-2.5 top-2 h-1 rounded-full bg-[#c9dcf1]" />
              <span className="absolute left-6 right-2.5 top-4 h-1 w-2/3 rounded-full bg-[#dbe8f6]" />
              <span className="absolute left-6 right-2.5 top-6 h-1 w-1/2 rounded-full bg-[#dbe8f6]" />
            </LayoutOption>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Glass level
            </p>
            <span className="text-[10.5px] font-semibold text-ink/70">
              {glassLabel} · {glassLevel}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={glassLevel}
            onChange={(event) => setGlassLevel(Number(event.target.value))}
            aria-label="Glass level"
            aria-valuetext={`${glassLabel}, ${glassLevel} percent`}
            className="glass-range mt-2"
          />

          <div className="mt-1 flex justify-between text-[9.5px]">
            {GLASS_PRESETS.map((preset) => {
              const active = glassLevel === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setGlassLevel(preset.value)}
                  className={
                    active
                      ? "focus-ring rounded px-1 py-0.5 font-semibold text-brand"
                      : "focus-ring rounded px-1 py-0.5 text-muted transition hover:text-ink"
                  }
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[10.5px] text-muted">
            Saved on this device.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function LayoutOption({
  mode,
  current,
  onSelect,
  label,
  description,
  children,
}: {
  mode: LayoutMode;
  current: LayoutMode;
  onSelect: (mode: LayoutMode) => void;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  const active = current === mode;
  const Icon = mode === "topbar" ? PanelTop : PanelLeft;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(mode)}
      className={
        active
          ? "focus-ring rounded-xl border border-brand bg-brand/[0.04] p-2 text-left ring-1 ring-brand/20"
          : "focus-ring rounded-xl border border-line bg-white/60 p-2 text-left transition hover:border-brand/30"
      }
    >
      <span className="relative block h-[46px] overflow-hidden rounded-md border border-line bg-[#eef5fd]">
        {children}
        {active ? (
          <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-white">
            <Check className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>
      <span className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-ink">
        <Icon className="h-3.5 w-3.5 text-brand/70" aria-hidden="true" />
        {label}
      </span>
      <span className="block text-[10px] text-muted">{description}</span>
    </button>
  );
}
