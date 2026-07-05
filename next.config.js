/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  // Configure webpack to ignore jsPDF optional dependencies
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that jsPDF tries to import but we don't use
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      html2canvas: false,
      dompurify: false,
      canvg: false,
    };

    return config;
  },
};

module.exports = nextConfig;
