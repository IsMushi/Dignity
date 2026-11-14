"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { GlassLevelControl } from "@/components/glass-level-control";
import { useTheme } from "@/components/layout/theme-provider";
import { themeImageFromFile, MAX_THEME_IMAGE_BYTES } from "@/lib/theme-image";
import {
  BACKGROUND_SCENES,
  THEME_PRESETS,
  backgroundScene,
  canvasMode,
  contrastRatio,
  contrastRating,
  meetsTextContrast,
  mixHex,
  normalizeHex,
  onBrandColor,
  themeImageCss,
  type BackgroundScene,
  type BackgroundSceneId,
  type Theme,
  type ThemePresetId,
} from "@/lib/theme";

export function AppearanceScreen() {
  const {
    theme,
    applyPreset,
    setColor,
    setBorderStrength,
    setImage,
    setScene,
    resetTheme,
  } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const textOnCanvas = contrastRatio(theme.text, theme.background);
  const accentOnCanvas = contrastRatio(theme.accent, theme.background);
  const presetLabel =
    THEME_PRESETS.find((preset) => preset.id === theme.preset)?.label ??
    "Custom";
  const canvasLabel = theme.image
    ? "Upload"
    : (backgroundScene(theme.scene)?.label ?? "Flat colour");

  const pickImage = () => fileRef.current?.click();

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageError(null);
    setImageBusy(true);
    try {
      setImage(await themeImageFromFile(file));
    } catch (error) {
      setImageError(
        error instanceof Error ? error.message : "Could not use that image.",
      );
    } finally {
      setImageBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-[12px] font-semibold text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Overview
          </Link>
          <h1 className="mt-2 text-[27px] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[31px]">
            Appearance
          </h1>
          <p className="mt-2 max-w-[52ch] text-[12.5px] leading-relaxed text-muted">
            Set the canvas, text and accent. Every change applies immediately
            and is saved on this device.
          </p>
        </div>

        <button
          type="button"
          onClick={resetTheme}
          className="focus-ring glass-control inline-flex items-center gap-2 rounded-full border edge px-3.5 py-2 text-[12px] font-semibold text-ink/80 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset to Sky
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <section className="card-soft p-5" aria-labelledby="presets-heading">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="presets-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Presets
              </h2>
              <span className="chip px-2 py-0.5 text-[10px]">{presetLabel}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((preset) => {
                const active =
                  theme.preset === preset.id &&
                  theme.image === null &&
                  theme.background === preset.theme.background &&
                  theme.text === preset.theme.text &&
                  theme.accent === preset.theme.accent &&
                  theme.border === preset.theme.border &&
                  theme.borderStrength === preset.theme.borderStrength &&
                  theme.scene === preset.theme.scene;

                return (
                  <PresetOption
                    key={preset.id}
                    id={preset.id}
                    active={active}
                    theme={preset.theme}
                    label={preset.label}
                    description={preset.description}
                    onSelect={applyPreset}
                  />
                );
              })}
            </div>
          </section>

          <section className="card-soft p-5" aria-labelledby="backgrounds-heading">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="backgrounds-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Backgrounds
              </h2>
              <span className="chip px-2 py-0.5 text-[10px]">{canvasLabel}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {BACKGROUND_SCENES.map((scene) => (
                <SceneOption
                  key={scene.id}
                  scene={scene}
                  accent={theme.accent}
                  active={theme.scene === scene.id && theme.image === null}
                  onSelect={setScene}
                />
              ))}
            </div>

            <p className="mt-3 text-[10.5px] leading-relaxed text-muted">
              A background replaces any upload and keeps the colours above.
            </p>
          </section>

          <section className="card-soft p-5" aria-labelledby="colours-heading">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="colours-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Colours
              </h2>
              <span className="text-[10px] font-semibold text-muted">
                WCAG contrast
              </span>
            </div>

            <div className="mt-2 divide-y divide-line/70">
              <ColorRow
                label="Background"
                description="Canvas behind the glass."
                value={theme.background}
                contrast={textOnCanvas}
                contrastLabel="Text on background"
                onChange={(value) => setColor("background", value)}
              />
              <ColorRow
                label="Text"
                description="Headings and body copy."
                value={theme.text}
                contrast={textOnCanvas}
                contrastLabel="Text on background"
                onChange={(value) => setColor("text", value)}
              />
              <ColorRow
                label="Accent"
                description="Buttons, links and active states."
                value={theme.accent}
                contrast={accentOnCanvas}
                contrastLabel="Accent on background"
                onChange={(value) => setColor("accent", value)}
              />
            </div>

            <p className="mt-3 text-[10.5px] leading-relaxed text-muted">
              Muted text is mixed from your text and background colours. Button
              labels switch between light and dark to stay readable on the
              accent ({contrastRatio(onBrandColor(theme.accent), theme.accent).toFixed(2)}
              :1).
            </p>
          </section>

          <section className="card-soft p-5" aria-labelledby="borders-heading">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="borders-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Borders
              </h2>
              <span className="text-[10px] font-semibold text-muted">
                Cards, chips, controls
              </span>
            </div>

            <div className="mt-2 divide-y divide-line/70">
              <ColorRow
                label="Border"
                description="Rim around cards, chips and controls."
                value={theme.border}
                onChange={(value) => setColor("border", value)}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Border strength
                </p>
                <span className="text-[10.5px] font-semibold text-ink/70">
                  {theme.borderStrength}%
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={theme.borderStrength}
                onChange={(event) =>
                  setBorderStrength(Number(event.target.value))
                }
                aria-label="Border strength"
                aria-valuetext={`${theme.borderStrength} percent`}
                className="glass-range mt-2"
              />

              <div className="mt-1 flex justify-between text-[9.5px] text-muted">
                <span>None</span>
                <span>Subtle</span>
                <span>Strong</span>
              </div>

              <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                Drives the hairline on chips, controls and section rules.
                Card reflections and the borderless navigation panes are set
                by the glass style. At 0% the border is invisible.
              </p>
            </div>
          </section>

          <section className="card-soft p-5" aria-labelledby="image-heading">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="image-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
              >
                Upload image
              </h2>
              {theme.image ? (
                <span className="chip px-2 py-0.5 text-[10px]">Custom</span>
              ) : null}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <span
                aria-hidden="true"
                className="appearance-image-thumb"
                data-empty={!theme.image}
                style={
                  theme.image
                    ? { backgroundImage: `url("${theme.image}")` }
                    : undefined
                }
              >
                {theme.image ? null : (
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-ink">
                  {theme.image ? "Your upload is the canvas" : "No upload set"}
                </p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-muted">
                  JPG, PNG, WebP, AVIF or GIF up to{" "}
                  {MAX_THEME_IMAGE_BYTES / 1024 / 1024} MB. Resized to 1600px and
                  kept on this device only. Choosing a background above replaces
                  it.
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={pickImage}
                    disabled={imageBusy}
                    className="focus-ring glass-control inline-flex items-center gap-1.5 rounded-full border edge px-3 py-1.5 text-[11px] font-semibold text-ink/80 transition disabled:opacity-60"
                  >
                    {imageBusy ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {imageBusy
                      ? "Processing…"
                      : theme.image
                        ? "Replace image"
                        : "Upload image"}
                  </button>

                  {theme.image ? (
                    <button
                      type="button"
                      onClick={() => {
                        setImageError(null);
                        setImage(null);
                      }}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-muted transition hover:text-ink"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  ) : null}
                </div>

                {imageError ? (
                  <p role="alert" className="appearance-error">
                    {imageError}
                  </p>
                ) : null}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={onImageChange}
                />
              </div>
            </div>
          </section>

          <section className="card-soft p-5" aria-labelledby="glass-heading">
            <h2
              id="glass-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
            >
              Glass
            </h2>
            <div className="mt-1">
              <GlassLevelControl />
            </div>
          </section>
        </div>

        <div className="order-first self-start lg:order-none lg:col-span-7 lg:sticky lg:top-24">
          <Preview theme={theme} presetLabel={presetLabel} />
        </div>
      </div>
    </div>
  );
}

function PresetOption({
  id,
  active,
  theme,
  label,
  description,
  onSelect,
}: {
  id: ThemePresetId;
  active: boolean;
  theme: Theme;
  label: string;
  description: string;
  onSelect: (id: ThemePresetId) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(id)}
      className={
        active
          ? "focus-ring rounded-xl border border-brand bg-brand/[0.05] p-2 text-left ring-1 ring-brand/20"
          : "focus-ring glass-control rounded-xl border border-line p-2 text-left transition hover:border-brand/35"
      }
    >
      <span
        aria-hidden="true"
        className="relative block h-[58px] overflow-hidden rounded-lg border edge"
        style={{
          backgroundColor: theme.background,
          backgroundImage: themeImageCss(theme) ?? "none",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <span
          className="absolute left-2.5 top-2.5 h-1.5 w-9 rounded-full"
          style={{ backgroundColor: theme.text }}
        />
        <span
          className="absolute left-2.5 top-[18px] h-1.5 w-6 rounded-full opacity-60"
          style={{ backgroundColor: theme.text }}
        />
        <span
          className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />
        <span
          className="absolute bottom-2.5 left-5 h-2 w-7 rounded-full opacity-80"
          style={{ backgroundColor: theme.accent }}
        />
        {active ? (
          <span
            className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full"
            style={{
              backgroundColor: theme.accent,
              color: onBrandColor(theme.accent),
            }}
          >
            <Check className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>
      <span className="mt-2 block text-[12px] font-semibold text-ink">
        {label}
      </span>
      <span className="block text-[10px] leading-snug text-muted">
        {description}
      </span>
    </button>
  );
}

function SceneOption({
  scene,
  active,
  accent,
  onSelect,
}: {
  scene: BackgroundScene;
  active: boolean;
  accent: string;
  onSelect: (id: BackgroundSceneId) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(scene.id)}
      className={
        active
          ? "focus-ring rounded-xl border border-brand bg-brand/[0.05] p-2 text-left ring-1 ring-brand/20"
          : "focus-ring glass-control rounded-xl border border-line p-2 text-left transition hover:border-brand/35"
      }
    >
      <span
        aria-hidden="true"
        className="relative block h-[58px] overflow-hidden rounded-lg border edge"
        style={{
          backgroundColor: "var(--theme-canvas)",
          backgroundImage: `url("${scene.thumb}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {active ? (
          <span
            className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full"
            style={{
              backgroundColor: accent,
              color: onBrandColor(accent),
            }}
          >
            <Check className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>
      <span className="mt-2 block text-[12px] font-semibold text-ink">
        {scene.label}
      </span>
      <span className="block text-[10px] leading-snug text-muted">
        {scene.description}
      </span>
    </button>
  );
}

function ColorRow({
  label,
  description,
  value,
  contrast,
  contrastLabel = "Contrast",
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  contrast?: number;
  contrastLabel?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    setDraft(value);
  }, [value]);

  const valid = normalizeHex(draft) !== null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 first:pt-3">
      <label
        className="appearance-swatch focus-ring"
        style={{ backgroundColor: value }}
        aria-label={`${label} colour picker`}
      >
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} colour picker`}
        />
      </label>

      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="block text-[12.5px] font-semibold text-ink"
        >
          {label}
        </label>
        <p className="text-[10.5px] leading-snug text-muted">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={id}
          ref={inputRef}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const normalized = normalizeHex(next);
            if (normalized) onChange(normalized);
          }}
          onBlur={() => setDraft(valid ? (normalizeHex(draft) ?? value) : value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              inputRef.current?.blur();
            }
            if (event.key === "Escape") {
              setDraft(value);
              inputRef.current?.blur();
            }
          }}
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          aria-invalid={!valid}
          aria-label={`${label} hex value`}
          className="appearance-hex"
        />
        {contrast === undefined ? null : (
          <ContrastBadge ratio={contrast} label={contrastLabel} />
        )}
      </div>
    </div>
  );
}

function ContrastBadge({ ratio, label }: { ratio: number; label: string }) {
  const pass = meetsTextContrast(ratio);
  const rating = contrastRating(ratio);
  const Icon = pass ? ShieldCheck : ShieldAlert;

  return (
    <span
      className="contrast-badge"
      data-pass={pass}
      title={`${label}: ${ratio.toFixed(2)}:1 (${rating})`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span aria-hidden="true">{ratio.toFixed(2)}:1</span>
      <span className="sr-only">
        {label} contrast {ratio.toFixed(2)} to 1, {rating}
      </span>
    </span>
  );
}

function Preview({
  theme,
  presetLabel,
}: {
  theme: Theme;
  presetLabel: string;
}) {
  const muted = mixHex(theme.text, theme.background, 0.62);
  const ghostBorder = mixHex(theme.text, theme.background, 0.3);
  const onBrand = onBrandColor(theme.accent);
  const previewImage = themeImageCss(theme);

  return (
    <section className="card-soft overflow-hidden" aria-labelledby="preview-heading">
      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <h2
          id="preview-heading"
          className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          Live preview
        </h2>
        <span className="chip px-2 py-0.5 text-[10px]">{presetLabel}</span>
      </div>

      <div className="p-4 sm:p-5">
        <div
          className="appearance-preview"
          data-canvas={canvasMode(theme)}
          style={
            {
              "--preview-canvas": theme.background,
              ...(previewImage ? { backgroundImage: previewImage } : {}),
            } as React.CSSProperties
          }
        >
          <div className="appearance-preview-wash" aria-hidden="true" />

          <div className="relative p-3.5 sm:p-4">
            <div className="glass glass-bar flex h-12 items-center gap-2 rounded-2xl px-3">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[9px] font-bold"
                style={{ backgroundColor: theme.accent, color: onBrand }}
              >
                D
              </span>
              <span className="hidden text-[11px] font-semibold text-ink sm:block">
                Overview
              </span>
              <span className="hidden text-[11px] text-muted sm:block">
                Sales
              </span>
              <span className="hidden text-[11px] text-muted sm:block">
                Stock
              </span>
              <span
                className="ml-auto grid h-6 w-6 place-items-center rounded-full text-[8px] font-bold"
                style={{ backgroundColor: theme.accent, color: onBrand }}
              >
                IM
              </span>
            </div>

            <div className="card-kpi mt-3 rounded-[20px] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                Net sales
              </p>
              <p className="num mt-1 text-[24px] font-semibold leading-none text-ink">
                166,100{" "}
                <span className="text-[11px] font-medium text-muted">RWF</span>
              </p>
              <div className="mt-3 flex items-center gap-3 text-[10.5px]">
                <span className="font-semibold" style={{ color: theme.accent }}>
                  +12.4%
                </span>
                <span style={{ color: muted }}>27 transactions</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="card-soft p-3">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Heading
                </p>
                <p className="mt-1 text-[13px] font-semibold text-ink">
                  Kivu Market
                </p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-muted">
                  Body copy sits on the same glass pane.
                </p>
              </div>

              <div className="card-soft flex flex-col justify-between gap-2 p-3">
                <p className="text-[10.5px] leading-snug text-muted">
                  Buttons and links use the accent.
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="rounded-full px-2.5 py-1.5 text-[10.5px] font-semibold"
                    style={{ backgroundColor: theme.accent, color: onBrand }}
                  >
                    New sale
                  </span>
                  <span
                    className="rounded-full border px-2.5 py-1.5 text-[10.5px] font-semibold"
                    style={{ borderColor: ghostBorder, color: theme.text }}
                  >
                    Report
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
              <span
                className="rounded-full px-2 py-1 font-semibold"
                style={{
                  backgroundColor: "rgb(255 255 255 / 0.5)",
                  color: theme.text,
                }}
              >
                Muted chip
              </span>
              <span style={{ color: muted }}>Caption text at 10.5px</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[10.5px] leading-relaxed text-muted">
          Preview uses the real glass surfaces, so material, text contrast and
          accent buttons are judged together.
        </p>
      </div>
    </section>
  );
}
