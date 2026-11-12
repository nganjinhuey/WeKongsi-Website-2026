"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** A translation string using the normalised markers: `[[accent]]`, `**bold**`, `\n`. */
  children: string;
  className?: string;
  /** Classes applied to `[[...]]` spans. Defaults to the brand gradient text. */
  accentClassName?: string;
  as?: React.ElementType;
};

const ACCENT_OR_BOLD = /(\[\[[\s\S]*?\]\]|\*\*[\s\S]*?\*\*)/g;

/**
 * Renders the inline markers the translation build produces, so copy keeps its emphasis
 * without any call site reaching for dangerouslySetInnerHTML. Unknown text passes through
 * untouched, which means a translator who omits the markers still gets valid output.
 */
export default function RichText({
  children,
  className,
  accentClassName = "bg-grad-accent bg-clip-text text-transparent",
  as: Tag = "span",
}: Props) {
  const lines = children.split("\n");

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(ACCENT_OR_BOLD).map((part, partIndex) => {
            if (part.startsWith("[[") && part.endsWith("]]")) {
              return (
                <span key={partIndex} className={cn(accentClassName)}>
                  {part.slice(2, -2)}
                </span>
              );
            }
            if (part.startsWith("**") && part.endsWith("**")) {
              /**
               * `ink-1`, not `text-deep`. Emphasis means "a step more emphatic than the
               * body ink around it", which is petrol on a light band and white on a dark
               * one — the same value `text-deep` carried, now read from whichever band
               * scope encloses it. Hard-coded, a bold phrase on a dark panel was petrol
               * on petrol and simply did not render.
               */
              return (
                <strong key={partIndex} className="font-semibold ink-1">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={partIndex}>{part}</React.Fragment>;
          })}
        </React.Fragment>
      ))}
    </Tag>
  );
}
