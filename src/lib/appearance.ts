export const GLASS_COOKIE = "dignity_glass";
export const GLASS_STORAGE_KEY = "dignity_glass";
export const DEFAULT_GLASS_LEVEL = 55;

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

export function glassLevelLabel(level: number) {
  const value = clampGlassLevel(level);
  if (value < 17) return "Solid";
  if (value < 50) return "Soft";
  if (value < 85) return "Balanced";
  return "Liquid";
}
