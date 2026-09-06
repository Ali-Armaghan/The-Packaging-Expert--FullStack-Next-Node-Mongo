import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["isomorphic-dompurify", "jsdom", "sharp"],
  experimental: {
    imgOptTimeoutInSeconds: 30,
    optimizePackageImports: [
      "lucide-react",
      "@tiptap/react",
      "@tiptap/pm",
      "@tiptap/starter-kit",
      "@tiptap/extension-character-count",
      "@tiptap/extension-color",
      "@tiptap/extension-highlight",
      "@tiptap/extension-image",
      "@tiptap/extension-link",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-text-align",
      "@tiptap/extension-text-style",
      "@tiptap/extension-underline",
      "@aws-sdk/client-s3",
      "clsx",
      "tailwind-merge",
      "zod",
      "class-variance-authority",
    ],
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
      {
        protocol: "https",
        hostname: "media.pakfactory.com",
      },
    ],
  },
};

export default nextConfig;
