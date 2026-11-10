'use client';

import type { FC } from 'react';
import { ChevronsDown } from 'lucide-react';

interface ScrollHintProps {
  onClick: () => void;
  text?: string;
}

/**
 * The animated strip below the terminal that invites visitors to scroll down
 * to the graphical version of the portfolio.
 */
const ScrollHint: FC<ScrollHintProps> = ({ onClick, text = 'Scroll down for GUI' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={text}
    className="scroll-hint group flex w-full shrink-0 items-center justify-center gap-3 border-t border-[hsl(var(--accent))]/20 px-4 pt-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--foreground))]/60 outline-none transition-colors hover:bg-[hsl(var(--accent))]/5 focus-visible:bg-[hsl(var(--accent))]/10 sm:text-xs"
  >
    <ChevronsDown className="scroll-hint-arrow h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
    <span aria-hidden="true" className="whitespace-pre">
      {text.split('').map((char, index) => (
        <span key={index} className="scroll-hint-letter" style={{ animationDelay: `${index * 80}ms` }}>
          {char}
        </span>
      ))}
    </span>
    <ChevronsDown className="scroll-hint-arrow h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
  </button>
);

export default ScrollHint;
