import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Open_Sans, Montserrat, Lato, Source_Sans_3, Oswald } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-sans',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: "ReelMate - AI Reel Generator",
  description: "Generate engaging social media reels with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${sourceSans.variable} ${oswald.variable}`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
