"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { type SharingReport, MONTH_SHORT } from "@/data/sharing-reports";

export type Measure = "cost" | "cases";

/** One hue, because one series. A second measure would need a second chart, not a
 *  second axis — and the two teals that read as a pair here fail the chroma floor. */
const SERIES = "#087F7A";
const GRID = "#E3EFE9";
const SURFACE = "#ffffff";

const value = (r: SharingReport, m: Measure) => (m === "cost" ? r.cost : r.cases);

/**
 * The axis ceiling: the smallest round number above the peak.
 *
 * The step list is finer than the usual 1 / 2 / 5 / 10 because this data sits badly
 * on it — a peak of RM560K has nothing between 500K and 1M, so the line was drawn
 * into the bottom half of a plot that was 44% empty. Every step here still divides
 * cleanly into the four gridlines.
 */
function niceCeil(n: number) {
  if (n <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(n));
  for (const step of [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10]) {
    if (step * pow >= n) return step * pow;
  }
  return 10 * pow;
}

function compact(n: number, m: Measure) {
  if (m !== "cost") return n.toLocaleString("en-MY");
  if (n >= 1_000_000) return `RM${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `RM${Math.round(n / 1_000)}K`;
  return `RM${n}`;
}

const full = (n: number, m: Measure) =>
  m === "cost"
    ? `RM${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : n.toLocaleString("en-MY");

/**
 * Monthly sharing as a line — a trajectory over time, one measure at a time.
 *
 * It was columns, and a column chart answers "how big was August" when the question a
 * reader actually brings to a three-year record is "which way is this going". A line
 * says that in one shape; thirty-eight bars make the eye reconstruct it.
 *
 * Deliberately still not a dual-axis chart: cost runs to six figures and cases to two,
 * and putting both on one plot would invent a correlation by choosing where the scales
 * line up. The measure switch changes what is plotted instead.
 *
 * No marker per point. At this density they would read as beads on a string and
 * collide below three columns; the crosshair plus one travelling dot is what makes a
 * month readable, and the hit targets are full-height bands so the pointer never has
 * to find a 2px stroke. The last point keeps a resting marker, because "where it ends"
 * is the one value the chart is read for.
 *
 * Drawn at the container's real pixel width rather than scaled from a fixed viewBox,
 * so the axis text stays at its intended size on a phone instead of shrinking with
 * the artboard.
 */
export default function SharingChart({
  rows,
  measure,
  label,
}: {
  rows: SharingReport[];
  measure: Measure;
  /** Names what is plotted — a one-series chart needs no legend box. */
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const [width, setWidth] = useState(880);
  const [hover, setHover] = useState<number | null>(null);

  const measureWidth = useCallback(() => {
    if (wrapRef.current) setWidth(Math.max(320, wrapRef.current.clientWidth));
  }, []);

  useEffect(() => {
    measureWidth();
    const ro = new ResizeObserver(measureWidth);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measureWidth]);

  const H = 340;
  // left gutter sized to the widest tick the cost scale produces ("RM750K")
  const PAD = { top: 26, right: 16, bottom: 34, left: 64 };
  const plotW = Math.max(40, width - PAD.left - PAD.right);
  const plotH = H - PAD.top - PAD.bottom;

  const max = niceCeil(Math.max(...rows.map((r) => value(r, measure)), 1));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);

  /* Points sit on the plot edges rather than in band centres: a line is read as a
     path between dates, so the first and last months belong at the ends of the axis,
     not inset by half a column. */
  const step = rows.length > 1 ? plotW / (rows.length - 1) : 0;
  const x = (i: number) => PAD.left + (rows.length > 1 ? step * i : plotW / 2);
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;

  const line = rows.map((r, i) => `${i ? "L" : "M"}${x(i)},${y(value(r, measure))}`).join(" ");
  const area = `${line} L${x(rows.length - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z`;

  const last = rows.length - 1;
  const active = hover ?? last;
  const activeRow = rows[active];

  /* The month axis labels itself every Nth point, and ALWAYS labels the last one —
     "where does it end" is the question the chart is read for, and a stride that
     happens not to land on the final month left it unlabelled. Any regular tick that
     would crowd the last one is dropped instead of overlapping it. */
  const every = Math.max(1, Math.ceil(rows.length / (width < 560 ? 4 : 9)));
  /* The guard is in pixels, not in index steps: a stride of three months is 163px
     apart at desktop width and 34px apart on a phone, so counting months drops the
     wrong one. "Oct 26" sets the floor at roughly 52px. */
  const labelled = new Set<number>([last]);
  for (let i = 0; i < rows.length; i += every) {
    if (x(last) - x(i) >= 52) labelled.add(i);
  }

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    const i = Math.round((px - PAD.left) / (step || 1));
    setHover(Math.min(rows.length - 1, Math.max(0, i)));
  };

  return (
    <div ref={wrapRef} className="relative">
      <svg
        width={width}
        height={H}
        role="img"
        aria-label={label}
        className="block"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity={0.22} />
            <stop offset="100%" stopColor={SERIES} stopOpacity={0} />
          </linearGradient>
        </defs>

        {ticks.map((tv) => (
          <g key={tv}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(tv)}
              y2={y(tv)}
              stroke={GRID}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={y(tv) + 4}
              textAnchor="end"
              className="fill-ink-3 text-[11px]"
            >
              {compact(Math.round(tv), measure)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={SERIES}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* The month axis. Drawn after the line so its labels sit over the area wash. */}
        {rows.map((r, i) =>
          labelled.has(i) ? (
            <text
              key={r.id}
              x={Math.min(Math.max(x(i), PAD.left + 18), width - 20)}
              y={H - 12}
              textAnchor="middle"
              className="fill-ink-3 text-[10.5px]"
            >
              {MONTH_SHORT[r.month]} {String(r.year).slice(2)}
            </text>
          ) : null,
        )}

        {/* Resting marker on the last month — where the record stands today. */}
        {rows.length > 0 && hover === null && (
          <circle
            cx={x(last)}
            cy={y(value(rows[last], measure))}
            r={5}
            fill={SERIES}
            stroke={SURFACE}
            strokeWidth={2.5}
          />
        )}

        {activeRow && hover !== null && (
          <g pointerEvents="none">
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke={SERIES}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <circle
              cx={x(active)}
              cy={y(value(activeRow, measure))}
              r={6}
              fill={SERIES}
              stroke={SURFACE}
              strokeWidth={2.5}
            />
          </g>
        )}

        {/* One direct label — the month being read, never a number on every point. */}
        {activeRow && (
          <text
            x={Math.min(Math.max(x(active), PAD.left + 30), width - PAD.right - 30)}
            y={Math.max(16, y(value(activeRow, measure)) - 13)}
            textAnchor="middle"
            className="fill-deep text-[11.5px] font-semibold"
            stroke={SURFACE}
            strokeWidth={3}
            paintOrder="stroke"
            pointerEvents="none"
          >
            {compact(value(activeRow, measure), measure)}
          </text>
        )}
      </svg>

      {activeRow && (
        <p className="mt-2 text-center text-[13px] text-ink-2">
          <span className="font-semibold text-deep">
            {MONTH_SHORT[activeRow.month]} {activeRow.year}
          </span>{" "}
          · {label}: {full(value(activeRow, measure), measure)}
        </p>
      )}
    </div>
  );
}
