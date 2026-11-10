import type {NextConfig} from 'next';

// `npm run build:pages` sets these to produce a static site for GitHub Pages,
// which serves this repository from https://<user>.github.io/portfolio/.
const staticExport = process.env.STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  /* config options here */
  ...(staticExport ? { output: 'export' as const, trailingSlash: true } : {}),
  basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // GitHub Pages has no image optimisation server.
    unoptimized: staticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
