import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The INFII reference project lives inside this directory and has its own
  // package.json. Without an explicit root, Next infers the workspace root from
  // the nearest lockfile and can pick that folder instead of this one.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
