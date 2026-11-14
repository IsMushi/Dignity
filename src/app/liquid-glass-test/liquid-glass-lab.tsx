"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { GripVertical } from "lucide-react";
import styles from "./liquid-glass-test.module.css";

/**
 * Backgrounds for the panes.
 *
 * The first four are the local files in `public/backgrounds`. Only
 * `sky-background.webp` is full-bleed (1920×1280); the other three are the
 * 240px preset thumbnails, so `cover` has to upscale them hard.
 *
 * The fifth is generated in CSS. Smooth skies and soft cloud are the worst
 * possible test content for a displacement filter: neighbouring pixels are
 * nearly identical, so bending the backdrop by up to 15px samples a
 * near-identical pixel and the refraction is invisible. Fine high-contrast
 * edges and saturated colour make both the bend and the saturation term show.
 */
const BACKGROUNDS = [
  {
    label: "Sky background (1920×1280)",
    backgroundImage: 'url("/backgrounds/sky-background.webp")',
  },
  {
    label: "Convention day thumbnail (240×135)",
    backgroundImage: 'url("/backgrounds/convention-day-thumb.webp")',
  },
  {
    label: "Pearl folds thumbnail (240×135)",
    backgroundImage: 'url("/backgrounds/pearl-folds-thumb.webp")',
  },
  {
    label: "Sky sea thumbnail (240×160)",
    backgroundImage: 'url("/backgrounds/different.webp")',
  },
  {
    label: "Detail test · generated grid, no image",
    backgroundImage:
      "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.85) 0 1.5px, transparent 1.5px 16px), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.85) 0 1.5px, transparent 1.5px 16px), linear-gradient(135deg, #ff2d55, #ff9500, #34d399, #0ea5e9, #8b5cf6)",
  },
] as const;

type Pane = {
  key: string;
  label: string;
  className: string;
  caption: React.ReactNode;
};

