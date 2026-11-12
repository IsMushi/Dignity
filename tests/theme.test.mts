import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_THEME,
  THEME_PRESETS,
  canvasMode,
  clampBorderStrength,
  contrastRatio,
  contrastRating,
  mixHex,
  normalizeHex,
  onBrandColor,
  parseTheme,
  rotateHue,
  serializeTheme,
  serializeThemeCookie,
  themeIsDark,
  themeStyle,
  withBorderStrength,
  withColor,
} from "../src/lib/theme.ts";

const IMAGE = "data:image/webp;base64,UklGRiQAAABXRUJQ";

test("normalizeHex expands short values and lowercases", () => {
  assert.equal(normalizeHex("#abc"), "#aabbcc");
  assert.equal(normalizeHex("ABC"), "#aabbcc");
  assert.equal(normalizeHex("  #094197  "), "#094197");
  assert.equal(normalizeHex("094197"), "#094197");
});

test("normalizeHex rejects malformed values", () => {
  assert.equal(normalizeHex(""), null);
  assert.equal(normalizeHex("#12"), null);
  assert.equal(normalizeHex("#12345"), null);
  assert.equal(normalizeHex("#gggggg"), null);
  assert.equal(normalizeHex("blue"), null);
});

test("theme serialization round-trips", () => {
  const parsed = parseTheme(serializeTheme(DEFAULT_THEME));
  assert.deepEqual(parsed, DEFAULT_THEME);
});

test("parseTheme rejects missing, malformed and incomplete cookies", () => {
  assert.equal(parseTheme(null), null);
  assert.equal(parseTheme(undefined), null);
  assert.equal(parseTheme(""), null);
  assert.equal(parseTheme("not json"), null);
  assert.equal(parseTheme("{}"), null);
  assert.equal(parseTheme(JSON.stringify({ b: "#fff", t: "nope", a: "#000" })), null);
});

test("parseTheme marks unknown presets as custom", () => {
  const parsed = parseTheme(
    JSON.stringify({ p: "neon", b: "#ffffff", t: "#111111", a: "#094197", i: 0 }),
  );
  assert.equal(parsed?.preset, "custom");
  assert.equal(parsed?.photo, false);
});

test("withColor keeps the Sky photo when only text or accent changes", () => {
  const text = withColor(DEFAULT_THEME, "text", "#0b2a55");
  assert.equal(text.photo, true);
  assert.equal(text.preset, "custom");

  const accent = withColor(DEFAULT_THEME, "accent", "#0a4aa9");
  assert.equal(accent.photo, true);

  const background = withColor(DEFAULT_THEME, "background", "#f2e7d5");
  assert.equal(background.photo, false);
});

test("withColor leaves the other channels untouched", () => {
  const text = withColor(DEFAULT_THEME, "text", "#0b2a55");
  assert.equal(text.text, "#0b2a55");
  assert.equal(text.background, DEFAULT_THEME.background);
  assert.equal(text.accent, DEFAULT_THEME.accent);
  assert.equal(text.photo, true);
  assert.equal(text.preset, "custom");
});

test("withColor keeps an uploaded image unless the background changes", () => {
  const uploaded = { ...DEFAULT_THEME, photo: false, image: IMAGE };

  const text = withColor(uploaded, "text", "#0b2a55");
  assert.equal(text.image, IMAGE);
  assert.equal(text.photo, false);

  const accent = withColor(uploaded, "accent", "#0a4aa9");
  assert.equal(accent.image, IMAGE);

  const background = withColor(uploaded, "background", "#f2e7d5");
  assert.equal(background.image, null);
  assert.equal(background.preset, "custom");
});

test("withColor keeps the canvas when only the border changes", () => {
  const uploaded = { ...DEFAULT_THEME, photo: false, image: IMAGE };
  const bordered = withColor(uploaded, "border", "#B03A2E");

  assert.equal(bordered.border, "#b03a2e");
  assert.equal(bordered.borderStrength, DEFAULT_THEME.borderStrength);
  assert.equal(bordered.image, IMAGE);
  assert.equal(bordered.photo, false);
  assert.equal(bordered.preset, "custom");
});

test("withBorderStrength clamps and preserves the canvas", () => {
  const uploaded = { ...DEFAULT_THEME, photo: false, image: IMAGE };
  const bordered = withBorderStrength(uploaded, 140);

  assert.equal(bordered.borderStrength, 100);
  assert.equal(bordered.image, IMAGE);
  assert.equal(bordered.preset, "custom");

  assert.equal(withBorderStrength(DEFAULT_THEME, -20).borderStrength, 0);
  assert.equal(withBorderStrength(DEFAULT_THEME, 42.6).borderStrength, 43);
});

