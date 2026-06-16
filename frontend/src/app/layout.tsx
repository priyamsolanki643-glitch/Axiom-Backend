import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Lumensky",
  description: "Strategist and executioner. Compress your ambition into raw, immutable units of work.",
  authors: [{ name: "FP-OS" }],
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%233b82f6'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient><linearGradient id='g2' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%2310b981'/><stop offset='100%' stop-color='%233b82f6'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='none' stroke='url(%23g1)' stroke-width='4' stroke-dasharray='100 20'><animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='10s' repeatCount='indefinite'/></circle><ellipse cx='50' cy='50' rx='40' ry='15' fill='none' stroke='url(%23g2)' stroke-width='4' transform='rotate(45 50 50)'><animateTransform attributeName='transform' type='rotate' from='45 50 50' to='405 50 50' dur='8s' repeatCount='indefinite'/></ellipse><ellipse cx='50' cy='50' rx='40' ry='15' fill='none' stroke='url(%23g1)' stroke-width='4' transform='rotate(-45 50 50)'><animateTransform attributeName='transform' type='rotate' from='-45 50 50' to='315 50 50' dur='12s' repeatCount='indefinite'/></ellipse><circle cx='50' cy='50' r='10' fill='white'><animate attributeName='opacity' values='0.8;1;0.8' dur='2s' repeatCount='indefinite'/></circle></svg>",
        type: "image/svg+xml",
      }
    ]
  },
  openGraph: {
    title: "Lumensky",
    description: "An AI strategist & executioner. Lock your trajectory.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lumensky",
    description: "An AI strategist & executioner. Lock your trajectory.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
