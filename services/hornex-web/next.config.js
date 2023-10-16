/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'localhost:3000',
      'hornex.s3.sa-east-1.amazonaws.com',
      'placehold.co',
    ],
  },
};

module.exports = nextConfig;
