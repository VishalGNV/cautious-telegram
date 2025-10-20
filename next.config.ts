import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Skip checks during build for speed
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript checks to speed up build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build to save time
  },
  // Reduce bundle size and build time
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    unoptimized: true, // Skip image optimization to speed up build
  },
};

export default nextConfig;
