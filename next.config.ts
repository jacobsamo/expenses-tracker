import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.jacobsamo.com",
      },
      {
        protocol: "https",
        hostname: "jacobsamo.com",
      },
      {
        protocol: "https",
        hostname: "expenses.jacobsamo.com",
      },
    ],
  },
};

export default nextConfig;
