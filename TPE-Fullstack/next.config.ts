import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["isomorphic-dompurify", "jsdom", "sharp"],
  experimental: {
    imgOptTimeoutInSeconds: 30,
    viewTransition: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "packaging-expert-media.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "packaging-expert-media.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
