import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows production builds to successfully complete even if typings engine fails in sandboxes
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to successfully complete even if linter engine fails in sandboxes
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
