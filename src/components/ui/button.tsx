"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Pill buttons, Tidewater.
 *
 * The primary variant is white on an ocean-teal gradient. That pairing is only legal
 * because both stops are dark enough to carry it — #0A8078 is 4.80:1 and #066B66 is
 * 6.0:1 — which is why `grad-pill` runs mid-to-deep rather than through the brand's
 * bright turquoise. Turquoise would put the label at 2.9:1 and could not be used.
 *
 * The glow is a single soft ocean-teal shadow, not a halo: it exists to mark which of
 * two pills is the primary one, and disappears on the outline variant entirely.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-pill font-sans font-semibold transition-[transform,box-shadow,filter,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-deep focus-visible:ring-offset-4 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-grad-pill text-white font-semibold shadow-glow-sm hover:-translate-y-0.5 hover:shadow-glow",
        deep: "bg-deep text-white hover:bg-teal-ink hover:-translate-y-0.5",
        /**
         * Fills on hover rather than only tinting. The label is `teal-ink`, not the
         * ocean teal of the border: this pill sits on the hero wash, and at 60–90%
         * white the effective ground measured ~#EEF5F8, where ocean teal is 4.43:1.
         * The deeper step holds ~6.9:1 whatever the wash does underneath it.
         */
        outline:
          "border-[1.5px] border-teal-deep bg-white/75 text-teal-ink backdrop-blur-sm hover:bg-teal-deep hover:text-white",
        /** For dark bands: a glass pill that reads against the deep→green gradient. */
        ghostLight:
          "border border-white/20 bg-white/[0.08] text-white backdrop-blur-md hover:bg-white/[0.14] hover:border-white/35",
        /**
         * The solid counterpart to `ghostLight`, for the one action on a dark card
         * that has to carry it. `primary` is a dark teal gradient and sits too close
         * to a petrol ground to read as the action at all. Ink is `on-accent`, which
         * measures 9.81:1 on this fill and 11.09:1 on the hover step — white would be
         * 2.0:1.
         */
        accent:
          "bg-turq-light text-on-accent shadow-glow-sm hover:bg-turq-glow hover:-translate-y-0.5 hover:shadow-glow",
        link: "text-teal-deep underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-[42px] px-5 text-sm",
        default: "min-h-[52px] px-7 text-[15.5px]",
        lg: "min-h-[58px] px-[30px] text-base sm:text-[16.5px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
