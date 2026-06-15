import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  // Declares Turbopack as the dev bundler (Next.js 16 default).
  // Silences the "webpack config with no turbopack config" warning.
  // @ducanh2912/next-pwa's webpack config is only used during `next build`.
  turbopack: {},

  // Next 16 blocks cross-origin requests to dev-only assets (/_next/*) by
  // default. Without this, opening `next dev` from a phone on the LAN by IP
  // returns 403 for the client JS chunks, so the page renders but never
  // hydrates (buttons do nothing). Allow this machine's LAN origins.
  // The `*` wildcard matches a single segment, so this covers the whole
  // 192.168.1.x subnet (handles the phone's IP changing via DHCP).
  allowedDevOrigins: ["192.168.1.*"],

  // Baseline security headers applied to every route.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Disallow being framed → clickjacking protection.
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME-type sniffing.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak full URLs to third-party origins.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The app uses no camera/mic/geolocation; deny them outright.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withPWAInit({ dest: "public", register: true, reloadOnOnline: true })(baseConfig);
