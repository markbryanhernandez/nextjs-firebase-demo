const nextConfig: import('next').NextConfig = {
  // Enable Turbopack for development
  turbopack: {},

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['firebase'],
  },

  // Bundle analyzer (conditional)
  ...(process.env.ANALYZE === 'true' && {
    // Uses @next/bundle-analyzer
    env: {
      ANALYZE: 'true',
    },
  }),
};

export default nextConfig;
