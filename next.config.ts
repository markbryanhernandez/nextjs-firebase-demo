import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: import('next').NextConfig = {
  /* config options here */
};

export default withAnalyzer(nextConfig);
