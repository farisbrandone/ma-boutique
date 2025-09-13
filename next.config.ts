import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "picsum.photos", "localhost:3000"],
  },
};

export default nextConfig;
