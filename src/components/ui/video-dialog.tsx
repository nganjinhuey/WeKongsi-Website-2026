"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Turn any YouTube watch / share / shorts URL into a privacy-mode embed URL,
 * carrying over a `t=` start offset so a story that begins part-way through the
 * recording opens at the moment it was shared from.
 *
 * Returns null for anything it cannot read as a YouTube video, so a bad link
 * renders no player rather than an empty black box.
 */
export function youtubeEmbed(url: string): string | null {
  let id = "";
  let start = 0;

  try {
    const u = new URL(url);
    if (
      !/(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(u.hostname)
    )
      return null;

    if (u.hostname.endsWith("youtu.be")) id = u.pathname.slice(1);
    else if (u.pathname === "/watch") id = u.searchParams.get("v") ?? "";
    else if (u.pathname.startsWith("/embed/"))
      id = u.pathname.slice("/embed/".length);
    else if (u.pathname.startsWith("/shorts/"))
      id = u.pathname.slice("/shorts/".length);

    const stamp = (
      u.searchParams.get("t") ??
      u.searchParams.get("start") ??
      ""
    ).trim();
    const parts = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(stamp);
    if (parts) {
      start =
        Number(parts[1] ?? 0) * 3600 +
        Number(parts[2] ?? 0) * 60 +
        Number(parts[3] ?? 0);
    }
  } catch {
    return null;
  }

  if (!/^[\w-]{6,20}$/.test(id)) return null;

  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  if (start > 0) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

/**
 * Lightbox player for a member's video story.
 *
 * Controlled from the caller so one dialog serves a whole carousel: the iframe only
 * exists while a video is open, which keeps ten cards from loading ten players.
 */
export default function VideoDialog({
  url,
  title,
  closeLabel,
  portrait = false,
  onClose,
}: {
  /** The member's video URL, or null when nothing is playing. */
  url: string | null;
  title: string;
  closeLabel: string;
  /** The recording is vertical, so the frame follows it instead of pillarboxing it. */
  portrait?: boolean;
  onClose: () => void;
}) {
  const src = url ? youtubeEmbed(url) : null;

  return (
    <Dialog.Root
      open={Boolean(src)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-deep-deeper/85 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[80] flex -translate-x-1/2 -translate-y-1/2 flex-col gap-3 focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95",
            portrait
              ? "w-[min(100vw-2rem,calc(76vh*9/16))]"
              : "w-[min(100vw-2rem,1040px)]",
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>

          <Dialog.Close className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full bg-white/10 text-white ring-1 ring-white/25 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <X className="h-5 w-5" />
            <span className="sr-only">{closeLabel}</span>
          </Dialog.Close>

          <div
            className={cn(
              "w-full overflow-hidden rounded-xl2 bg-black shadow-float",
              portrait ? "aspect-[9/16]" : "aspect-video",
            )}
          >
            {src && (
              <iframe
                src={src}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
