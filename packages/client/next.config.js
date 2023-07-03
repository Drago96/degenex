/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["@degenex/common"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_URL,
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/trading-pairs/track-prices",
        destination: `${process.env.API_BASE_URL}/api/trading-pairs/track-prices`,
      },
    ];
  },
};

module.exports = nextConfig;
