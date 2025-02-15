import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  /* config options here */
  output:"export",
  distDir:"out",
  assetPrefix: isProd ? 'https://bigjumble.github.io/ActionsTest' : 'http://127.0.0.1:5500/out',
};

export default nextConfig;
