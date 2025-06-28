import { NextConfig } from "next";
import withPWA from "next-pwa";
import path from "path";

const runtimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts-cache",
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "gstatic-fonts-cache",
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "next-static-cache",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
      },
    },
  },
  {
    urlPattern: /\/_next\/image\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "next-image-cache",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
  {
    urlPattern: /\/api\/.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "apis-cache",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 5, // Reduced from 10
    },
  },
  {
    urlPattern: /.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "others-cache",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 3, // Reduced from 10
    },
  },
];

type RuntimeCaching = {
  urlPattern: RegExp;
  handler:
    | "CacheFirst"
    | "NetworkFirst"
    | "CacheOnly"
    | "NetworkOnly"
    | "StaleWhileRevalidate";
  options?: {
    cacheName: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    networkTimeoutSeconds?: number;
  };
};

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
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle analyzer for production builds
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
