'use client';

import { useCallback } from 'react';
import { LayoutGrid } from 'lucide-react';
import Terminal from '@/components/terminal/Terminal';
import ScrollHint from '@/components/terminal/ScrollHint';
import Portfolio from '@/components/gui/Portfolio';
import { Button } from '@/components/ui/button';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HomePage() {
  const scrollToGui = useCallback(() => {
    document.getElementById('gui')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, []);

  const scrollToTerminal = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <main>
      {/* Terminal: fills exactly the first screen. */}
      <section id="terminal" aria-label="Terminal" className="terminal-screen relative flex flex-col bg-[hsl(var(--background))]">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToGui}
          className="absolute right-4 top-4 z-10 hidden border-input bg-background/80 text-foreground shadow-md hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          aria-label="Switch to GUI Mode"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Terminal onSwitchToGui={scrollToGui} />
        <ScrollHint onClick={scrollToGui} />
      </section>

      {/* GUI: a regular, scrollable portfolio page. */}
      <Portfolio onOpenTerminal={scrollToTerminal} />
    </main>
  );
}
