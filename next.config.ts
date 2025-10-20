import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize build for Railway - speed up build time
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build to save time
  },
  // Reduce bundle size and build time
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    unoptimized: false,
  },
  // Reduce build output - creates standalone build
  output: 'standalone',
};

export default nextConfig;
