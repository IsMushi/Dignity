import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_GLASS_LEVEL,
  clampGlassLevel,
  glassLevelLabel,
  parseGlassLevel,
} from "../src/lib/appearance.ts";

test("clampGlassLevel keeps values inside 0–100 and rounds", () => {
  assert.equal(clampGlassLevel(55), 55);
  assert.equal(clampGlassLevel(42.6), 43);
  assert.equal(clampGlassLevel(-10), 0);
  assert.equal(clampGlassLevel(140), 100);
});

test("clampGlassLevel falls back for non-finite input", () => {
  assert.equal(clampGlassLevel(Number.NaN), DEFAULT_GLASS_LEVEL);
  assert.equal(clampGlassLevel(Number.POSITIVE_INFINITY), DEFAULT_GLASS_LEVEL);
});

test("parseGlassLevel rejects missing and malformed values", () => {
  assert.equal(parseGlassLevel(null), null);
  assert.equal(parseGlassLevel(undefined), null);
  assert.equal(parseGlassLevel(""), null);
  assert.equal(parseGlassLevel("   "), null);
  assert.equal(parseGlassLevel("glass"), null);
});

test("parseGlassLevel clamps valid numeric strings", () => {
  assert.equal(parseGlassLevel("0"), 0);
  assert.equal(parseGlassLevel(" 42 "), 42);
  assert.equal(parseGlassLevel("150"), 100);
  assert.equal(parseGlassLevel("-3"), 0);
});

test("glassLevelLabel follows the documented ranges", () => {
  assert.equal(glassLevelLabel(0), "Solid");
  assert.equal(glassLevelLabel(1), "Soft");
  assert.equal(glassLevelLabel(49), "Soft");
  assert.equal(glassLevelLabel(50), "Balanced");
  assert.equal(glassLevelLabel(84), "Balanced");
  assert.equal(glassLevelLabel(85), "Liquid");
  assert.equal(glassLevelLabel(100), "Liquid");
});

test("glassLevelLabel normalises out-of-range input", () => {
  assert.equal(glassLevelLabel(-5), "Solid");
  assert.equal(glassLevelLabel(250), "Liquid");
});
