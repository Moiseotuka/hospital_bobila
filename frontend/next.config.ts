import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", "hmckokolo.cd"],
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
