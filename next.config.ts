import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  output:"export",
  distDir:"out",
//   assetPrefix: isProd ? 'https://bigjumble.github.io/ActionsTest' : 'http://127.0.0.1:5500/out',
  basePath: `/${process.env.ROUTE?.trim()}`,
};

export default nextConfig;
