/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Next.js 14.1 expects this under `experimental`; it only moved to the
  // top level as `serverExternalPackages` in 14.2+.
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com'            },
      { protocol: 'https', hostname: 'images.unsplash.com'           },
      { protocol: 'https', hostname: 'via.placeholder.com'           },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'     },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY'                            },
          { key: 'X-Content-Type-Options',  value: 'nosniff'                         },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
