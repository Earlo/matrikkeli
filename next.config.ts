import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // For standalone serverless builds
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'jrbpxuxzrdettrzhmkza.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

module.exports = nextConfig;
