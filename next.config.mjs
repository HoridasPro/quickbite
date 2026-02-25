/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'as2.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.deliveryhero.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
};

export default nextConfig;