
import Terminal from '@/components/terminal/Terminal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Link href="/gui" passHref legacyBehavior>
        <Button
          variant="outline"
          size="icon" // Changed from "sm"
          className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-accent hover:text-accent-foreground text-foreground border-input shadow-md"
          aria-label="Switch to GUI Mode"
        >
          <LayoutGrid className="h-5 w-5" /> {/* Adjusted icon size slightly and removed margin, size="icon" handles spacing */}
        </Button>
      </Link>
      <Terminal />
    </div>
  );
}
