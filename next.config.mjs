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
        hostname: "https://capstone-course-grid-development-repo.vercel.app/",
        pathname: "/api/images",
      }
    ],
  },
};

export default nextConfig;
