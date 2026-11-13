"use client";

import { useEffect } from "react";

/**
 * Marks the document while the page is scrolling, so decoration can stand still.
 *
 * The orbs behind each band are three very large blurred radials on a slow drift, and
 * the home page carries eighteen of them. Measured over a synthesised scroll, that
 * drift cost 7.1 per cent of frames; with it stopped, 2.5. But the drift is the whole
 * atmosphere of the design, and nobody is admiring it mid-flick — so it stops while
 * the page moves and starts again a moment after it settles.
 *
 * Resuming is invisible. `animation-play-state: paused` holds each orb where it is and
 * continues from the same phase, so there is nothing to jump back from.
 *
 * One passive listener for the whole page, writing a class straight onto the document
 * rather than going through React: this fires on every scroll frame, and a state
 * update here would cost more than the thing it is saving.
 */
const IDLE_AFTER = 140;

export default function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let moving = false;

    const settle = () => {
      moving = false;
      root.classList.remove("is-scrolling");
    };

    const onScroll = () => {
      if (!moving) {
        moving = true;
        root.classList.add("is-scrolling");
      }
      clearTimeout(timer);
      timer = setTimeout(settle, IDLE_AFTER);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      settle();
    };
  }, []);

  return null;
}
