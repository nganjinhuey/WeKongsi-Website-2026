/**
 * The helper's conversation, as a graph.
 *
 * The widget has no text box on purpose. It is not a search engine and it is not an
 * AI — it is a shortcut for somebody who wants one answer and does not fancy scrolling
 * a whole FAQ page to find it. So every question is one we have chosen and written an
 * answer to, and every answer offers the questions people actually ask next.
 *
 * Only the shape lives here: the ids, and what follows what. The copy is in
 * `en.json` under `chat.<id>.q` and `chat.<id>.a`, like every other string on the
 * site. `src/data/chat.test.ts` holds the graph to its own promises — every id
 * referenced exists, nothing is stranded, and nothing offers itself as its own
 * follow-up.
 *
 * The answers here are deliberately warmer and shorter than the FAQ's, and they carry
 * the same figures. Where the two would ever disagree the FAQ and the Program
 * Guidelines are what govern — this is a friendly summary, not the terms.
 */

export type ChatNode = {
  id: string;
  /** What to offer next. Three at most: a longer list stops being a conversation. */
  next: readonly string[];
};

/**
 * Which opening questions a page gets.
 *
 * On a plan page the helper leads with that plan's questions, because the single
 * easiest thing for a visitor to get wrong here is which product they are reading
 * about. "How much is it?" answering with both prices is useful on the home page and
 * actively confusing on the WeShare page, so the plan pages open on `costWeshare` and
 * `costWecare` instead — and on plan-specific versions of joining and waiting, where
 * the shared answers would otherwise describe both products at once.
 *
 * Only the opening set is scoped. Once somebody is in the conversation a follow-up
 * naming the other plan is a comparison they asked for, not a mix-up: the chip says
 * "WeCare price?" on the tin.
 */
export type ChatScope = "general" | "weshare" | "wecare";

export const CHAT_ROOTS: Record<ChatScope, readonly string[]> = {
  general: ["what", "plans", "cost", "join", "wait", "contact"],
  weshare: ["costWeshare", "joinWeshare", "waitWeshare", "shareLimit", "coShare", "hospital"],
  wecare: ["costWecare", "wecareWhat", "joinWecare", "episodes", "doctor", "wecareNot"],
};

/** The language prefix is already stripped by the caller. */
export const scopeForPath = (path: string): ChatScope =>
  path.startsWith("/plans/weshare")
    ? "weshare"
    : path.startsWith("/plans/wecare")
      ? "wecare"
      : "general";

export const chatNodes: readonly ChatNode[] = [
  // --- what this is -------------------------------------------------------
  { id: "what", next: ["insurance", "plans", "trustWho"] },
  { id: "insurance", next: ["what", "trustWho", "join"] },

  // --- the two plans ------------------------------------------------------
  { id: "plans", next: ["costWeshare", "costWecare", "both"] },
  { id: "both", next: ["costWeshare", "costWecare", "joinHow"] },
  { id: "wecareWhat", next: ["episodes", "wecareCap", "costWecare"] },

  // --- money --------------------------------------------------------------
  { id: "cost", next: ["sharingCap", "payHow", "both"] },
  { id: "costWeshare", next: ["sharingCap", "costWecare", "join"] },
  { id: "costWecare", next: ["wecareWhat", "costWeshare", "episodes"] },
  { id: "sharingCap", next: ["trustWhat", "shareLimit", "cost"] },
  { id: "payHow", next: ["miss", "refund", "joinHow"] },
  { id: "refund", next: ["miss", "trustWho", "optOut"] },
  { id: "miss", next: ["payHow", "restart", "refund"] },
  { id: "restart", next: ["miss", "costWecare", "wecareWhat"] },

  // --- joining ------------------------------------------------------------
  { id: "join", next: ["family", "joinNeed", "joinHow"] },
  { id: "joinWeshare", next: ["family", "joinNeed", "waitWeshare"] },
  { id: "joinWecare", next: ["costWecare", "waitWecare", "joinHow"] },
  { id: "family", next: ["joinNeed", "joinHow", "cost"] },
  { id: "joinNeed", next: ["joinHow", "join", "wait"] },
  { id: "joinHow", next: ["joinNeed", "cost", "plans"] },

  // --- when it starts -----------------------------------------------------
  { id: "wait", next: ["preExisting", "emergency", "joinHow"] },
  { id: "waitWeshare", next: ["preExisting", "emergency", "joinHow"] },
  { id: "waitWecare", next: ["wecareWhat", "episodes", "costWecare"] },
  { id: "preExisting", next: ["wait", "join", "wecareWhat"] },

  // --- hospital side ------------------------------------------------------
  { id: "shareLimit", next: ["coShare", "fair", "hospital"] },
  { id: "coShare", next: ["shareLimit", "fair", "hospital"] },
  { id: "fair", next: ["trustWhat", "trustWho", "shareLimit"] },
  { id: "hospital", next: ["emergency", "coShare", "shareLimit"] },
  { id: "emergency", next: ["hospital", "doctor", "contact"] },

  // --- everyday care ------------------------------------------------------
  { id: "doctor", next: ["medicine", "episodes", "wecareWhat"] },
  { id: "medicine", next: ["episodes", "wecareCap", "doctor"] },
  { id: "episodes", next: ["episodesUnused", "wecareCap", "medicine"] },
  { id: "episodesUnused", next: ["episodes", "wecareCap", "costWecare"] },
  { id: "wecareCap", next: ["wecareNot", "episodes", "medicine"] },
  { id: "wecareNot", next: ["wecareCap", "plans", "wecareWhat"] },

  // --- trust --------------------------------------------------------------
  { id: "trustWho", next: ["trustWhat", "refund", "optOut"] },
  { id: "trustWhat", next: ["optOut", "trustWho", "fair"] },
  { id: "optOut", next: ["trustWhat", "refund", "trustWho"] },

  // --- getting hold of someone --------------------------------------------
  { id: "contact", next: ["hospital", "doctor", "joinHow"] },
];

export const findChatNode = (id: string) => chatNodes.find((n) => n.id === id);
