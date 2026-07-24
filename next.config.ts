import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure CSS is properly bundled in production
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
