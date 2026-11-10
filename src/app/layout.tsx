import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Setup Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Tailwind
});

const description =
  'Portfolio of Aditya Rekhe - Software Engineer, independent researcher and blockchain enthusiast. Explore it through an interactive terminal or scroll down for the GUI.';

export const metadata: Metadata = {
  title: 'ASRWorkspace | Aditya Rekhe',
  description,
  authors: [{ name: 'Aditya Rekhe', url: 'https://github.com/Geek-ASR' }],
  creator: 'Aditya Rekhe',
  keywords: ['Aditya Rekhe', 'ASRWorkspace', 'Software Engineer', 'Portfolio', 'Terminal portfolio', 'Blockchain', 'TruthLens'],
  openGraph: {
    title: 'ASRWorkspace | Aditya Rekhe',
    description,
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f2027',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" suppressHydrationWarning>
        {/* The body background can be a solid color, and WaveBackground will overlay its gradient */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
