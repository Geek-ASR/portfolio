'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The GUI now lives on the home page, right below the terminal.
 * This route is kept so that old /gui links keep working.
 */
export default function GuiRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#gui');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] font-mono text-sm text-[hsl(var(--foreground))]">
      Switching to GUI mode...
    </div>
  );
}
