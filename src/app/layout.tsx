import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import { Roboto, Roboto_Condensed } from 'next/font/google';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// Load Roboto font
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Load Roboto Condensed font
const robotoCondensed = Roboto_Condensed({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  title: "Lunarflow",
  description: "Lunarflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoCondensed.variable}`}>
      <body>
        {/* className={`${geistSans.variable} ${geistMono.variable} antialiased`} */}
        <SessionProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
