import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.playstation.com" },
      { protocol: "https", hostname: "**.steampowered.com" },
      { protocol: "https", hostname: "**.steamstatic.com" },
      { protocol: "https", hostname: "**.googleapis.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.t.me" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 768, 1024, 1280, 1440],
    imageSizes: [64, 128, 256, 384],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
};

export default nextConfig;