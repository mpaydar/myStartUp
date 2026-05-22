import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { careerLensMarketing } from "@/lib/careerLensMarketing";
import { siteMarketing } from "@/lib/siteMarketing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteMarketing.flagshipProduct} — ${careerLensMarketing.liveViewName} | ${siteMarketing.brand}`,
  description: careerLensMarketing.dashboardTagline,
  verification: {
    google: "PzP1KnZNQqKnlPiBf86EqoyfHQahhM7kl2RH7D4Uakc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
