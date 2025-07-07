/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: 'app/uploadcare-loader.ts',
  },
}

module.exports = nextConfig 