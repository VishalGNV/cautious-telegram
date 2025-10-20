import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize build for Railway
  typescript: {
    // Don't fail build on type errors during Railway deployment
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't fail build on ESLint errors during Railway deployment
    ignoreDuringBuilds: false,
  },
  // Reduce bundle size
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
