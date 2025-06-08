
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist Sans/Mono
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Setup Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Tailwind
});

export const metadata: Metadata = {
  title: 'ASRWorkspace',
  description: 'A portfolio website with a terminal interface for ASR projects and development.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" suppressHydrationWarning>
        {/* The body background can be a solid color, and WaveBackground will overlay its gradient */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
