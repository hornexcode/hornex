/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config')

const nextConfig = {
  images: {
    domains: ['localhost:3000', 'placehold.co'],
  },
  i18n
};

module.exports = nextConfig;
