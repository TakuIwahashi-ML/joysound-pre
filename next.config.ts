import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/web/',
        permanent: true, // 301リダイレクト（SEOに良い）
      },
    ];
  },
};

export default nextConfig;
