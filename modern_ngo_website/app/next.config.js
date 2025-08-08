/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint checks during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do not allow production builds to successfully complete if there are type errors.
    ignoreBuildErrors: false,
  },
  images: {
    // Disable the built-in Image Optimization API for maximum compatibility
    unoptimized: true,
  },
};

module.exports = nextConfig;
