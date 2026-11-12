/**
 * Appearance theme: the canvas, text and accent colours chosen on the
 * Appearance screen. The same helpers run on the server (first paint from the
 * cookie) and in the browser (live preview), so the palette maths lives here
 * instead of being duplicated in CSS and in a component.
 */

export const THEME_COOKIE = "dignity_theme";
export const THEME_STORAGE_KEY = "dignity_theme";

export type ThemePresetId = "sky" | "sand" | "mint" | "graphite";

export type Theme = {
  /** Preset currently applied, or "custom" once a colour is edited. */
  preset: ThemePresetId | "custom";
  /** Page canvas. Hex, always normalised to six digits. */
  background: string;
  /** Primary text on the canvas and glass panes. */
  text: string;
  /** Primary actions, links, active states. */
  accent: string;
  /** Rim colour for cards, chips, controls and dividers. */
  border: string;
  /** Border opacity, 0 (invisible) to 100 (the authored edge strength). */
  borderStrength: number;
  /** Sky keeps the built-in photo canvas. */
  photo: boolean;
  /** User-uploaded canvas image as a data URL (localStorage only). */
  image: string | null;
};

export const SKY_BACKGROUND = "#8ebfee";

export const DEFAULT_BORDER_STRENGTH = 100;

export const DEFAULT_THEME: Theme = {
  preset: "sky",
  background: SKY_BACKGROUND,
  text: "#143768",
  accent: "#094197",
  border: "#ffffff",
  borderStrength: DEFAULT_BORDER_STRENGTH,
  photo: true,
  image: null,
};

