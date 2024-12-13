/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "gms-backend.erichost.app",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
