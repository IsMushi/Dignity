"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Open/close state machine for a dismissable dropdown. Handles the exit
 * animation, outside clicks and Escape so the Customize panel and the
 * business menu don't carry two copies of the same 40 lines.
 */
export function useDismissableMenu({
  onEscape,
}: {
  onEscape?: () => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the latest callback without re-registering the document listeners.
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  const close = useCallback(() => {
    setShown(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    closeTimer.current = window.setTimeout(
      () => {
        setOpen(false);
        closeTimer.current = null;
      },
      reduced ? 0 : 160,
    );
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        onEscapeRef.current?.();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return { open, shown, close, toggle, containerRef };
}