export const THEME_PRESETS: ReadonlyArray<{
  id: ThemePresetId;
  label: string;
  description: string;
  theme: Theme;
}> = [
  {
    id: "sky",
    label: "Sky",
    description: "The original sky canvas",
    theme: DEFAULT_THEME,
  },
  {
    id: "sand",
    label: "Sand",
    description: "Warm paper, copper accent",
    theme: {
      preset: "sand",
      background: "#f2e7d5",
      text: "#3d2f1d",
      accent: "#8f4f16",
      border: "#ffffff",
      borderStrength: DEFAULT_BORDER_STRENGTH,
      photo: false,
      image: null,
    },
  },
  {
    id: "mint",
    label: "Mint",
    description: "Cool green, deep teal accent",
    theme: {
      preset: "mint",
      background: "#dcefe4",
      text: "#123d2e",
      accent: "#0c6b50",
      border: "#ffffff",
      borderStrength: DEFAULT_BORDER_STRENGTH,
      photo: false,
      image: null,
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    description: "Quiet grey, slate accent",
    theme: {
      preset: "graphite",
      background: "#dfe5ec",
      text: "#1f2a37",
      accent: "#3b4a5f",
      border: "#ffffff",
      borderStrength: DEFAULT_BORDER_STRENGTH,
      photo: false,
      image: null,
    },
  },
];

export function themePreset(id: ThemePresetId): Theme {
  const preset = THEME_PRESETS.find((entry) => entry.id === id);
  return preset ? { ...preset.theme } : { ...DEFAULT_THEME };
}

export function isThemePresetId(value: unknown): value is ThemePresetId {
  return THEME_PRESETS.some((preset) => preset.id === value);
}

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Accepts `abc`, `#abc`, `aabbcc`, `#AABBCC`; returns `#aabbcc`. */
export function normalizeHex(value: string): string | null {
  const match = value.trim().match(HEX_PATTERN);
  if (!match) return null;

  const digits = match[1];
  const full =
    digits.length === 3
      ? digits
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : digits;

  return `#${full.toLowerCase()}`;
}

/** True when a string is a colour the pickers can apply. */
export function isHexColor(value: string) {
  return normalizeHex(value) !== null;
}

/** Keeps the border strength an integer inside 0–100. */
export function clampBorderStrength(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_BORDER_STRENGTH;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function isThemeImage(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 6_000_000 &&
    /^data:image\/(png|jpe?g|webp|avif|gif);base64,/i.test(value)
  );
}

export function serializeTheme(theme: Theme) {
  return JSON.stringify({
    p: theme.preset,
    b: theme.background,
    t: theme.text,
    a: theme.accent,
    r: theme.border,
    s: theme.borderStrength,
    i: theme.photo ? 1 : 0,
    ...(theme.image ? { m: theme.image } : {}),
  });
}

/**
 * The cookie is read during the server render and must stay under the 4 KB
 * cookie limit, so the uploaded image is deliberately left out. The client
 * store keeps it in localStorage and applies it after hydration.
 */
export function serializeThemeCookie(theme: Theme) {
  return JSON.stringify({
    p: theme.preset,
    b: theme.background,
    t: theme.text,
    a: theme.accent,
    r: theme.border,
    s: theme.borderStrength,
    i: theme.photo ? 1 : 0,
  });
}

export function parseTheme(value: string | null | undefined): Theme | null {
  if (value == null) return null;

  let data: unknown;
  try {
    data = JSON.parse(value);
  } catch {
    return null;
  }

  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;

  const background = normalizeHex(String(record.b ?? ""));
  const text = normalizeHex(String(record.t ?? ""));
  const accent = normalizeHex(String(record.a ?? ""));
  if (!background || !text || !accent) return null;

  /* Older cookies predate the border channel; keep them valid. */
  const border = normalizeHex(String(record.r ?? "")) ?? DEFAULT_THEME.border;
  const borderStrength =
    typeof record.s === "number"
      ? clampBorderStrength(record.s)
      : DEFAULT_BORDER_STRENGTH;

  return {
    preset: isThemePresetId(record.p) ? record.p : "custom",
    background,
    text,
    accent,
    border,
    borderStrength,
    photo: record.i === 1 || record.i === true,
    image: isThemeImage(record.m) ? record.m : null,
  };
}

export type CanvasMode = "image" | "photo" | "flat";

export function canvasMode(theme: Theme): CanvasMode {
  if (theme.image) return "image";
  return theme.photo ? "photo" : "flat";
}

export function withPreset(id: ThemePresetId): Theme {
  return themePreset(id);
}

/**
 * Editing the canvas means "no more photo or upload"; editing text, accent or
 * border keeps the current canvas, including the Sky photo and a custom image.
 */
export function withColor(
  theme: Theme,
  key: "background" | "text" | "accent" | "border",
  value: string,
): Theme {
  const normalized = normalizeHex(value) ?? theme[key];
  const image = key === "background" ? null : theme.image;

  const candidate: Theme = {
    ...theme,
    preset: "custom",
    background: key === "background" ? normalized : theme.background,
    text: key === "text" ? normalized : theme.text,
    accent: key === "accent" ? normalized : theme.accent,
    border: key === "border" ? normalized : theme.border,
    photo: key === "background" ? false : theme.photo,
    image,
  };

  return { ...candidate, preset: matchingPreset(candidate) ?? "custom" };
}

/** Border opacity is a theme channel, independent of the canvas image. */
export function withBorderStrength(theme: Theme, value: number): Theme {
  const candidate: Theme = {
    ...theme,
    preset: "custom",
    borderStrength: clampBorderStrength(value),
  };

  return { ...candidate, preset: matchingPreset(candidate) ?? "custom" };
}

function matchingPreset(theme: Theme) {
  const match = THEME_PRESETS.find(
    (entry) =>
      theme.image === null &&
      entry.theme.background === theme.background &&
      entry.theme.text === theme.text &&
      entry.theme.accent === theme.accent &&
      entry.theme.border === theme.border &&
      entry.theme.borderStrength === theme.borderStrength &&
      entry.theme.photo === theme.photo,
  );
  return match?.id ?? null;
}

export function isPresetActive(theme: Theme) {
  return matchingPreset(theme) === theme.preset;
}

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbTriplet(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "255 255 255";
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

function channelLuminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

/** WCAG contrast ratio between two opaque colours (1–21). */
export function contrastRatio(foreground: string, background: string) {
  const light = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const dark = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (light + 0.05) / (dark + 0.05);
}

export function canvasIsDark(background: string) {
  return (
    contrastRatio("#ffffff", background) >
    contrastRatio("#08111f", background)
  );
}

export function themeIsDark(theme: Theme) {
  return canvasIsDark(theme.background);
}

/** Dark or light ink chosen for text sitting on the accent colour. */
export function onBrandColor(accent: string) {
  return contrastRatio("#ffffff", accent) >= contrastRatio("#08111f", accent)
    ? "#ffffff"
    : "#08111f";
}

/** Hover shade for accent buttons: darker on light canvases, lighter on dark. */
export function brandDeepColor(accent: string, background: string) {
  const toward = canvasIsDark(background) ? "#ffffff" : "#000000";
  return mixHex(accent, toward, 0.82);
}

type Hsl = { h: number; s: number; l: number };

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l: lightness };

  const saturation =
    lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

  let hue: number;
  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return { h: hue * 60, s: saturation, l: lightness };
}

