import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Pacifico } from 'next/font/google'; // Import Pacifico
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Configure Pacifico font
const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400', // Pacifico only has a regular 400 weight
  variable: '--font-pacifico', // This defines the CSS variable name
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${pacifico.variable}`} suppressHydrationWarning>
      <body className="antialiased font-mono" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
