"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircleQuestion, RotateCcw, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { external } from "@/lib/routes";
import { CHAT_ROOTS, findChatNode, scopeForPath, type ChatScope } from "@/data/chat";
import { stripLanguage } from "@/lib/i18n";

/**
 * The help widget: one launcher in the corner, and a guided conversation behind it.
 *
 * There is no text box, and that is the design rather than a shortcut. This exists for
 * the visitor who wants one answer and does not fancy scrolling a whole FAQ page to
 * find it — so every question is one we chose and wrote an answer to, and every answer
 * offers the questions people ask next. Nothing is matched, guessed or generated, which
 * for a medical cost-sharing programme matters: there is no wording a visitor can type
 * that produces a confident wrong answer about a waiting period or a cap.
 *
 * The conversation itself is `src/data/chat.ts`. On a plan page it opens on that
 * plan's questions: the easiest thing for a visitor to get wrong here is which of the
 * two products they are reading about, and a helper that answers "RM40 a month, and
 * also RM45 a quarter" on the WeShare page is the thing causing it. WhatsApp lives in
 * the footer because the honest end of a guided path is a human, not a dead end.
 *
 * It is deliberately not a modal. Somebody halfway down the Transparency page checking
 * one thing should not have the page taken away from them, so this sits over the
 * corner, the page stays scrollable, and Escape closes it.
 */

/** WhatsApp's own glyph, inlined — the brand mark is the whole point of the cue. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
    </svg>
  );
}

/** One question tapped, and the answer it gave. */
type Turn = { key: number; nodeId: string };

/**
 * Literal keys, not `ask.greeting${scope}` — the key-existence check only sees keys
 * written out in full, and a greeting that silently renders its own key would be a
 * poor thing to discover in production.
 */
const SCOPE_COPY: Record<ChatScope, { greeting: string; subtitle: string }> = {
  general: { greeting: "ask.greeting", subtitle: "ask.subtitle" },
  weshare: { greeting: "ask.greetingWeshare", subtitle: "ask.subtitleWeshare" },
  wecare: { greeting: "ask.greetingWecare", subtitle: "ask.subtitleWecare" },
};

export default function AskWidget() {
  const { t } = useTranslation();
  const panelId = useId();
  const scope = scopeForPath(stripLanguage(usePathname() ?? "/"));
  const copy = SCOPE_COPY[scope];

  const [open, setOpen] = useState(false);
  /* The conversation is stored with the scope it belongs to, so moving from the
     WeShare page to the WeCare page starts again instead of stranding WeShare answers
     under WeCare's questions. Derived on read rather than reset in an effect: the
     answer to "what is on screen" is a function of where you are, not a thing to go
     and fix afterwards. */
  const [session, setSession] = useState<{ scope: ChatScope; turns: Turn[] }>({
    scope: "general",
    turns: [],
  });

  const launcher = useRef<HTMLButtonElement>(null);
  const chipList = useRef<HTMLUListElement>(null);
  const logEnd = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  const turns = useMemo(
    () => (session.scope === scope ? session.turns : []),
    [session, scope],
  );

  /* The chips on offer are always the last answer's follow-ups, or the opening set. */
  const last = turns.at(-1);
  const options = last ? (findChatNode(last.nodeId)?.next ?? []) : CHAT_ROOTS[scope];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    /* With no text box, the first question is the thing to land on. Found through the
       list rather than a ref on the chip itself: the chips are rendered from a map, and
       a ref threaded into that map reads to the hooks lint rule as a ref being used
       during render. */
    if (open) chipList.current?.querySelector("button")?.focus();
    else launcher.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (turns.length) logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  const choose = (nodeId: string) => {
    seq.current += 1;
    setSession({ scope, turns: [...turns, { key: seq.current, nodeId }] });
  };

  return (
    <>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label={t("ask.title")}
          className="fixed inset-x-4 bottom-[86px] z-40 flex max-h-[min(72vh,580px)] flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-float animate-in fade-in zoom-in-95 sm:inset-x-auto sm:bottom-[96px] sm:right-7 sm:w-[380px]"
        >
          {/* ---- Header ---- */}
          <div className="on-dark grain flex shrink-0 items-center gap-3 bg-band-dark px-5 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-turq-light">
              <MessageCircleQuestion aria-hidden="true" className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[15px] font-semibold text-white">
                {t("ask.title")}
              </span>
              <span className="block text-[12.5px] text-white/90">{t(copy.subtitle)}</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">{t("ask.close")}</span>
            </button>
          </div>

          {/* ---- The conversation ---- */}
          <div
            role="log"
            aria-live="polite"
            aria-label={t("ask.log")}
            className="flex-1 space-y-4 overflow-y-auto bg-mint-soft px-4 py-5"
          >
            <p className="rounded-[18px] rounded-tl-md border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-2">
              {t(copy.greeting)}
            </p>

            {turns.map((turn) => (
              <React.Fragment key={turn.key}>
                {/* The question they tapped is their side of it, so the answer does not
                    have to repeat it back. */}
                <p className="ml-auto w-fit max-w-[85%] rounded-[18px] rounded-br-md bg-deep px-4 py-2.5 text-[14px] leading-relaxed text-white">
                  <span className="sr-only">{t("ask.you")}: </span>
                  {t(`chat.${turn.nodeId}.q`)}
                </p>
                <p className="rounded-[18px] rounded-tl-md border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-2">
                  <span className="sr-only">{t("ask.bot")}: </span>
                  {t(`chat.${turn.nodeId}.a`)}
                </p>
              </React.Fragment>
            ))}

            {options.length > 0 && (
              <div>
                <p className="px-1 text-[12.5px] text-ink-3">
                  {turns.length === 0 ? t("ask.suggestLead") : t("ask.relatedLead")}
                </p>
                <ul ref={chipList} className="mt-2.5 flex flex-col gap-2">
                  {options.map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => choose(id)}
                        className="w-full rounded-[14px] border border-teal-deep/35 bg-white px-3.5 py-2.5 text-left text-[13.5px] font-medium text-teal-ink transition-colors hover:bg-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
                      >
                        {t(`chat.${id}.q`)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div ref={logEnd} />
          </div>

          {/* ---- Where a guided path honestly ends ---- */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-4 py-3.5">
            <a
              href={external.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill bg-deep px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-teal-ink"
            >
              <WhatsAppGlyph className="h-4 w-4 text-[#4BE37F]" />
              {t("ask.whatsapp")}
            </a>
            {turns.length > 0 && (
              <button
                type="button"
                onClick={() => setSession({ scope, turns: [] })}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                {t("ask.reset")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---- The one thing in the corner ---- */}
      <button
        ref={launcher}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={t("ask.launchAria")}
        className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-deep py-2 pl-2 pr-5 text-white shadow-float transition-transform hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep focus-visible:ring-offset-2 sm:bottom-7 sm:right-7"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-grad-pill text-white">
          {open ? (
            <X aria-hidden="true" className="h-[18px] w-[18px]" />
          ) : (
            <MessageCircleQuestion aria-hidden="true" className="h-[20px] w-[20px]" />
          )}
        </span>
        <span className="hidden text-sm font-semibold sm:inline">{t("ask.launch")}</span>
      </button>
    </>
  );
}
