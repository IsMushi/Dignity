/**
 * Displacement map + specular-ready filter for the Liquid glass lens.
 *
 * The map is a rounded-bezel field: R/G encode the outward normal scaled by
 * the bend strength, with a neutral centre. It is only referenced at Liquid
 * level in Chromium; every other browser keeps the CSS blur fallback.
 */
export function GlassLens() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
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
            scale="64"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lens-bend"
          />
          <feGaussianBlur in="lens-bend" stdDeviation="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
