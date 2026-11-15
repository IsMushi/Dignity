/**
 * Rounded-bezel lens maps for the Liquid glass material.
 *
 * A map is authored in the element's own pixel space and holds a lateral
 * offset per pixel: R is x, G is y, and 128 means "sample straight through".
 * `feDisplacementMap` multiplies `(channel - 128/255)` by its `scale`, so the
 * filter scale is `2 * depth` and one map covers the whole element.
 *
 * The field comes from a rounded-rect signed distance: depth inside the edge
 * drives a quarter-circle bevel whose offset is largest at the rim and decays
 * to nothing at the inner edge. That is what makes a thick pane magnify along
 * its edge and keep its centre clear, instead of smearing one stretched image
 * across every card the way a fixed map does.
 */

export type LensGeometry = {
  /** Layout width in CSS px. */
  width: number;
  /** Layout height in CSS px. */
  height: number;
  /** Corner radius in CSS px. */
  radius: number;
  /** Width of the bent zone along the edge, in CSS px. */
  bevel: number;
  /** Maximum lateral offset at the rim, in CSS px. */
  depth: number;
};

export type LensMap = {
  /** `data:image/png` holding the encoded field. */
  href: string;
  /** `feDisplacementMap` scale that turns the encoding back into pixels. */
  scale: number;
};

/** The field is smooth, so a small map stretched over the box loses nothing. */
const MAP_MAX_SIDE = 192;

/** Below this the bevel covers the whole element; there is no glass to read. */
const MIN_SIDE = 48;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Chromium is the only engine that paints an SVG filter graph inside
 * `backdrop-filter`; WebKit accepts the property and drops the filter
 * (bug 245510), Gecko does not implement it (bug 1787623). `CSS.supports`
 * is true on all three, so the engine itself has to be sniffed.
 */
export function isLensSupported() {
  if (typeof navigator === "undefined") return false;
  const brands = (
    navigator as Navigator & {
      userAgentData?: { brands?: Array<{ brand: string }> };
    }
  ).userAgentData?.brands;

  return (
    brands?.some((entry) =>
      /Chromium|Google Chrome|Microsoft Edge/i.test(entry.brand),
    ) ??
    /Chrome\/|Chromium\/|Edg\//.test(navigator.userAgent)
  );
}

/** Stable identity for a built map, used to share one filter per size bucket. */
export function lensMapKey(geometry: LensGeometry) {
  // Bucket to 8px so a rounded layout shift does not rebuild the field.
  const bucket = (value: number) => Math.round(value / 8) * 8;
  return [
    bucket(geometry.width),
    bucket(geometry.height),
    bucket(geometry.radius),
    geometry.bevel,
    geometry.depth,
  ].join(":");
}

function roundedRectDistance(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const qx = Math.abs(x - halfWidth) - (halfWidth - radius);
  const qy = Math.abs(y - halfHeight) - (halfHeight - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));

  return Math.min(Math.max(qx, qy), 0) + outside - radius;
}

/**
 * Builds the encoded field for one element size. Browser only: it rasterises
 * through a canvas because `feDisplacementMap` needs a bitmap map.
 */
export function buildLensMap(input: LensGeometry): LensMap | null {
  if (typeof document === "undefined") return null;

  const width = Math.round(input.width);
  const height = Math.round(input.height);
  if (width < MIN_SIDE || height < MIN_SIDE) return null;

  const shortSide = Math.min(width, height);
  const radius = clamp(input.radius, 0, shortSide / 2);
  const bevel = clamp(input.bevel, 2, shortSide / 2);
  const depth = clamp(input.depth, 0, 40);
  if (depth <= 0) return null;

  const scale = Math.min(1, MAP_MAX_SIDE / Math.max(width, height));
  const mapWidth = Math.max(2, Math.round(width * scale));
  const mapHeight = Math.max(2, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const image = context.createImageData(mapWidth, mapHeight);
  const data = image.data;
  const stepX = width / mapWidth;
  const stepY = height / mapHeight;
  // 1px is small enough for a central-difference normal at this map density.
  const probe = Math.max(1, Math.min(stepX, stepY));

  for (let row = 0; row < mapHeight; row += 1) {
    const y = (row + 0.5) * stepY;

    for (let column = 0; column < mapWidth; column += 1) {
      const x = (column + 0.5) * stepX;
      const offset = (row * mapWidth + column) * 4;
      const distance = roundedRectDistance(x, y, width, height, radius);

      data[offset + 3] = 255;

      // Outside the bevel band the backdrop is sampled unchanged.
      if (distance >= 0 || -distance >= bevel) {
        data[offset] = 128;
        data[offset + 1] = 128;
        data[offset + 2] = 128;
        continue;
      }

      // Falloff along the bevel: 1 at the rim, 0 where the flat pane starts.
      // A gentle curve spreads the pull across the whole bevel, so the edge
      // reads as a curved surface instead of a hard band.
      const t = -distance / bevel;
      const falloff = Math.pow(1 - t, 1.35);

      // Inward normal, taken from the distance field.
      const gradientX =
        roundedRectDistance(x + probe, y, width, height, radius) -
        roundedRectDistance(x - probe, y, width, height, radius);
      const gradientY =
        roundedRectDistance(x, y + probe, width, height, radius) -
        roundedRectDistance(x, y - probe, width, height, radius);
      const length = Math.hypot(gradientX, gradientY) || 1;

      // The offset pulls the backdrop inward: `0.5 - n * falloff / 2` in
      // normalised channel units, which is a half-range of 127 at the rim.
      const pull = (falloff * 127) / length;

      data[offset] = clamp(Math.round(128 - gradientX * pull), 0, 255);
      data[offset + 1] = clamp(Math.round(128 - gradientY * pull), 0, 255);
      data[offset + 2] = 128;
    }
  }

  context.putImageData(image, 0, 0);

  return { href: canvas.toDataURL("image/png"), scale: depth * 2 };
}
