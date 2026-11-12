/**
 * The hero's background treatment, defined once.
 *
 * Hero.tsx renders these as CSS; scripts/check-hero-contrast.mjs evaluates the very same
 * numbers to prove the text stays legible over the photograph. Keeping one definition is
 * the point — a scrim tuned in the component but not in the checker would pass a gate
 * that no longer describes the page.
 *
 * Plain .js (not .ts) so the Node checker can import it directly without a build step.
 */

/**
 * The deep teal the scrims are built from (#021A18), matched to the dark bands.
 *
 * Green carries far more luminance than blue, so a teal at the old navy's hex darkness
 * would read lighter and cost contrast over the photograph. This is the teal that
 * measures as dark as the navy it replaced.
 */
export const SCRIM_RGB = [2, 26, 24];

/**
 * Horizontal focal point of the photograph, as a CSS object-position percentage.
 * The family sits centre-right; as the viewport narrows, object-fit: cover crops the
 * sides, so the focal point shifts right to keep them in frame.
 */
export const OBJECT_POSITION = {
  base: 0.72, // < 640px
  sm: 0.68, // >= 640px
  lg: 0.5, // >= 1024px
};

/**
 * Width at which the scrim switches from a uniform dim to a left-weighted ramp (`lg`).
 *
 * The copy column is sized per breakpoint (see Hero.tsx) so that its right edge never
 * passes ~55% of the viewport at any width. That is what lets this ramp hold full
 * strength to 56% and then fall away sharply: the family begins around 57%, so the
 * father's face and everything right of it stay essentially unlit by the scrim.
 */
export const SCRIM_BREAKPOINT = 1024;

/** Width at which object-position stops chasing the family and settles on centre (`lg`). */
export const OBJECT_POSITION_BREAKPOINT = 1024;

/**
 * Stops are {pos, a} — position along the gradient line in percent, and the scrim's
 * alpha there. Every stop shares SCRIM_RGB, which means CSS's premultiplied-alpha
 * interpolation and a plain alpha lerp give identical results; the checker relies on that.
 */

/**
 * Hero foreground colours.
 *
 * EASY's turquoise (#00D6C4). Bright enough to clear 4.5:1 over the dimmed photograph,
 * which the previous mid-luminance teal (#5fb0a0) could not at any scrim strength.
 * Darker ramp stops are still used where accents sit on white.
 */
export const HERO_ACCENT = "#00d6c4";
export const HERO_ACCENT_RGB = [0, 214, 196];

/**
 * Below `lg` the copy spans the frame, so the whole image is dimmed evenly. Kept as light
 * as the contrast gate allows: dim it much further and the top of the hero — the first
 * thing a phone shows — stops reading as a photograph and becomes a flat teal panel.
 */
export const SCRIM_NARROW = {
  angle: 180,
  stops: [
    { pos: 0, a: 0.84 },
    { pos: 45, a: 0.79 },
    { pos: 70, a: 0.75 },
    { pos: 100, a: 0.85 },
  ],
};

/** From `xl` there is room to the right of the copy, so the scrim ramps off into it. */
export const SCRIM_WIDE = {
  angle: 96,
  stops: [
    { pos: 0, a: 0.82 },
    { pos: 40, a: 0.81 },
    { pos: 56, a: 0.78 },
    { pos: 64, a: 0.38 },
    { pos: 71, a: 0.1 },
    { pos: 78, a: 0.01 },
    { pos: 86, a: 0 },
    { pos: 100, a: 0 },
  ],
};

/** Applied at every size: lifts the accent off the window light, seats the stats card. */
export const SCRIM_VERTICAL = {
  angle: 180,
  stops: [
    { pos: 0, a: 0.2 },
    { pos: 18, a: 0 },
    { pos: 58, a: 0 },
    { pos: 100, a: 0.24 },
  ],
};

/** Serialises a gradient to the CSS the component renders. */
export function toCss({ angle, stops }) {
  const parts = stops.map(
    ({ pos, a }) => `rgba(${SCRIM_RGB[0]},${SCRIM_RGB[1]},${SCRIM_RGB[2]},${a}) ${pos}%`,
  );
  return `linear-gradient(${angle}deg, ${parts.join(", ")})`;
}
