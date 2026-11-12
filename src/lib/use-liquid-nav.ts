"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/data";
import { isNavItemActive } from "@/lib/navigation";

/*
  Shared behaviour for the three navigations (top bar, rail, mobile).

  The active surface is a single <span class="nav-liquid"> that is measured
  against the active item and moved with CSS transitions, so the glass looks
  like one liquid body sliding between destinations instead of two elements
  cross-fading into each other.

  The active item comes from the URL now, not from a click counter, so a
  reload, a shared link or the back button highlights the right destination.
*/
const LIQUID_MOVE_MS = 520;

export function useLiquidNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLElement | null>(null);
  const [attached, setAttached] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathname = useRef(pathname);

  const activeItem =
    navItems.find(
      (item) =>
        item.href === pendingHref ||
        isNavItemActive(pathname, item.href),
    ) ?? null;
  const active = activeItem?.label ?? "";

  const setList = useCallback((node: HTMLElement | null) => {
    listRef.current = node;
    setAttached(Boolean(node));
  }, []);

  const pulse = useCallback(() => {
    setMoving(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMoving(false), LIQUID_MOVE_MS);
  }, []);

  const place = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const item = list.querySelector<HTMLElement>('[data-nav-active="true"]');
    if (!item) {
      delete list.dataset.navReady;
      return;
    }

    const listBox = list.getBoundingClientRect();
    const box = item.getBoundingClientRect();

    /* Hidden layouts (e.g. the desktop rail on mobile) measure 0 × 0. */
    if (box.width === 0 || box.height === 0) {
      delete list.dataset.navReady;
      return;
    }

    list.style.setProperty("--nav-x", `${box.left - listBox.left}px`);
    list.style.setProperty("--nav-y", `${box.top - listBox.top}px`);
    list.style.setProperty("--nav-w", `${box.width}px`);
    list.style.setProperty("--nav-h", `${box.height}px`);
    list.dataset.navReady = "true";
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!attached || !list) return;

    place();

    const observer = new ResizeObserver(() => place());
    observer.observe(list);
    window.addEventListener("resize", place);
    void document.fonts?.ready.then(place);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [attached, place]);

  useEffect(() => {
    place();
  }, [active, place]);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    setPendingHref(null);
    pulse();
  }, [pathname, pulse]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  /*
    Keep the tapped destination highlighted while Next.js fetches the route,
    then let the pathname take over once navigation completes.
  */
  const select = useCallback(
    (href: string) => {
      setPendingHref(href);
      pulse();
    },
    [pulse],
  );

  return { setList, active, moving, select };
}
