"use client";

import { useEffect } from "react";
import {
  buildLensMap,
  isLensSupported,
  lensMapKey,
  type LensGeometry,
  type LensMap,
} from "@/lib/lens-map";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Every surface that carries the water lens. Chips are deliberately absent:
 * they are too small for a bevel to read and would only cost a render surface.
 */
const SURFACES = ".card-kpi, .card-soft, .liquid-card, .glass, .glass-panel";

/** Layout px. The CSS tokens hold the per-surface values. */
const BEVEL_FALLBACK = 18;
const DEPTH_FALLBACK = 9;

function readPx(element: HTMLElement, property: string, fallback: number) {
  const raw = getComputedStyle(element).getPropertyValue(property).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

function createLensFilter(id: string, map: LensMap) {
  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", "100%");
  filter.setAttribute("height", "100%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const image = document.createElementNS(SVG_NS, "feImage");
  image.setAttribute("href", map.href);
  image.setAttribute("x", "0");
  image.setAttribute("y", "0");
  image.setAttribute("width", "100%");
  image.setAttribute("height", "100%");
  image.setAttribute("preserveAspectRatio", "none");
  image.setAttribute("result", "lens-map");

  const bend = document.createElementNS(SVG_NS, "feDisplacementMap");
  bend.setAttribute("in", "SourceGraphic");
  bend.setAttribute("in2", "lens-map");
  bend.setAttribute("scale", String(map.scale));
  bend.setAttribute("xChannelSelector", "R");
  bend.setAttribute("yChannelSelector", "G");
  bend.setAttribute("result", "lens-bend");

  // Chromium samples the displaced backdrop nearest-neighbour, so a strong
  // bend turns high-contrast edges behind the glass into a staircase. A
  // sub-pixel blur after the pass melts it without touching the pane.
  const melt = document.createElementNS(SVG_NS, "feGaussianBlur");
  melt.setAttribute("in", "lens-bend");
  melt.setAttribute("stdDeviation", "0.4");

  filter.append(image, bend, melt);
  return filter;
}

export function GlassLens() {
  useEffect(() => {
    const registry = document.getElementById("dignity-lens-registry");
    if (!registry || !isLensSupported()) return;

    const maps = new Map<string, LensMap | null>();
    const filters = new Map<string, { node: SVGFilterElement; refs: number }>();
    const boundTo = new WeakMap<HTMLElement, string>();

    const release = (key: string) => {
      const entry = filters.get(key);
      if (!entry) return;
      entry.refs -= 1;
      if (entry.refs > 0) return;
      entry.node.remove();
      filters.delete(key);
    };

    const unbind = (element: HTMLElement) => {
      const key = boundTo.get(element);
      if (!key) return;
      boundTo.delete(element);
      element.style.removeProperty("--lens");
      element.removeAttribute("data-lens-bound");
      release(key);
    };

    const bind = (element: HTMLElement) => {
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const geometry: LensGeometry = {
        width,
        height,
        radius: Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
        bevel: readPx(element, "--lens-bevel", BEVEL_FALLBACK),
        depth: readPx(element, "--lens-depth", DEPTH_FALLBACK),
      };

      if (width < 48 || height < 48 || geometry.depth <= 0) {
        unbind(element);
        return;
      }

      const key = lensMapKey(geometry);
      if (boundTo.get(element) === key) return;

      let map = maps.get(key);
      if (map === undefined) {
        map = buildLensMap(geometry);
        maps.set(key, map);
      }

      unbind(element);
      if (!map) return;

      const id = `dignity-lens-${key.replace(/:/g, "-")}`;
      let entry = filters.get(id);
      if (!entry) {
        const node = createLensFilter(id, map);
        registry.append(node);
        entry = { node, refs: 0 };
        filters.set(id, entry);
      }
      entry.refs += 1;

      boundTo.set(element, id);
      element.style.setProperty("--lens", `url(#${id})`);
      element.dataset.lensBound = "";
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(SURFACES)) bind(root);
      root.querySelectorAll<HTMLElement>(SURFACES).forEach(bind);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target;
        if (target instanceof HTMLElement) bind(target);
      }
    });

    const watch = (element: HTMLElement) => {
      resizeObserver.observe(element);
      bind(element);
    };

    scan(document);
    document.querySelectorAll<HTMLElement>(SURFACES).forEach(watch);

    // Routes and dropdowns mount surfaces after this effect runs.
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(SURFACES)) watch(node);
            node.querySelectorAll<HTMLElement>(SURFACES).forEach(watch);
          }
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      document.querySelectorAll<HTMLElement>(SURFACES).forEach(unbind);
      filters.forEach((entry) => entry.node.remove());
      filters.clear();
      maps.clear();
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-px w-px overflow-hidden"
      style={{ clip: "rect(0 0 0 0)" }}
    >
      <defs id="dignity-lens-registry" />
    </svg>
  );
}
