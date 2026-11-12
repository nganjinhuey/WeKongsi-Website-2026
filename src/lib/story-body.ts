/**
 * An article body, as blocks.
 *
 * A story's body is a list-valued translation key — one string per line — because that
 * is how every other piece of copy on this site lives, and an article is not an
 * exception worth carving out. But a flat run of paragraphs is a memo, not a piece of
 * writing: a reader scanning a thousand words needs sections to aim at, a list where
 * the content is a list, and a quotation that looks like somebody said it.
 *
 * So four markers, at the head of a line. They were chosen to read naturally inside a
 * JSON string, which is where whoever writes the next article will meet them:
 *
 * | Line                        | Renders as                                  |
 * | --------------------------- | ------------------------------------------- |
 * | `## How it works`           | a section heading                           |
 * | `- **Lead-in:** the rest`   | a bullet; consecutive ones become one list  |
 * | `" I never expected it.`    | a quotation, set apart                      |
 * | `> Because it matters.`     | the closing line, set apart                 |
 * | anything else               | a paragraph                                 |
 *
 * Everything else about the copy is unchanged: each line still goes through
 * `<RichText>`, so `**bold**` and `[[accent]]` work in a bullet, a heading or a
 * paragraph exactly as they do anywhere else.
 *
 * This is deliberately not Markdown. Markdown would bring a parser, a sanitiser and a
 * long tail of syntax nobody here needs; four prefixes and a switch statement cover
 * every article on the site and can be read in full in under a minute.
 */

export type StoryBlock =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "close"; text: string };

/**
 * Turns a body's lines into blocks.
 *
 * Consecutive `-` lines collapse into one list, which is why this is a fold rather
 * than a map — a bullet on its own is not a list, and three bullets are not three.
 */
export function parseStoryBody(lines: readonly string[]): StoryBlock[] {
  const blocks: StoryBlock[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      blocks.push({ kind: "heading", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      const item = line.slice(2).trim();
      const last = blocks[blocks.length - 1];
      if (last?.kind === "list") last.items.push(item);
      else blocks.push({ kind: "list", items: [item] });
      continue;
    }

    if (line.startsWith('" ')) {
      blocks.push({ kind: "quote", text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({ kind: "close", text: line.slice(2).trim() });
      continue;
    }

    blocks.push({ kind: "para", text: line });
  }

  return blocks;
}

/** Words a minute, for the reading estimate. The usual figure for adult prose. */
const WPM = 220;

/**
 * Minutes to read, from the body's own words — never fewer than one.
 *
 * Markers and markup are stripped first, so `**` and `##` are not counted as words.
 * It is an estimate and is labelled as one; its job is to tell a reader whether this
 * is a two-minute read or a ten-minute one before they commit to it.
 */
export function readingMinutes(lines: readonly string[]): number {
  const words = lines
    .join(" ")
    .replace(/\*\*|\[\[|\]\]|^##\s|^-\s|^"\s|^>\s/gm, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
