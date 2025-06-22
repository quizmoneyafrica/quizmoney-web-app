// import type { NextConfig } from "next";
import withPWA from "next-pwa";
import type { Configuration } from "webpack";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const swHeaders = [
  {
    key: "Content-Type",
    value: "application/javascript; charset=utf-8",
  },
  {
    key: "Cache-Control",
    value: "no-cache, no-store, must-revalidate",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self'",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: any = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  webpack: async (
    config: Configuration,
    context: { isServer: boolean; dev: boolean }
  ) => {
    if (!context.isServer && !context.dev) {
      const JavaScriptObfuscator = (await import("webpack-obfuscator")).default;

      config.plugins!.push(
        new JavaScriptObfuscator(
          {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: true,
            disableConsoleOutput: true,
            selfDefending: true,
            stringArray: true,
            stringArrayEncoding: ["rc4"],
            stringArrayThreshold: 1,
            transformObjectKeys: true,
            unicodeEscapeSequence: true,
          },
          ["excluded.js"]
        )
      );
    }

    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        hostname: "parsefiles.back4app.com",
        protocol: "https",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/sw.js",
        headers: swHeaders,
      },
    ];
  },
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
