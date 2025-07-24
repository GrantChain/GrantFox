import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/components/providers/global.provider";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeInitializer } from "@/components/providers/ThemeInitializer";

// Optimize font loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add font-display: swap
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Add font-display: swap
  preload: false, // Only preload primary font
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://grantfox.io",
  ),
  title: {
    default: "GrantFox - Open Source Grants",
    template: "%s | GrantFox",
  },
  description:
    "Open Source Grants Platform - Fund and support innovative blockchain projects",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "grants",
    "open source",
    "funding",
    "blockchain",
    "stellar",
    "web3",
    "defi",
  ],
  authors: [
    {
      name: "GrantFox Team",
      url: "https://grantfox.io",
    },
  ],
  creator: "GrantFox Team",
  publisher: "GrantFox",
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/ios/16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/ios/32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/ios/128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/ios/152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GrantFox",
    startupImage: [
      {
        url: "/icons/ios/512.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "GrantFox",
    title: "GrantFox - Open Source Grants",
    description:
      "Open Source Grants Platform - Fund and support innovative blockchain projects",
    url: "https://grantfox.io",
    images: [
      {
        url: "/icons/android/android-launchericon-512-512.png",
        width: 512,
        height: 512,
        alt: "GrantFox Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrantFox - Open Source Grants",
    description:
      "Open Source Grants Platform - Fund and support innovative blockchain projects",
    images: ["/icons/android/android-launchericon-512-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true, // Enable zoom for accessibility
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <ThemeInitializer />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/geist-mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
