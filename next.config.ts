import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/launchkit-kimi',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
