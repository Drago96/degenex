/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/trading-pairs/track-prices',
        destination: `${process.env.API_BASE_URL}/api/trading-pairs/track-prices`
      }
    ]
  },
};

module.exports = nextConfig;