test("clampBorderStrength refuses non-finite input", () => {
  assert.equal(clampBorderStrength(Number.NaN), 100);
  assert.equal(clampBorderStrength(Number.POSITIVE_INFINITY), 100);
  assert.equal(clampBorderStrength(0), 0);
  assert.equal(clampBorderStrength(100), 100);
  assert.equal(clampBorderStrength(101), 100);
});

test("old theme cookies fall back to the default border", () => {
  const parsed = parseTheme(
    JSON.stringify({
      p: "sand",
      b: "#f2e7d5",
      t: "#3d2f1d",
      a: "#8f4f16",
      i: 0,
    }),
  );

  assert.equal(parsed?.border, DEFAULT_THEME.border);
  assert.equal(parsed?.borderStrength, DEFAULT_THEME.borderStrength);
});

test("parseTheme carries a custom border and clamps strength", () => {
  const parsed = parseTheme(
    JSON.stringify({
      p: "custom",
      b: "#ffffff",
      t: "#111111",
      a: "#094197",
      r: "#B03A2E",
      s: 140,
      i: 0,
    }),
  );

  assert.equal(parsed?.border, "#b03a2e");
  assert.equal(parsed?.borderStrength, 100);

  const low = parseTheme(
    JSON.stringify({
      p: "custom",
      b: "#ffffff",
      t: "#111111",
      a: "#094197",
      r: "not-a-colour",
      s: -20,
      i: 0,
    }),
  );

  assert.equal(low?.border, DEFAULT_THEME.border);
  assert.equal(low?.borderStrength, 0);
});

test("contrastRatio matches WCAG extremes", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#ffffff", "#ffffff"), 1);
  assert.ok(contrastRatio("#094197", "#ffffff") > 7);
});

test("contrastRating follows AA and AAA thresholds", () => {
  assert.equal(contrastRating(7), "AAA");
  assert.equal(contrastRating(6.99), "AA");
  assert.equal(contrastRating(4.5), "AA");
  assert.equal(contrastRating(4.49), "AA Large");
  assert.equal(contrastRating(3), "AA Large");
  assert.equal(contrastRating(2.99), "Fail");
});

test("onBrandColor picks the readable ink for the accent", () => {
  assert.equal(onBrandColor("#094197"), "#ffffff");
  assert.equal(onBrandColor("#f5d90a"), "#08111f");
});

test("mixHex blends toward the second colour", () => {
  assert.equal(mixHex("#000000", "#ffffff", 1), "#000000");
  assert.equal(mixHex("#000000", "#ffffff", 0), "#ffffff");
  assert.equal(mixHex("#000000", "#ffffff", 0.5), "#808080");
});

test("rotateHue round-trips at 0° and 360°", () => {
  assert.equal(rotateHue("#094197", 0), "#094197");
  assert.equal(rotateHue("#094197", 360), "#094197");
  assert.equal(rotateHue("#a05c1e", -360), "#a05c1e");
});

test("rotateHue twice by 180° returns the original colour", () => {
  const accent = "#094197";
  assert.equal(rotateHue(rotateHue(accent, 180), 180), accent);

  const copper = "#a05c1e";
  assert.equal(rotateHue(rotateHue(copper, 180), 180), copper);
});

test("rotateHue keeps fully desaturated colours unchanged", () => {
  assert.equal(rotateHue("#808080", 180), "#808080");
  assert.equal(rotateHue("#000000", 90), "#000000");
  assert.equal(rotateHue("#ffffff", -60), "#ffffff");
});

test("rotateHue returns malformed input untouched", () => {
  assert.equal(rotateHue("blue", 90), "blue");
  assert.equal(rotateHue("", 90), "");
  assert.equal(rotateHue("#12345", 90), "#12345");
});

test("themeIsDark detects light presets and dark canvases", () => {
  for (const preset of THEME_PRESETS) {
    assert.equal(themeIsDark(preset.theme), false, preset.label);
  }
  assert.equal(
    themeIsDark({
      preset: "custom",
      background: "#141a22",
      text: "#eef2f7",
      accent: "#8ab4f8",
      border: "#ffffff",
      borderStrength: 100,
      photo: false,
      image: null,
    }),
    true,
  );
});

