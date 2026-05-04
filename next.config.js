/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Keep unoptimized for cPanel (change to false if cPanel supports image optimization)
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_HASH: process.env.API_HASH,
  },
  poweredByHeader: false, // Reduces response header size
  reactStrictMode: false, // Reduces development overhead
  experimental: {
    // Optimize server-side rendering
    optimizeServerReact: true,
  },
  generateEtags: true, // Improves caching
  compress: true, // Enable gzip compression
  staticPageGenerationTimeout: 180, // Increase timeout for static generation
};

module.exports = nextConfig;
