import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LunarFlow",
  description: "LunarFlow Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