test("every preset keeps text and accent readable on its canvas", () => {
  for (const preset of THEME_PRESETS) {
    const textRatio = contrastRatio(preset.theme.text, preset.theme.background);
    const accentRatio = contrastRatio(
      preset.theme.accent,
      preset.theme.background,
    );
    assert.ok(textRatio >= 4.5, `${preset.label} text ${textRatio.toFixed(2)}`);
    assert.ok(
      accentRatio >= 4.5,
      `${preset.label} accent ${accentRatio.toFixed(2)}`,
    );
  }
});

test("themeStyle exposes the variables the glass consumes", () => {
  const style = themeStyle(DEFAULT_THEME);
  assert.equal(style["--theme-canvas"], DEFAULT_THEME.background);
  assert.equal(style["--color-ink"], DEFAULT_THEME.text);
  assert.equal(style["--color-brand"], DEFAULT_THEME.accent);
  assert.equal(style["--color-on-brand"], "#ffffff");
  assert.equal(style["--surface-rgb"], "255 255 255");
  assert.equal(style["--glass-border-rgb"], "255 255 255");
  assert.equal(style["--glass-border-strength"], "1");
  assert.match(style["--color-muted"], /color-mix/);
});

test("themeStyle exposes the border colour and strength", () => {
  const style = themeStyle(
    withColor(withBorderStrength(DEFAULT_THEME, 40), "border", "#b03a2e"),
  );
  assert.equal(style["--glass-border-rgb"], "176 58 46");
  assert.equal(style["--glass-border-strength"], "0.4");
});

test("themeStyle switches glass channels for a dark canvas", () => {
  const style = themeStyle({
    preset: "custom",
    background: "#141a22",
    text: "#eef2f7",
    accent: "#8ab4f8",
    border: "#ffffff",
    borderStrength: 100,
    photo: false,
    image: null,
  });
  assert.notEqual(style["--surface-rgb"], "255 255 255");
  assert.equal(style["--surface-shadow-rgb"], "0 0 0");
  assert.equal(style["--color-on-brand"], "#08111f");
});

test("canvasMode prefers an upload, then the Sky photo, then a flat colour", () => {
  assert.equal(canvasMode(DEFAULT_THEME), "photo");
  assert.equal(
    canvasMode({ ...DEFAULT_THEME, photo: false }),
    "flat",
  );
  assert.equal(
    canvasMode({ ...DEFAULT_THEME, photo: false, image: IMAGE }),
    "image",
  );
  assert.equal(canvasMode({ ...DEFAULT_THEME, image: IMAGE }), "image");
});

test("theme serialization carries the uploaded image", () => {
  const uploaded = { ...DEFAULT_THEME, preset: "custom" as const, photo: false, image: IMAGE };
  const parsed = parseTheme(serializeTheme(uploaded));
  assert.deepEqual(parsed, uploaded);
});

test("the cookie serializer leaves the image out", () => {
  const uploaded = { ...DEFAULT_THEME, preset: "custom" as const, photo: false, image: IMAGE };
  const cookie = parseTheme(serializeThemeCookie(uploaded));
  assert.equal(cookie?.image, null);
  assert.equal(cookie?.background, uploaded.background);
  assert.equal(cookie?.text, uploaded.text);
  assert.equal(cookie?.accent, uploaded.accent);
  assert.equal(cookie?.photo, false);
  assert.ok(serializeThemeCookie(uploaded).length < 200);
});

test("parseTheme only accepts image data URLs", () => {
  const base = { p: "custom", b: "#ffffff", t: "#111111", a: "#094197", i: 0 };

  assert.equal(parseTheme(JSON.stringify({ ...base, m: IMAGE }))?.image, IMAGE);
  assert.equal(
    parseTheme(JSON.stringify({ ...base, m: "https://example.com/photo.jpg" }))
      ?.image,
    null,
  );
  assert.equal(parseTheme(JSON.stringify({ ...base, m: 42 }))?.image, null);
  assert.equal(parseTheme(JSON.stringify({ ...base, m: "data:text/html;base64,abc" }))?.image, null);
});

test("themeStyle exposes the uploaded image as a CSS background", () => {
  const style = themeStyle({ ...DEFAULT_THEME, photo: false, image: IMAGE });
  assert.equal(style["--theme-image"], `url("${IMAGE}")`);

  assert.equal(themeStyle(DEFAULT_THEME)["--theme-image"], "none");
});
