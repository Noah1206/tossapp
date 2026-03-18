import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' as const } : {}),
};

export default nextConfig;
