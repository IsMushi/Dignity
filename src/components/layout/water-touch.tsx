"use client";

import { useEffect } from "react";

/**
 * Water touch. CSS cannot know where the pointer is, so this writes the
 * cursor position onto the nearest glass surface as --mx/--my. The card's
 * ::before reads those values for the light that follows the pointer and the
 * ring that expands from it (see surfaces.css).
 *
 * Container surfaces are listed first so a pane's light keeps following the
 * pointer even when it crosses a chip or a control inside it: `closest`
 * returns the innermost match, and the vars then inherit down from there.
 */
const SURFACES = [
  ".card-kpi-host",
  ".card-soft",
  ".card-kpi",
  ".liquid-card",
  ".glass",
  ".glass-panel",
  ".glass-control",
  ".chip",
  ".appearance-hex",
  ".kbd",
].join(", ");

export function WaterTouch() {
  useEffect(() => {
    let frame = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = 0;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${Math.round(x - rect.left)}px`);
      target.style.setProperty("--my", `${Math.round(y - rect.top)}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Touch pointers scroll; they are not a hover cue.
      if (event.pointerType === "touch") return;

      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(SURFACES)
          : null;
      if (!element) return;

      target = element;
      x = event.clientX;
      y = event.clientY;

      // One write per frame: pointermove fires far more often than paint.
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
