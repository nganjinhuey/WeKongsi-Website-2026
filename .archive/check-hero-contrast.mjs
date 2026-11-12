/**
 * Proves the homepage hero's copy stays legible over the photograph.
 *
 * "Is white text readable on a photo?" is a measurement, and the answer changes with
 * viewport width: object-fit: cover re-crops the image, sliding bright window light
 * around behind the words. This reconstructs exactly what the browser composites — the
 * photo under object-fit: cover at the breakpoint's object-position, then the scrim
 * stack from src/lib/hero-scrim.js — and checks the WORST pixel anywhere the copy can
 * sit against the WCAG 2.1 AA ratio for that text size.
 *
 *   node scripts/check-hero-contrast.mjs          # pass/fail
 *   node scripts/check-hero-contrast.mjs --map    # + an ASCII contrast map per width
 *
 * No browser and no running server: it reads public/images/hero.jpg directly, so it is
 * deterministic and safe to run in CI.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { decodePng, contrast, blend } from "./lib/png.mjs";
import {
  OBJECT_POSITION,
  SCRIM_NARROW,
  SCRIM_VERTICAL,
  SCRIM_WIDE,
  SCRIM_RGB,
  SCRIM_BREAKPOINT,
  OBJECT_POSITION_BREAKPOINT,
  HERO_ACCENT_RGB,
} from "../src/lib/hero-scrim.js";

const SHOW_MAP = process.argv.includes("--map");

/** Viewport widths worth checking: each Tailwind breakpoint, plus the extremes. */
const WIDTHS = [360, 390, 500, 640, 768, 900, 1024, 1280, 1440, 1600, 1920, 2560];

/**
 * The hero's height is content-driven and varies with language, so rather than assume
 * one value we sweep a generous range and keep the worst result. A height that makes the
 * crop worse is exactly the case a fixed guess would miss.
 */
const HEIGHTS = [520, 620, 720, 820, 920, 1040];

/** Tailwind container: centred, capped at the largest breakpoint <= viewport (2xl = 1280). */
const containerWidth = (vw) => {
  if (vw >= 1280) return 1280;
  if (vw >= 1024) return 1024;
  if (vw >= 768) return 768;
  if (vw >= 640) return 640;
  return vw;
};
const containerPadding = (vw) => (vw >= 1024 ? 32 : vw >= 640 ? 24 : 16);

/**
 * Copy column width per breakpoint, mirroring Hero.tsx
 * (`max-w-xl lg:max-w-lg xl:max-w-2xl`). These are chosen so the column's right edge
 * stays left of ~55% of the viewport at every width, which is what the wide scrim's
 * falloff assumes.
 */
const columnWidth = (vw) => (vw >= 1280 ? 672 : vw >= 1024 ? 512 : 576);

/** Section padding around the copy — pt-20 / lg:pt-28 / xl:pt-32, pb-36 / sm:pb-40 / lg:pb-44. */
const padTop = (vw) => (vw >= 1280 ? 128 : vw >= 1024 ? 112 : 80);
const padBottom = (vw) => (vw >= 1024 ? 176 : vw >= 640 ? 160 : 144);

const objectPosition = (vw) =>
  vw >= OBJECT_POSITION_BREAKPOINT
    ? OBJECT_POSITION.lg
    : vw >= 640
      ? OBJECT_POSITION.sm
      : OBJECT_POSITION.base;

/**
 * Foregrounds as authored in Hero.tsx, with the WCAG AA ratio each must clear.
 * Large text (>=24px, or >=18.66px bold) needs 3:1; everything else 4.5:1.
 * The accent uses the DARKER stop of the brand gradient — the worse of its two ends.
 * text-shadow is ignored: it helps real readers, but WCAG gives it no credit.
 */
const FOREGROUNDS = [
  { name: "eyebrow", rgb: HERO_ACCENT_RGB, alpha: 1, need: 4.5 },
  { name: "headline", rgb: [255, 255, 255], alpha: 1, need: 3 },
  { name: "headline accent", rgb: HERO_ACCENT_RGB, alpha: 1, need: 3 },
  { name: "body", rgb: [255, 255, 255], alpha: 0.85, need: 4.5 },
  { name: "pills", rgb: [255, 255, 255], alpha: 0.9, need: 4.5 },
];

/**
 * Alpha of a CSS linear-gradient at a point.
 *
 * CSS angles run clockwise from "to top", so the gradient direction in screen space
 * (y pointing down) is (sin A, -cos A), and the gradient line spans
 * |W·sin A| + |H·cos A| through the box centre. Every stop shares one RGB, so alpha
 * interpolates linearly — premultiplication would change nothing here.
 */
function gradientAlpha({ angle, stops }, x, y, w, h) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const length = Math.abs(w * dx) + Math.abs(h * dy);
  if (length === 0) return stops[0].a;

  const t = ((x - w / 2) * dx + (y - h / 2) * dy) / length + 0.5;
  const p = Math.min(1, Math.max(0, t)) * 100;

  if (p <= stops[0].pos) return stops[0].a;
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i].pos) {
      const a = stops[i - 1];
      const b = stops[i];
      const f = b.pos === a.pos ? 0 : (p - a.pos) / (b.pos - a.pos);
      return a.a + (b.a - a.a) * f;
    }
  }
  return stops[stops.length - 1].a;
}

