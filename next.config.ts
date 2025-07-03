import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/web/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