function hslToHex({ h, s, l }: Hsl) {
  const hue = ((h % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;
  if (hue < 60) [red, green] = [chroma, x];
  else if (hue < 120) [red, green] = [x, chroma];
  else if (hue < 180) [green, blue] = [chroma, x];
  else if (hue < 240) [green, blue] = [x, chroma];
  else if (hue < 300) [red, blue] = [x, chroma];
  else [red, blue] = [chroma, x];

  const hex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${hex(red)}${hex(green)}${hex(blue)}`;
}

/**
 * Rotates a colour around the hue wheel while keeping its saturation and
 * lightness. Used for categorical chart colours that should follow the
 * Appearance accent instead of a fixed brand palette.
 */
export function rotateHue(hex: string, degrees: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  return hslToHex({ ...hsl, h: hsl.h + degrees });
}

/** Linear sRGB mix, `weight` = share of `from` (0–1). */
export function mixHex(from: string, to: string, weight: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  if (!a || !b) return from;

  const clamped = Math.min(1, Math.max(0, weight));
  const mix = (x: number, y: number) =>
    Math.round(x * clamped + y * (1 - clamped));
  const hex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${hex(mix(a.r, b.r))}${hex(mix(a.g, b.g))}${hex(mix(a.b, b.b))}`;
}

export type ContrastRating = "AAA" | "AA" | "AA Large" | "Fail";

export function contrastRating(ratio: number): ContrastRating {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export function meetsTextContrast(ratio: number) {
  return ratio >= 4.5;
}

/**
 * Inline variables applied to `<html>`. The server uses the cookie value so
 * the first paint already has the saved palette; the provider re-applies the
 * same object whenever a control changes.
 */
export function themeStyle(theme: Theme): Record<string, string> {
  const dark = themeIsDark(theme);
  const surface = dark ? mixHex(theme.background, "#ffffff", 0.86) : "#ffffff";
  const surfaceSoft = dark
    ? mixHex(theme.background, "#ffffff", 0.92)
    : "#f6fbff";

  return {
    "--theme-canvas": theme.background,
    "--theme-canvas-rgb": rgbTriplet(theme.background),
    "--theme-image": theme.image ? `url("${theme.image}")` : "none",
    "--surface-rgb": rgbTriplet(surface),
    "--surface-soft-rgb": rgbTriplet(surfaceSoft),
    "--surface-shadow-rgb": dark ? "0 0 0" : "20 55 104",
    "--color-ink": theme.text,
    "--color-brand": theme.accent,
    "--color-brand-deep": brandDeepColor(theme.accent, theme.background),
    "--color-on-brand": onBrandColor(theme.accent),
    "--color-muted": `color-mix(in srgb, ${theme.text} 62%, ${theme.background})`,
    "--color-line": `color-mix(in srgb, ${theme.text} 15%, transparent)`,
    "--glass-border-rgb": rgbTriplet(theme.border),
    "--glass-border-strength": String(theme.borderStrength / 100),
  };
}
