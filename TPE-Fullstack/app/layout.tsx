import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  GoogleTagManagerNoScript,
  GoogleTagManagerScript,
} from "@/components/analytics";
import { InitialSiteLoader } from "@/components/layout/InitialSiteLoader";
import { InitialSiteLoaderMarkup } from "@/components/layout/InitialSiteLoaderMarkup";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <GoogleTagManagerScript />
      </head>
      <body className="initial-loader-active flex min-h-dvh flex-col bg-background text-foreground">
        <GoogleTagManagerNoScript />
        <InitialSiteLoaderMarkup />
        <InitialSiteLoader />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
