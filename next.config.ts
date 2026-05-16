import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Tillåt dev-resurser (bl.a. WebSocket för HMR) när du öppnar sajten via en annan host,
   * t.ex. ngrok. Annars ser du "WebSocket connection failed" för /_next/webpack-hmr och
   * klienten kan fastna (laddarskärm m.m.).
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
   */
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com", pathname: "/steam/apps/**" },
    ],
  },
};

export default nextConfig;
