import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", "hmckokolo.cd"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "auth_token",
            value: undefined,
          },
        ],
      },
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "auth_token",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