/** Decode the hero photo once, via a temporary PNG (Node has no JPEG decoder). */
function loadHero() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hero-px-"));
  try {
    const png = path.join(tmp, "hero.png");
    execFileSync("sips", ["-s", "format", "png", "public/images/hero.jpg", "--out", png], {
      stdio: "ignore",
    });
    return decodePng(fs.readFileSync(png));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const hero = loadHero();

/** Composited background colour at a point in the hero box. */
function backgroundAt(x, y, vw, vh) {
  // object-fit: cover
  const scale = Math.max(vw / hero.width, vh / hero.height);
  const drawW = hero.width * scale;
  const drawH = hero.height * scale;
  const offsetX = (vw - drawW) * objectPosition(vw);
  const offsetY = (vh - drawH) * 0.5;

  const sx = Math.min(hero.width - 1, Math.max(0, Math.round((x - offsetX) / scale)));
  const sy = Math.min(hero.height - 1, Math.max(0, Math.round((y - offsetY) / scale)));

  let colour = hero.at(sx, sy);

  // Scrims paint over the photo in DOM order: breakpoint scrim, then the vertical wash.
  const breakpointScrim = vw >= SCRIM_BREAKPOINT ? SCRIM_WIDE : SCRIM_NARROW;
  colour = blend(SCRIM_RGB, colour, gradientAlpha(breakpointScrim, x, y, vw, vh));
  colour = blend(SCRIM_RGB, colour, gradientAlpha(SCRIM_VERTICAL, x, y, vw, vh));

  return colour;
}

const results = [];
let failures = 0;

for (const vw of WIDTHS) {
  const left = Math.round((vw - containerWidth(vw)) / 2) + containerPadding(vw);
  const right = Math.min(vw, left + columnWidth(vw));

  const worst = new Map(FOREGROUNDS.map((f) => [f.name, { ratio: Infinity, at: null }]));

  for (const vh of HEIGHTS) {
    const top = padTop(vw);
    const bottom = Math.max(top + 40, vh - padBottom(vw));

    for (let y = top; y <= bottom; y += 4) {
      for (let x = left; x <= right; x += 4) {
        const bg = backgroundAt(x, y, vw, vh);
        for (const fg of FOREGROUNDS) {
          const colour = fg.alpha < 1 ? blend(fg.rgb, bg, fg.alpha) : fg.rgb;
          const ratio = contrast(colour, bg);
          const record = worst.get(fg.name);
          if (ratio < record.ratio) {
            record.ratio = ratio;
            record.at = { x, y, vh, bg };
          }
        }
      }
    }
  }

  const row = { vw, entries: [] };
  for (const fg of FOREGROUNDS) {
    const { ratio, at } = worst.get(fg.name);
    const ok = ratio >= fg.need;
    if (!ok) failures++;
    row.entries.push({ name: fg.name, ratio, need: fg.need, ok, at });
  }
  results.push(row);
}

for (const { vw, entries } of results) {
  const mode = vw >= SCRIM_BREAKPOINT ? "wide scrim " : "narrow scrim";
  console.log(`\n  ${String(vw).padStart(4)}px  ${mode}`);
  for (const e of entries) {
    const detail = e.ok
      ? ""
      : `  ← worst at x=${e.at.x} y=${e.at.y} (h=${e.at.vh}) bg=rgb(${e.at.bg.join(",")})`;
    console.log(
      `      ${e.ok ? "✓" : "✗"} ${e.name.padEnd(16)} ${e.ratio.toFixed(2)}:1  needs ${e.need}:1${detail}`,
    );
  }
}

if (SHOW_MAP) {
  console.log("\n  Contrast of body text across the copy column (rows = y, cols = x):");
  console.log("    · >=7  + >=4.5  - >=3  ! below 3\n");
  for (const vw of [390, 1024, 1440, 1920]) {
    const vh = 720;
    const left = Math.round((vw - containerWidth(vw)) / 2) + containerPadding(vw);
    const right = Math.min(vw, left + columnWidth(vw));
    console.log(`    ${vw}px`);
    for (let y = padTop(vw); y < vh - padBottom(vw); y += 40) {
      let line = "      ";
      for (let x = left; x < right; x += 16) {
        const bg = backgroundAt(x, y, vw, vh);
        const r = contrast(blend([255, 255, 255], bg, 0.85), bg);
        line += r >= 7 ? "·" : r >= 4.5 ? "+" : r >= 3 ? "-" : "!";
      }
      console.log(line);
    }
  }
}

/**
 * Solid-fill controls.
 *
 * The gate above only watches text over the photograph, which once left the page's most
 * important control unwatched. The EASY redesign put dark ink (#03121B) on the bright
 * accent pill instead of white, which is what finally cleared this: white on the same
 * gradient measured 2.56–3.23:1 and failed at every size for the life of the old palette.
 * These are hard failures now — there is no longer an exception to grandfather.
 */
const SOLID_FILLS = [
  { name: "primary pill (light stop)", fill: [0x0a, 0xe6, 0xd2], fg: [0x03, 0x12, 0x1b], need: 4.5 },
  { name: "primary pill (dark stop)", fill: [0x00, 0xc9, 0xb8], fg: [0x03, 0x12, 0x1b], need: 4.5 },
  { name: "deep button", fill: [0x07, 0x13, 0x3f], fg: [255, 255, 255], need: 4.5 },
];

console.log("\n  Solid-fill controls");
for (const f of SOLID_FILLS) {
  const ratio = contrast(f.fg, f.fill);
  const ok = ratio >= f.need;
  console.log(`      ${ok ? "✓" : "✗"} ${f.name.padEnd(26)} ${ratio.toFixed(2)}:1  needs ${f.need}:1`);
  if (!ok) failures++;
}

if (failures) {
  console.error(`\n✗ ${failures} hero contrast failure(s) — see above.`);
  process.exit(1);
}
console.log(
  `\n✓ hero copy clears WCAG AA at every sampled pixel — ` +
    `${WIDTHS.length} widths × ${HEIGHTS.length} heights × ${FOREGROUNDS.length} text roles`,
);
