import React from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A slot for a photograph we do not have yet.
 *
 * Deliberately not a grey box and deliberately not a stock photo. It carries the
 * Tidewater wash so the layout reads at the right weight, a dashed edge and a plain
 * description of what belongs here — so in review it is obvious that something is
 * missing, rather than looking like a finished panel nobody thought to replace.
 *
 * `aria-hidden` on the icon only; the description stays in the accessibility tree,
 * because a screen-reader user should also know this is a gap and not a picture.
 */
export default function ImagePlaceholder({
  label,
  ratio = "aspect-[4/3]",
  className,
}: {
  /** What should eventually go here, in plain words. Comes from a translation key. */
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ph-tile relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl2 border border-dashed border-teal-deep/35 px-6 text-center",
        ratio,
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-card bg-white/80 text-teal-ink shadow-tide">
        <ImageIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="max-w-[34ch] text-[13.5px] font-medium leading-snug text-teal-ink">{label}</p>
    </div>
  );
}
