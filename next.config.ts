import withPWA from "next-pwa";
import path from "path";
import { NextConfig } from "next";

// Define runtime caching configuration using the local type definition
const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst" as const,
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /^https:\/\/use\.typekit\.net\/.*/i,
    handler: "CacheFirst" as const,
    options: {
      cacheName: "adobe-fonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: "CacheFirst" as const,
    options: {
      cacheName: "next-static",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /\/_next\/image\/.*/i,
    handler: "CacheFirst" as const,
    options: {
      cacheName: "next-image",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
];

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Compress responses
  compress: true,

  // Optimize images
  images: {
    domains: ["itehtllpvbtcyyrbnltb.supabase.co"],
    formats: ["image/webp", "image/avif"] as const,
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle analyzer for production builds (only if package is installed)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: { resolve: { alias: Record<string, string> } }) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "src"),
      };
      return config;
    },
  }),

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icons/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  skipTrailingSlashRedirect: true,
};

const pwaConfig = {
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!robots.txt", "!sitemap.xml"],
};

export default withPWA(pwaConfig)(nextConfig);