const PANES: Pane[] = [
  {
    key: "svg",
    label: "A · SVG backdrop",
    className: styles.paneSvg,
    caption: (
      <>
        <code>backdrop-filter: url(#self-warp)</code> — the backdrop displaces
        itself.
      </>
    ),
  },
  {
    key: "filter",
    label: "B · filter",
    className: styles.paneWrong,
    caption: (
      <>
        <code>filter: url(#bezel-lens)</code> — warps the pane, not the photo
        behind it.
      </>
    ),
  },
  {
    key: "lens",
    label: "C · bezel lens",
    className: styles.paneLens,
    caption: (
      <>
        <code>backdrop-filter: url(#bezel-lens)</code> — bends at the rim only.
      </>
    ),
  },
];

/** Identity order of PANES; `order` below is a permutation of these indices. */
const DEFAULT_ORDER = PANES.map((_, index) => index);

export function LiquidGlassLab() {
  const [activeBackground, setActiveBackground] = useState(0);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [order, setOrder] = useState<number[]>(DEFAULT_ORDER);
  const [selectedPane, setSelectedPane] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isDefaultOrder = order.every(
    (paneIndex, position) => paneIndex === DEFAULT_ORDER[position],
  );

  /*
    Positions are swapped, not removed-and-inserted: picking card A then card
    B trades their slots. Keeping the gesture a swap (rather than a drag-move)
    means the click path and the drag path behave identically.
  */
  function swapPositions(first: number, second: number) {
    setOrder((current) =>
      current.map((paneIndex) => {
        if (paneIndex === first) return second;
        if (paneIndex === second) return first;
        return paneIndex;
      }),
    );
  }

  function selectPane(paneIndex: number) {
    if (selectedPane === null) {
      setSelectedPane(paneIndex);
      return;
    }
    if (selectedPane === paneIndex) {
      setSelectedPane(null);
      return;
    }
    swapPositions(selectedPane, paneIndex);
    setSelectedPane(null);
  }

  function startDrag(event: DragEvent, paneIndex: number) {
    event.dataTransfer.setData("text/plain", String(paneIndex));
    event.dataTransfer.effectAllowed = "move";
    const cell = event.currentTarget.closest("figure");
    if (cell) {
      // Show the whole card as the drag ghost, not just the grip.
      event.dataTransfer.setDragImage(cell, 12, 12);
    }
  }

  function dropOnPane(event: DragEvent, targetIndex: number) {
    const rawSource = event.dataTransfer.getData("text/plain");
    if (rawSource === "") return;
    const sourceIndex = Number(rawSource);
    if (
      !Number.isInteger(sourceIndex) ||
      sourceIndex === targetIndex ||
      sourceIndex < 0 ||
      sourceIndex >= PANES.length
    ) {
      return;
    }
    swapPositions(sourceIndex, targetIndex);
  }

  /*
    Read the resolved values after mount (and again whenever the cards are
    swapped) so the page shows what the browser actually accepted rather than
    what the stylesheet asked for. A missing bend in one pane then reads as
    evidence, not as a broken stylesheet.
  */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const panes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-pane]"),
    );

    const lines = [
      `backdrop-filter url() accepted: ${CSS.supports(
        "backdrop-filter",
        "url(#self-warp)",
      )}`,
    ];

    for (const pane of panes) {
      const computed = getComputedStyle(pane);
      lines.push(
        `${pane.dataset.pane} → backdrop-filter: ${
          computed.backdropFilter || "none"
        } | filter: ${computed.filter || "none"}`,
      );
    }

    setDiagnostics(lines);
  }, [order]);

  return (
    <div ref={rootRef}>
      <div
        className={styles.stage}
        style={{
          backgroundImage: BACKGROUNDS[activeBackground].backgroundImage,
        }}
      >
        <header className={styles.head}>
          <h1 className={styles.title}>What the filter is filtering</h1>
          <p className={styles.lede}>
            Same <code>feDisplacementMap</code>, three targets. In{" "}
            <code>backdrop-filter</code> it bends what is <em>behind</em> the
            pane; in <code>filter</code> it bends the pane itself. Move the
            background and watch the difference.
          </p>
        </header>

        <div className={styles.toolbar}>
          <p className={styles.hint} aria-live="polite">
            {selectedPane === null
              ? "Click two cards to swap their positions, or drag a grip onto another card."
              : `Selected “${PANES[selectedPane].label}” — click another card to swap, or this one to cancel.`}
          </p>
          <button
            type="button"
            className={styles.reset}
            disabled={isDefaultOrder}
            onClick={() => {
              setOrder(DEFAULT_ORDER);
              setSelectedPane(null);
            }}
          >
            Reset order
          </button>
        </div>

        <div className={styles.grid}>
          {order.map((paneIndex) => {
            const pane = PANES[paneIndex];
            return (
              <figure
                key={pane.key}
                className={styles.cell}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => dropOnPane(event, paneIndex)}
              >
                <button
                  type="button"
                  className={`${styles.pane} ${pane.className}`}
                  data-pane={pane.label}
                  aria-pressed={selectedPane === paneIndex}
                  onClick={() => selectPane(paneIndex)}
                >
                  {pane.label}
                </button>
                {/*
                  Drag affordance for pointer users only: a sibling of the pane,
                  not a child, so pane B's `filter` cannot bend the grip along
                  with its own paint. The same swap is reachable from the
                  keyboard via click-to-select, so the handle is hidden from
                  assistive technology.
                */}
                <span
                  className={styles.handle}
                  draggable
                  aria-hidden="true"
                  title="Drag onto another card to swap"
                  onDragStart={(event) => startDrag(event, paneIndex)}
                >
                  <GripVertical size={14} />
                </span>
                <figcaption className={styles.caption}>
                  {pane.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className={styles.switcher}>
          <span className={styles.switcherLabel}>Background:</span>
          {BACKGROUNDS.map((background, index) => (
            <button
              key={background.label}
              type="button"
              className={styles.swatch}
              aria-pressed={index === activeBackground}
              aria-label={`Background: ${background.label}`}
              title={background.label}
              style={{ backgroundImage: background.backgroundImage }}
              onClick={() => setActiveBackground(index)}
            />
          ))}
        </div>

        <pre className={styles.diagnostics}>
          {diagnostics.length > 0
            ? diagnostics.join("\n")
            : "reading computed styles…"}
        </pre>
      </div>

      <small className={styles.note}>
        Ironically, backdrop-filters with SVGs (<code>url(#filter)</code>) are
        Chromium-only. Firefox and Safari parse the value and paint nothing, so
        panes A and C read as plain tinted panes there — CSS has no reliable
        way to detect the difference, which is why the app sets{" "}
        <code>data-lens</code> from JavaScript instead of <code>@supports</code>
        .
      </small>

      <svg style={{ display: "none" }} aria-hidden="true" focusable="false">
        <defs>
          {/*
            The CodePen filter. in and in2 both point at SourceGraphic, so the
            graphic displaces itself: the map is the image's own red and blue
            channels.

            The original also carried primitiveUnits="userSpaceOnUse" with
            x="0%" width="100%" on both primitives. Inside a display:none SVG
            root those percentages resolve against a zero-sized viewport, so
            the primitive region collapses and the filter outputs a fully
            transparent frame. The region is omitted here so it defaults to
            the object bounding box.
          */}
          <filter id="self-warp" colorInterpolationFilters="linearRGB">
            <feDisplacementMap
              in="SourceGraphic"
              in2="SourceGraphic"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displacementMap"
            />
            {/*
              The CodePen used stdDeviation="3" here. On a bright, low-detail
              backdrop that large a blur dominates the displacement, so pane B
              read as plain frost instead of a bend. 0.5 keeps enough softening
              to hide the displacement seams without swallowing the refraction.
            */}
            <feGaussianBlur in="displacementMap" stdDeviation="0.5" result="blur" />
          </filter>

          {/*
            The repo's approach: a pre-rendered rounded-bezel field where R/G
            encode the outward normal, so the displacement is strong at the
            rim and zero in the centre.
          */}
          <filter
            id="bezel-lens"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href="/glass-lens.png"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lens-map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens-map"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
              result="lens-bend"
            />
            <feGaussianBlur in="lens-bend" stdDeviation="0.05" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
