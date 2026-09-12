import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local public/ paths (uploads, brand, ui) are fine by default
    unoptimized: false,
  },
};

export default nextConfig;
