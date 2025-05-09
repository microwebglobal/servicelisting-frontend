const apiHostname = new URL(process.env.NEXT_PUBLIC_API_ENDPOINT).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: apiHostname,
        pathname: "/uploads/images/**",
      },
      {
        protocol: "http",
        hostname: apiHostname,
        pathname: "/uploads/images/**",
      },
    ],
  },
};

export default nextConfig;
