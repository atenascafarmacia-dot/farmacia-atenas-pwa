import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  // Declares Turbopack as the dev bundler (Next.js 16 default).
  // Silences the "webpack config with no turbopack config" warning.
  // @ducanh2912/next-pwa's webpack config is only used during `next build`.
  turbopack: {},
};

export default withPWAInit({ dest: "public", register: true, reloadOnOnline: true })(baseConfig);
