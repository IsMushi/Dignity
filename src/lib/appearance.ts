export const GLASS_COOKIE = "dignity_glass";
export const GLASS_STORAGE_KEY = "dignity_glass";
export const DEFAULT_GLASS_LEVEL = 100;
export const LIQUID_GLASS_MIN = 85;

export const GLASS_PRESETS = [
  { label: "Solid", value: 0 },
  { label: "Soft", value: 33 },
  { label: "Balanced", value: 66 },
  { label: "Liquid", value: 100 },
] as const;

export function clampGlassLevel(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_GLASS_LEVEL;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function parseGlassLevel(
  value: string | null | undefined,
): number | null {
  if (value == null) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? clampGlassLevel(parsed) : null;
}

/**
 * Matches the documented ranges in the README: Solid is exactly 0; anything
 * above it still applies glass, so 1–49 is Soft rather than Solid.
 */
export function isLiquidGlass(level: number) {
  return clampGlassLevel(level) >= LIQUID_GLASS_MIN;
}

export function glassLevelLabel(level: number) {
  const value = clampGlassLevel(level);
  if (value === 0) return "Solid";
  if (value < 50) return "Soft";
  if (value < LIQUID_GLASS_MIN) return "Balanced";
  return "Liquid";
}
