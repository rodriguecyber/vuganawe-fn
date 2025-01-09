/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/e-learning-fn',
  assetPrefix: '/e-learning-fn',
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
