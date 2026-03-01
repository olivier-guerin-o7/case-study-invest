import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath: isProd ? "/Finary" : "",
  trailingSlash: true,
};

export default nextConfig;
