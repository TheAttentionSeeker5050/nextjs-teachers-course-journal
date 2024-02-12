/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "/api/images",
      },
      {
        hostname: "**",
      }
    ],
  },
};

export default nextConfig;
