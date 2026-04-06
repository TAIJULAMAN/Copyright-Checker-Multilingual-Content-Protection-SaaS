import createNextIntlPlugin from 'next-intl/plugin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
