/**
 * Displacement maps for Liquid glass surfaces and the KPI hero lens.
 *
 * The map is a rounded-bezel field: R/G encode the outward normal scaled by
 * the bend strength, with a neutral centre. The lower-scale surface lens and
 * stronger KPI lens are Chromium-only; other browsers use CSS blur and tint.
 */
export function GlassLens() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-px w-px overflow-hidden"
      style={{ clip: "rect(0 0 0 0)" }}
    >
      <defs>
        <filter
          id="dignity-lens"
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
            scale="44"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lens-bend"
          />
          <feGaussianBlur in="lens-bend" stdDeviation="0.05" />
        </filter>
        <filter
          id="dignity-surface-lens"
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
            result="surface-map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="surface-map"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
            result="surface-bend"
          />
          <feGaussianBlur in="surface-bend" stdDeviation="0.05" />
        </filter>
        <filter
          id="dignity-chrome-lens"
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
            result="chrome-map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="chrome-map"
            scale="13"
            xChannelSelector="R"
            yChannelSelector="G"
            result="chrome-bend"
          />
          <feGaussianBlur in="chrome-bend" stdDeviation="0.04" />
        </filter>
      </defs>
    </svg>
  );
}
