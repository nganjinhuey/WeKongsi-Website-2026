import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * One image treatment for the whole site, so photographs read as a set rather than as
 * whatever each section happened to do.
 *
 * `alt` defaults to "" because most of these are decorative — they illustrate copy that
 * already says the thing. Pass a real alt only when the image carries information the
 * text does not (a person's face, a logo). An empty alt is the correct, accessible
 * choice for decoration; a described-twice image is noise for a screen reader.
 */
export function Media({
  src,
  alt = "",
  ratio = "4/3",
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  rounded = "brand",
  tint = false,
}: {
  src: string;
  alt?: string;
  ratio?: "4/3" | "3/2" | "16/9" | "1/1" | "3/4" | "5/4";
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: "brand" | "brand-lg" | "full";
  /** Lays a faint brand wash over the photo, for images sitting on deep sections. */
  tint?: boolean;
}) {
  const ratios = {
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-[16/9]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "5/4": "aspect-[5/4]",
  } as const;

  const radius = {
    brand: "rounded-card",
    "brand-lg": "rounded-xl2",
    full: "rounded-full",
  } as const;

  return (
    <div className={cn("relative overflow-hidden bg-mint-soft", ratios[ratio], radius[rounded], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
      {tint && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-deep/25 mix-blend-multiply"
        />
      )}
    </div>
  );
}

/**
 * A small stack of overlapping photos — used where a section needs visual weight but only
 * has room for one column. The offsets are deliberate rather than random so the stack
 * reads as composed.
 */
export function MediaStack({
  images,
  className,
}: {
  images: { src: string; alt?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Media
        src={images[0].src}
        alt={images[0].alt}
        ratio="4/3"
        rounded="brand-lg"
        className="shadow-lift"
        sizes="(max-width: 1024px) 90vw, 46vw"
      />
      {images[1] && (
        <Media
          src={images[1].src}
          alt={images[1].alt}
          ratio="1/1"
          rounded="brand"
          sizes="200px"
          className="absolute -bottom-8 -left-6 w-32 border-4 border-white shadow-float sm:w-44 lg:-left-10"
        />
      )}
      {images[2] && (
        <Media
          src={images[2].src}
          alt={images[2].alt}
          ratio="1/1"
          rounded="brand"
          sizes="160px"
          className="absolute -right-4 -top-6 w-24 border-4 border-white shadow-float sm:w-32"
        />
      )}
    </div>
  );
}
