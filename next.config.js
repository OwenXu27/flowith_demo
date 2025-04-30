/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/flowith_demo',
  assetPrefix: '/flowith_demo/',
}

module.exports = nextConfig 