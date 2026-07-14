/** @type {import('next').NextConfig} */
const nextConfig = {
  // This ensures output is always in the root `.next` folder for Vercel
  distDir: '.next',

  // Explicitly pin the project root so Turbopack doesn't get confused
  // if there's another lockfile somewhere higher up on your machine
  // (e.g. in your user folder or Downloads).
  turbopack: {
    root: __dirname,
  },

  typescript: {
    // Don't block builds on TypeScript errors (useful for early dev)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;