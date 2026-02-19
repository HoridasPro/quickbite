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
    ],
  },
};

export default nextConfig;
