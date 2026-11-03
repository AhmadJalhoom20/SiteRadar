import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: ["node:sqlite"],
  devIndicators: false,
  turbopack: { root: process.cwd() },
};
export default config;
