/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@degenex/common"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_URL || "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
