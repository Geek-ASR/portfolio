/**
 * A tiny "rich text" model for terminal output.
 * Output is a list of lines, each made of segments. A segment can be plain
 * text, a link, or a clickable command that gets typed into the prompt.
 */

export type Tone = 'accent' | 'muted' | 'strong';

export interface Seg {
  text: string;
  /** Clicking the segment types this command into the prompt and runs it. */
  cmd?: string;
  /** Renders the segment as a link. */
  href?: string;
  tone?: Tone;
}

export interface Line {
  segs: Seg[];
  /** Left padding, in characters. */
  indent?: number;
  /** Extra hanging indent for wrapped lines (e.g. after a "- " bullet), in characters. */
  hang?: number;
  /** Optional fixed-width first column (used for `help`-style tables). */
  key?: Seg[];
  keyWidth?: number;
}

const LINK_RE = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/** Split text into segments, turning URLs and e-mail addresses into links. */
export function linkify(text: string): Seg[] {
  const segs: Seg[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    let token = match[0];
    const start = match.index ?? 0;
    // Do not swallow trailing punctuation into the link.
    const trailing = token.match(/[.,;:)\]]+$/);
    if (trailing) token = token.slice(0, -trailing[0].length);
    if (start > last) segs.push({ text: text.slice(last, start) });
    segs.push({ text: token, href: token.includes('://') ? token : `mailto:${token}` });
    last = start + token.length;
  }
  if (last < text.length) segs.push({ text: text.slice(last) });
  return segs;
}

/** Convert a plain-text file into lines, keeping indentation as a hanging indent. */
export function textToLines(text: string): Line[] {
  return text.split('\n').map((raw) => {
    const indent = raw.length - raw.trimStart().length;
    const body = raw.slice(indent);
    return { segs: linkify(body), indent, hang: body.startsWith('- ') ? 2 : 0 };
  });
}

export const line = (text: string, extra: Partial<Line> = {}): Line => ({ segs: [{ text }], ...extra });

const segsLength = (segs: Seg[] = []) => segs.reduce((n, s) => n + s.text.length, 0);

/** Number of "typed" characters in a line. Empty lines count as one keystroke. */
export const lineLength = (l: Line) => Math.max(1, segsLength(l.key) + segsLength(l.segs));

export const totalLength = (lines: Line[]) => lines.reduce((n, l) => n + lineLength(l), 0);
