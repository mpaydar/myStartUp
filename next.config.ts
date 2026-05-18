import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/** Ensures `.env` is loaded from this app folder when another lockfile exists higher in the tree. */
const projectDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectDir,
  },
  async redirects() {
    return [
      {
        source: "/get_touch",
        destination: "/get_in_touch",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
