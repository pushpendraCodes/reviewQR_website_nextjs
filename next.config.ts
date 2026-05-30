import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/generate',
        destination: '/google-review-qr-code-generator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
