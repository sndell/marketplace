/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "pub-8fbffd02eac84536a6294a8a04e6e48c.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["keyv"],
  // webpack: (config, { isServer }) => {
  //   // Add fallback for 'encoding' module
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     encoding: false,
  //   };

  //   // Ignore the keyv warning
  //   config.ignoreWarnings = [
  //     { module: /node_modules\/keyv/ },
  //   ];

  //   return config;
  // },
};

export default nextConfig;
