import type { Metadata } from "next";
import { Geist, Geist_Mono, Titillium_Web } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/components/providers/global.provider";
import { Toaster } from "sonner";
import { PWAInstallPrompt } from "@/components/shared/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titilliumWeb = Titillium_Web({
  variable: "--font-titillium-web",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "GrantFox",
  description: "A comprehensive platform for managing grants and funding opportunities",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GrantFox",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "GrantFox",
    title: "GrantFox",
    description: "A comprehensive platform for managing grants and funding opportunities",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional PWA meta tags not covered by Next.js metadata */}
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titilliumWeb.variable} antialiased`}
      >
        <GlobalProvider>{children}</GlobalProvider>
        <Toaster />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
