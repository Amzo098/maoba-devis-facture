/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Formats modernes pour des chargements rapides meme sur reseau lent (contexte Guinee)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
