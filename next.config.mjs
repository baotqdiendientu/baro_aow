const isProd = process.env.NODE_ENV === 'production';
const repoName = 'baro_aow';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'render.albiononline.com',
        pathname: '/v1/**',
      },
    ],
  },
};

export default nextConfig;
