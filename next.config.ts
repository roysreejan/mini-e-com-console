import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.aazbd.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xcdn.next.co.uk',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
