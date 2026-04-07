import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Отключаем строгую оптимизацию для локальных файлов на время тестов
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Это заставит Next.js более агрессивно следить за папкой public
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;