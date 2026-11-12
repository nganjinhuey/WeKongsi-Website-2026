import React from "react";

/**
 * Atmosphere for the Shariah certification band.
 *
 * No shapes: the earlier ribbons and hairlines read as decoration sitting on top of a
 * gradient rather than as one considered surface. This is tonal instead — overlapping
 * soft radial fields that deepen the deep at the edges and warm the centre toward teal,
 * plus a faint grain so the large flat areas do not band on wide displays.
 *
 * Everything here is capped low on purpose. The copy over it is measured against WCAG AA
 * and the tightest caption has barely any headroom, so brightening the ground is the one
 * change that would break it.
 */
export default function TrustBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Tonal fields. Large, heavily feathered, and overlapping so the transitions read
          as lighting rather than as separate washes. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(1200px 620px at 50% 8%, rgba(0,214,196,.10), transparent 70%)",
            "radial-gradient(900px 700px at 8% 100%, rgba(10,85,64,.38), transparent 72%)",
            "radial-gradient(1000px 760px at 96% 86%, rgba(6,70,72,.34), transparent 70%)",
            "radial-gradient(1100px 820px at 0% 0%, rgba(4,16,44,.55), transparent 72%)",
            "radial-gradient(1000px 760px at 100% 0%, rgba(4,16,44,.45), transparent 70%)",
          ].join(","),
        }}
      />

      {/* One restrained pool of light where the headline and badge sit — the single place
          the eye should settle. */}
      <div className="absolute left-1/2 top-[14%] h-[380px] w-[720px] -translate-x-1/2 rounded-[50%] bg-turq/[0.07] blur-[120px]" />

      {/* Grain. Without it the wide, near-flat areas band visibly on large screens. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" aria-hidden="true">
        <filter id="trust-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#trust-grain)" />
      </svg>
    </div>
  );
}
