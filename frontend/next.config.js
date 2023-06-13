/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://escomonitor.com.mx/api'
  },
  reactStrictMode: true,
}

module.exports = nextConfig
