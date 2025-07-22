declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: (RegExp | string | ((chunk: unknown) => boolean))[];
    runtimeCaching?: RuntimeCaching[];
    mode?: 'production' | 'development';
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    workboxOptions?: Record<string, unknown>;
  }

  interface RuntimeCaching {
    urlPattern: RegExp | string;
    handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
        purgeOnQuotaError?: boolean;
      };
      cacheKeyWillBeUsed?: (params: { request: Request }) => Promise<string> | string;
      networkTimeoutSeconds?: number;
      plugins?: Record<string, unknown>[];
      precacheFallback?: {
        fallbackURL: string;
      };
      rangeRequests?: boolean;
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }

  function withPWA(pwaConfig: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}