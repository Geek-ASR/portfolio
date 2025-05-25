import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Knewave } from 'next/font/google'; // Import Knewave
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Configure Knewave font
const knewave = Knewave({
  subsets: ['latin'],
  weight: '400', // Knewave only has a regular 400 weight
  variable: '--font-knewave', // CSS variable for Tailwind
  display: 'swap',
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${knewave.variable}`} suppressHydrationWarning>
      <body className="antialiased font-mono" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
