"use client";

import { useGlass } from "@/components/layout/glass-provider";
import { GLASS_PRESETS, glassLevelLabel } from "@/lib/appearance";

/**
 * Slider + preset buttons for the glass level. Used on the Appearance screen;
 * the Customize popover links there instead of carrying a second copy.
 */
export function GlassLevelControl({
  hint = true,
}: {
  hint?: boolean;
}) {
  const { glassLevel, setGlassLevel } = useGlass();
  const glassLabel = glassLevelLabel(glassLevel);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
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

      {hint ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Liquid is the full optical pane: stronger refraction, clearer tint,
          brighter rim. Lower levels frost the surfaces. Saved on this device.
        </p>
      ) : null}
    </div>
  );
}
