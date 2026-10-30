import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/decouvrir-dsante',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
