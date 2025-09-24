import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'assets.aceternity.com',
      // Add your Supabase storage domain here if using custom domain
      // 'your-supabase-project.supabase.co',
    ],
    // Allow all domains for now (you can restrict later for security)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
